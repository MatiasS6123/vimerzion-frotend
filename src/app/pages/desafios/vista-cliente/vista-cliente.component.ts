import { Component, Input } from '@angular/core';
import { Desafio } from '../../../models/desafios';

@Component({
  selector: 'app-vista-cliente',
  standalone: true,
  imports: [],
  templateUrl: './vista-cliente.component.html',
  styleUrl: './vista-cliente.component.css'
})
export class VistaClienteComponent {
  @Input() desafios: Desafio[] = []; // sin acento

  @Input() currentSlideIndex = 0;

  nextSlide(): void {
    if (this.desafios.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.desafios.length;
    }
  }

  prevSlide(): void {
    if (this.desafios.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.desafios.length) % this.desafios.length;
    }
  }
}
