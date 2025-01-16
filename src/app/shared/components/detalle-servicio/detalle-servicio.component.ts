import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleServicioService } from '../../../services/detalle-servicio.service';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [],
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.css'
})
export class DetalleServicioComponent {
  titulo: string = '';
  descripcion: string = '';
  imagenUrl: string = '';

  constructor(private route: ActivatedRoute,private detalleServicioService: DetalleServicioService ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      const titulo = params['titulo'];
      const imagen= params['imagen']
      if (titulo) {
        const servicio = this.detalleServicioService.getServicioDetalles(titulo); // Usa el servicio

        if (servicio) {
          this.titulo = servicio.titulo;
          this.descripcion = servicio.descripcion;
          this.imagenUrl = imagen;
        } else {
          this.titulo = 'Servicio no encontrado';
          this.descripcion = '<p>Descripción no disponible.</p>';
          this.imagenUrl = 'ruta-a-imagen-default.jpg'; // Imagen por defecto
        }
      }
    });
  }

}
