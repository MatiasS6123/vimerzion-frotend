import { Component } from '@angular/core';
import { CarritoItem } from '../../../models/carrito';
import { CarritoService } from '../../../services/carrito.service';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  carrito: CarritoItem[] = [];
  total = 0;
  telefono = '';
  direccion = '';
  usuarioId=0
  notas=''

  constructor(
    private carritoService: CarritoService,
    private orderService: OrderService,
    private router: Router,
    private authService:AuthService 
  ) {}

  ngOnInit(): void {
    this.carritoService.getCarrito$().subscribe((items) => {
      this.carrito = items;
      this.calcularTotal();
      this.getUserId()
      
    });
  }

  getUserId(){
    this.authService.getId().subscribe(
      (response)=>{
        this.usuarioId=response.id

      }
    )
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  }
  
  confirmarCompra(): void {
    const orderData = {
      usuarioId:this.usuarioId,
      paquetes: this.carrito.map((item) => ({
        paqueteId: item.id,
        cantidad: item.cantidad,
      })),
      direccionEnvio: this.direccion,
      telefonoContacto: this.telefono,
      metodoPago: 'WEBPAY', // Método de pago
      notas:this.notas,
    };
  
    // Mostrar pantalla de carga mientras se procesa
    
    // Llamada al servicio para crear la orden con Webpay
    this.orderService.createOrderWithWebpay(orderData).subscribe({
      next: (response: any) => {
        console.log('url',response.transactionUrl)
        // Verificar si existe la URL de la transacción
        if (response.transactionUrl) {
          // Redirigir al usuario a Webpay
          window.location.href = response.transactionUrl;
        } else {
          console.error('No se recibió la URL de Webpay.');
          this.router.navigate(['/checkout']); // Volver al checkout en caso de error
        }
      },
      error: (error) => {
        console.error('Error al procesar la orden:', error);
        this.router.navigate(['/checkout']); // Volver al checkout en caso de error
      },
    });
  }
  

}
