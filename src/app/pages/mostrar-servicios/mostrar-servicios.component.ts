import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { Servicio } from '../../models/servicios';
import { Subscription } from 'rxjs';
import { SeleccionService } from '../../services/seleccion.service';
import { DetalleServicioService } from '../../services/detalle-servicio.service';

@Component({
  selector: 'app-mostrar-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mostrar-servicios.component.html',
  styleUrl: './mostrar-servicios.component.css',
})
export class MostrarServiciosComponent{
  fotos: { titulo: string; descripcion: string; imagenUrl: string }[] = [];
  currentIndex = 0;
  userSelection: string | null = null;
  constructor(private detalleServicioService: DetalleServicioService) {}

  ngOnInit(): void {
    // Obtener los servicios según la selección
    this.fotos = this.detalleServicioService.getServiciosPorTipo();
    this.userSelection=this.getUserSelection();
    console.log(this.userSelection)
    if (this.fotos.length === 0) {
      console.error('No se encontraron servicios para la selección actual.');
    }
  }

  getUserSelection():string | null{
    return localStorage.getItem('userSelection')
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.fotos.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.fotos.length) % this.fotos.length;
  }

  
}
