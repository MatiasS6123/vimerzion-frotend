import { Component } from '@angular/core';
import { Paquete } from '../../models/paquete';
import { PaquetesService } from '../../services/paquetes.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule,ContactComponent],
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
  user:string ="";
  isModalOpen: boolean = false;
  constructor(private paqueteService: PaquetesService, private carritoService: CarritoService ) {}

  ngOnInit(): void {
    this.fetchPaquetes();
    this.user=this.getTypeUser()??'';

  }



  getTypeUser(): string | null {
    return localStorage.getItem('userSelection'); // Obtiene el tipo de usuario desde localStorage
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
        console.error('Error al cargar los paquetes:');
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
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  
  getDescripcionLista(): string[] {
  const descripcion = this.paquetes[this.currentIndex]?.descripcion || '';

  return descripcion
    .split(/[\n.|•|-]+/g) // Divide por saltos de línea, puntos, viñetas y guiones
    .map(item => item.trim()) // Elimina espacios en cada ítem
    .filter(item => item.length > 0); // Elimina elementos vacíos
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
