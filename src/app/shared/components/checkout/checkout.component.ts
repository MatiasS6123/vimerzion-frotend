import { Component } from '@angular/core';
import { CarritoItem } from '../../../models/carrito';
import { CarritoService } from '../../../services/carrito.service';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  opcionesEnvio = [
    { nombre: 'Zona Norte', costo: 30 },
    { nombre: 'Zona Centro', costo: 10000 },
    { nombre: 'Zona Sur', costo: 15000 },
    { nombre: 'Extremos de santiago', costo: 20000 },
  ];
  submitted = false;
  
  opcionEnvio: number | null = null; // Valor inicial como null

  totalConEnvio = 0;

  modalVisible = false; // Controla la visibilidad del modal
  constructor(
    private carritoService: CarritoService,
    private orderService: OrderService,
    private router: Router,
    private authService:AuthService,
    private toastr:ToastrService 
  ) {}

  ngOnInit(): void {
    this.carritoService.getCarrito$().subscribe((items) => {
      this.carrito = items;
      this.calcularTotal();
      this.getUserId()
      this.actualizarTotal();
      
    });
  }

  actualizarTotal(): void {
    const envio = Number(this.opcionEnvio) || 0; // Forzar conversión a número
    this.totalConEnvio = this.total + envio;
  }
  
  abrirModal(): void {
    this.modalVisible = true; // Muestra el modal
  }

  cerrarModal(): void {
    this.modalVisible = false; // Oculta el modal
  }
  
  getUserId(){
    this.authService.getId().subscribe(
      (response)=>{
        this.usuarioId=response.id

      }
    )
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }
  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0); 
    this.actualizarTotal(); // Actualizar el total con envío
  }

  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  }
  
  confirmarCompra(): void {
    this.submitted = true; // Marcar que se ha intentado enviar el formulario
  
    // Validar campos requeridos
    if (!this.telefono || !this.direccion || !this.opcionEnvio) {
      this.presentToast('Por favor, complete todos los campos obligatorios.', 'Error', 'error');
      return; // Detener la ejecución si faltan campos
    }
  
    const orderData = {
      usuarioId: this.usuarioId,
      paquetes: this.carrito.map((item) => ({
        paqueteId: item.id,
        cantidad: item.cantidad,
      })),
      direccionEnvio: this.direccion,
      telefonoContacto: this.telefono,
      metodoPago: 'WEBPAY', // Método de pago
      notas: this.notas,
      costoEnvio: this.opcionEnvio,
    };
  
    // Mostrar pantalla de carga mientras se procesa
  
    // Llamada al servicio para crear la orden con Webpay
    this.orderService.createOrderWithWebpay(orderData).subscribe({
      next: (response: any) => {
        // Verificar si existe la URL de la transacción
        if (response.transactionUrl) {
          // Redirigir al usuario a Webpay
          window.location.href = response.transactionUrl;
        } else {
          this.router.navigate(['/checkout']); // Volver al checkout en caso de error
        }
      },
      error: (error) => {
        this.presentToast('Error al procesar la compra', 'Error', 'error');
        this.router.navigate(['/checkout']); // Volver al checkout en caso de error
      },
    });
  }
  
  

}
