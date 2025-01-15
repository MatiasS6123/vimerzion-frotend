import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Orden } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-orden',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './detalle-orden.component.html',
  styleUrl: './detalle-orden.component.css'
})
export class DetalleOrdenComponent {
  orden!: Orden;
  estadoSeleccionado!: string;

  constructor(private route: ActivatedRoute, private ordenesService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de los queryParams
    this.route.queryParams.subscribe((params) => {
      const id = params['id']; // Tomar el ID de los queryParams

      if (id) {
        

        // Llamar al servicio para obtener los detalles de la orden
        this.ordenesService.getOrdenById(id).subscribe({
          next: (response) => {
            this.orden = response.data;
            this.estadoSeleccionado = this.orden.estado;
          },
          error: (error) => {
            
          },
        });
      } else {
        
      }
    });
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  actualizarEstado(): void {
    if (this.estadoSeleccionado !== this.orden.estado) {
      // Llama a un servicio para actualizar el estado de la orden en el backend
      this.ordenesService.updateEstado(this.orden.id, this.estadoSeleccionado).subscribe({
        next: (response) => {
          this.presentToast(response.message,"Exito",'success')
          this.orden.estado = this.estadoSeleccionado;
        },
        error: (error) => {
          this.presentToast(error.message,"Error",'error')
        },
      });
    } else {
      this.presentToast("Estado no actualizado","Advertencia",'warning')
    }
  }

  formatearPesos(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(valor);
  }
}
