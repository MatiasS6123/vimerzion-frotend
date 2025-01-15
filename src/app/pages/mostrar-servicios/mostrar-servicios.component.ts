import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private route: ActivatedRoute,
    private router:Router
  ) {}

  servicio: Servicio = {
    titulo: '',
    descripcion: '',
    fotos: [],
    activo: false // Inicializamos con un valor por defecto
  };

  currentIndex = 0;
  titleVisible = true;
  defaultName = 'Empresas';

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const titulo = params['titulo'] || this.defaultName;
      this.loadServiceByName(titulo);
    });
  }

  loadServiceByName(titulo: string) {
    if (titulo) {
      this.servicioService.getServiciosByName(titulo).subscribe({
        next: (data: Servicio) => {
          this.servicio = {
            ...data,
            activo: data.activo ?? false // Manejo de undefined
          };
          this.currentIndex = 0;
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
    }, 300);
  }

  prevSlide() {
    this.titleVisible = false;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex - 1 + this.servicio.fotos.length) % this.servicio.fotos.length;
      this.titleVisible = true;
    }, 300);
  }

  goToDetalle(): void {
    if (this.servicio.fotos.length > 0 && this.currentIndex < this.servicio.fotos.length) {
      const titulo = this.servicio.fotos[this.currentIndex]?.titulo || this.servicio.titulo; // Usa el título del servicio si no hay título en la foto
      const imagen = this.servicio.fotos[this.currentIndex]?.url; // Valida que la URL esté disponible
      this.router.navigate(['/detalle-servicio'], {
        queryParams: { titulo, imagen }
      });
    } else {
      console.warn('No hay fotos disponibles para redirigir al detalle.');
    }
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
