import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarritoItem } from '../../../models/carrito';
import { CarritoService } from '../../../services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: CarritoItem[] = [];
  total: number = 0;
  @Output() finalizarCompraEvent = new EventEmitter<void>();
  @Input() isOpen = false; // Controla la apertura del carrito

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    // Sincroniza el carrito y el estado de apertura
    this.carritoService.getCarrito$().subscribe((items) => {
      this.carrito = items;
      this.calcularTotal();
    });

    this.carritoService.getIsOpen$().subscribe((isOpen) => {
      this.isOpen = isOpen; // Actualiza el estado del carrito
    });
  }

  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  }
  finalizarCompra(): void {
    this.finalizarCompraEvent.emit(); // Emitir evento
  }
  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  closeCarrito(): void {
    this.carritoService.closeCarrito(); // Utilizar el método del servicio para cerrar el carrito
  }

  incrementarCantidad(id: number): void {
    this.carritoService.incrementarCantidad(id);
  }

  decrementarCantidad(id: number): void {
    this.carritoService.decrementarCantidad(id);
  }

  eliminarDelCarrito(id: number): void {
    this.carritoService.eliminarDelCarrito(id);
  }
}
