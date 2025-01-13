import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-respuesta-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './respuesta-pago.component.html',
  styleUrl: './respuesta-pago.component.css'
})
export class RespuestaPagoComponent {
  isLoading = true; // Indica si está procesando
  success = false; // Indica si el pago fue exitoso
  rejected = false; // Indica si el pago fue rechazado
  errorMessage: string = ''; // Mensaje de error en caso de fallo
  orderDetails: any = null; // Detalles de la orden en caso de éxito

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Capturar parámetros de la URL
    const token = this.route.snapshot.queryParamMap.get('token');
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    const total = this.route.snapshot.queryParamMap.get('total'); // Asegúrate de capturar el total
    const error = this.route.snapshot.queryParamMap.get('message');
  
    if (error) {
      // Si hay un mensaje de error en la URL
      this.mostrarError(decodeURIComponent(error));
      return;
    }
  
    if (token && orderId && total) {
      // Si todos los datos están presentes, muestra los detalles
      this.success = true;
      this.orderDetails = {
        id: orderId,
        total: total, // Asegúrate de que el total sea asignado
      };
      this.isLoading = false;
    } else {
      this.mostrarError('No se recibió información válida de la transacción.');
    }
  }
  


  mostrarError(message: string): void {
    this.success = false;
    this.errorMessage = message;
    this.isLoading = false;
  }

  reintentar(): void {
    this.router.navigate(['/checkout']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/inicio']);
  }

  formatearPesos(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(valor);
  }

}
