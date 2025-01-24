import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-servicios-contacto',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './info-servicios-contacto.component.html',
  styleUrl: './info-servicios-contacto.component.css'
})
export class InfoServiciosContactoComponent {

  currentIndex = 0;
  // Imágenes del slider
  images = [
    { url: 'assets/servicio-empresa.jpg' },
    { url: 'assets/servicio-empresa2.jpg' },
    { url: 'assets/servicio-empresa3.jpg' },
  ];



  get transform() {
      return `translateX(-${this.currentIndex * 100}%)`;
    }
  
     // Navegar a la imagen anterior
     prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  
    // Navegar a la imagen siguiente
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  
}
