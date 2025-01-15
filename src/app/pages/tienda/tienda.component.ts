import { Component } from '@angular/core';
import { Paquete } from '../../models/paquete';
import { PaquetesService } from '../../services/paquetes.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  paquetes: Paquete[] = [];
  total = 0;
  page = 1;
  pages = 1;
  limit = 5;
  currentIndex = 0;
  constructor(private paqueteService: PaquetesService, private carritoService: CarritoService ) {}

  ngOnInit(): void {
    this.fetchPaquetes();
  }

  fetchPaquetes(): void {
    this.paqueteService.getAllPaquetesPaginados(this.page, this.limit).subscribe({
      next: (response) => {
        this.paquetes = response.paquetes;
        console.log(this.paquetes)
        this.total = response.total;
        this.page = response.page;
        this.pages = response.pages;
      },
      error: (error) => {
        console.error('Error al cargar los paquetes:', error);
      },
    });
  }


  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  }
  nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.fetchPaquetes();
    }
  }

  addToCart(paquete: Paquete): void {
    const carritoItem: CarritoItem = {
      id: paquete.id,
      nombre: paquete.nombre,
      precio: paquete.precio, // No necesitas usar parseFloat
      cantidad: 1,
      subtotal: paquete.precio // Directamente usa el precio para calcular el subtotal
    };
  
    this.carritoService.agregarAlCarrito(carritoItem);
    this.carritoService.openCarrito(); // Abre el carrito automáticamente
  }
  
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.paquetes.length) % this.paquetes.length;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.paquetes.length;
  }


  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchPaquetes();
    }
  }

}
