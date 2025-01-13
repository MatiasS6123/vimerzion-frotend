import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { Servicio } from '../../models/servicios';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mostrar-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mostrar-servicios.component.html',
  styleUrl: './mostrar-servicios.component.css',
})
export class MostrarServiciosComponent{
  constructor(
    private servicioService: ServiciosService,
    private route: ActivatedRoute
  ) {}

  servicio: Servicio = {
    titulo: '',
    descripcion: '',
    fotos: [],
    activo: false // Inicializamos con un valor por defecto
  };

  currentIndex = 0;
  titleVisible = true;
  defaultName = 'Arriendo';

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const titulo = params['titulo'] || this.defaultName;
      console.log('Loading service for título:', titulo);
      this.loadServiceByName(titulo);
    });
  }

  loadServiceByName(titulo: string) {
    if (titulo) {
      console.log('Loading service:', titulo);
      this.servicioService.getServiciosByName(titulo).subscribe({
        next: (data: Servicio) => {
          console.log('Service data received:', data);
          this.servicio = {
            ...data,
            activo: data.activo ?? false // Manejo de undefined
          };
          this.currentIndex = 0;
          console.log('Initial photos loaded:', data.fotos?.length);
        },
        error: (err) => console.error('Error loading service:', err)
      });
    }
  }

  nextSlide() {
    this.titleVisible = false;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.servicio.fotos.length;
      this.titleVisible = true;
      console.log('Next slide:', this.currentIndex);
    }, 300);
  }

  prevSlide() {
    this.titleVisible = false;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex - 1 + this.servicio.fotos.length) % this.servicio.fotos.length;
      this.titleVisible = true;
      console.log('Previous slide:', this.currentIndex);
    }, 300);
  }

  goToSlide(index: number) {
    if (index !== this.currentIndex) {
      this.titleVisible = false;
      setTimeout(() => {
        this.currentIndex = index;
        this.titleVisible = true;
        console.log('Go to slide:', index);
      }, 300);
    }
  }
}
