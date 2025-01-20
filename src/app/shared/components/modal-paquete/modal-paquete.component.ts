import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { CatalogoService } from '../../../services/catalogo.service';
import { Paquete } from '../../../models/paquete';
import { PaquetesService } from '../../../services/paquetes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-paquete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-paquete.component.html',
  styleUrl: './modal-paquete.component.css'
})
export class ModalPaqueteComponent {
  @Input() isVisible = false; // Controla la visibilidad del modal
  @Output() closeModal = new EventEmitter<void>(); // Emite un evento para cerrar el modal
  @Output() paquetesSeleccionados = new EventEmitter<Paquete[]>(); // Emite los paquetes seleccionados
  modalHeight = 0;
  paquetes: Paquete[] = [];
  paquetesSeleccionadosTemp: Paquete[] = [];
  paginaActual = 1;
  totalPaginas = 1;
  paquetesPorPagina = 5;

  constructor(private paqueteService: PaquetesService) {}

  ngOnInit(): void {
    this.cargarPagina(this.paginaActual);
    
  }

  cargarPagina(pagina: number): void {
    this.paqueteService
      .getAllPaquetesPaginados(pagina, this.paquetesPorPagina)
      .subscribe({
        next: (response) => {
          this.paquetes = response.paquetes;
          this.paginaActual = response.page;
          this.totalPaginas = response.pages;
        },
        error: (err) => {
          console.error('Error al cargar paquetes paginados:', err);
        },
      });
  }

  togglePaqueteSeleccionado(paquete: Paquete): void {
    const index = this.paquetesSeleccionadosTemp.findIndex((p) => p.id === paquete.id);
    if (index > -1) {
      this.paquetesSeleccionadosTemp.splice(index, 1);
    } else {
      this.paquetesSeleccionadosTemp.push(paquete);
    }
  }

 

  
  confirmarPaquetes(): void {
    this.paquetesSeleccionados.emit(this.paquetesSeleccionadosTemp);
    this.closeModal.emit();
  }

  cerrar(): void {
    this.closeModal.emit();
  }
  
  // Método para limpiar el estado del modal
  limpiarEstado(): void {
    this.paquetesSeleccionadosTemp = [];
  }


}
