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

  
}
