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

    fotos= [
    { titulo: 'Servicio 2', url: 'assets/servicio-empresa4.png' },
    { titulo: 'Servicio 3', url: 'assets/servicio-empresa5.png' },
    { titulo: 'Servicio 4', url: 'assets/servicio-empresa6.png' },
    ]
  currentIndex = 0;
  titleVisible = true;
  
  ngOnInit(): void {

    
  }

  

  nextSlide() {
    this.titleVisible = false;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.fotos.length;
      this.titleVisible = true;
    }, 300);
  }

  prevSlide() {
    this.titleVisible = false;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex - 1 + this.fotos.length) % this.fotos.length;
      this.titleVisible = true;
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
