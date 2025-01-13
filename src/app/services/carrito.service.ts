import { Injectable } from '@angular/core';
import { CarritoItem } from '../models/carrito';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: CarritoItem[] = [];
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);
  private isOpenSubject = new BehaviorSubject<boolean>(false); // Estado del carrito

  constructor() {
    this.cargarDesdeStorage(); // Cargar datos del carrito al iniciar
    this.isOpenSubject.next(false); // Asegura que el carrito comience cerrado
  }
  

  getCarrito$() {
    return this.carritoSubject.asObservable();
  }

  incrementarCantidad(id: number): void {
    const index = this.carrito.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.carrito[index].cantidad++;
      this.carrito[index].subtotal = this.carrito[index].cantidad * this.carrito[index].precio;
      this.carritoSubject.next(this.carrito);
      this.guardarEnStorage();
    }
  }
  
  decrementarCantidad(id: number): void {
    const index = this.carrito.findIndex((item) => item.id === id);
    if (index !== -1) {
      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad--;
        this.carrito[index].subtotal = this.carrito[index].cantidad * this.carrito[index].precio;
        this.carritoSubject.next(this.carrito);
        this.guardarEnStorage();
      } else {
        this.eliminarDelCarrito(id); // Si la cantidad es 1, elimina el ítem
      }
    }
  }
  

  agregarAlCarrito(item: CarritoItem): void {
    const index = this.carrito.findIndex((producto) => producto.id === item.id);
    if (index !== -1) {
      this.carrito[index].cantidad += item.cantidad;
      this.carrito[index].subtotal = this.carrito[index].cantidad * this.carrito[index].precio;
    } else {
      this.carrito.push({ ...item, subtotal: item.precio * item.cantidad });
    }
    this.carritoSubject.next(this.carrito);
    this.guardarEnStorage();
  }

  eliminarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter((producto) => producto.id !== id);
    this.carritoSubject.next(this.carrito);
    this.guardarEnStorage();
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.carritoSubject.next(this.carrito);
    this.guardarEnStorage();
  }

  private guardarEnStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  cargarDesdeStorage(): void {
    const data = localStorage.getItem('carrito');
    if (data) {
      this.carrito = JSON.parse(data);
      this.carritoSubject.next(this.carrito);
    }
  }

  getIsOpen$() {
    return this.isOpenSubject.asObservable();
  }

  toggleCarrito(): void {
    const currentState = this.isOpenSubject.getValue();
    this.isOpenSubject.next(!currentState);
  }
  
  openCarrito(): void {
    this.isOpenSubject.next(true);
  }
  
  closeCarrito(): void {
    this.isOpenSubject.next(false);
  }
  
}
