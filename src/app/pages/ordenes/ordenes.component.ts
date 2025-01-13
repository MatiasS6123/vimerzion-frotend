import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { RoleResponse } from '../../models/user';
import { OrderDetail } from '../../models/order';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css',
})
export class OrdenesComponent implements OnInit {
  role!: string;
  id: number = 0;
  orders: OrderDetail[] = [];
  pagination = { totalItems: 0, currentPage: 1, pageSize: 10 }; // Inicializar con valores predeterminados
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    forkJoin({
      id: this.authService.getId(),
      role: this.authService.getRole()
    }).subscribe(({ id, role }) => {
      this.id = id.id; // Ajustar según la estructura de la respuesta
      this.role = role.role; // Ajustar según la estructura de la respuesta
      console.log('Rol:', this.role, 'ID:', this.id);
  
      if (this.role === 'ADMINISTRADOR') {
        this.loadOrders(0, 10);
      } else {
        this.loadOrdersById();
      }
    }, (error) => {
      console.error('Error al obtener el rol o el ID:', error);
      this.errorMessage = 'Error al cargar la información del usuario.';
    });
  }

  loadOrders(skip: number, take: number) {
    this.orderService.getAllOrders(skip, take).subscribe(
      (response) => {
        this.orders = response.data.ordenes;
        this.pagination = response.data.pagination;
      },
      (error) => {
        this.errorMessage = error.message || 'Error al cargar órdenes';
        console.error('Error al cargar órdenes:', error);
      }
    );
  }

  loadOrdersById(){
    const userId=this.id;
    this.orderService.getAllOrdersById(userId, 0, 10).subscribe(
      (response) => {
        console.log(response.data); // Para verificar qué está recibiendo
        this.orders = response.data?.ordenes || [];
        this.pagination = response.data?.pagination || { totalItems: 0, currentPage: 1, pageSize: 10 };
      },
      (error) => {
        this.errorMessage = error.message || 'Error al cargar órdenes';
        console.error('Error al cargar órdenes:', error);
      }
    );
    
    
  }

  getId() {
    this.authService.getId().subscribe((response) => {
      this.id = response.id; // Asignar correctamente el valor
    });
  }

  

  getRole() {
    this.authService.getRole().subscribe(
      (response) => {
        this.role = response.role; // Asignar correctamente el rol
        console.log(this.role);
        
        // Cargar órdenes según el rol
        if (this.role === 'ADMINISTRADOR') {
          this.loadOrders(0, 10);
        } else {
          this.loadOrdersById(); // Llama un método que cargue el ID y luego las órdenes
        }
      },
      (error) => {
        this.errorMessage = error.message || 'Error al obtener el rol.';
      }
    );
  }
  

  viewOrder(orderId: number): void {
    console.log(`Ver detalles de la orden con ID: ${orderId}`);
    // Puedes redirigir al detalle de la orden, por ejemplo:
    // this.router.navigate(['/order-details', orderId]);
  }
}
