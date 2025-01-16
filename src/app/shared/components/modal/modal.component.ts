import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Título del Diálogo';
  @Input() message: string = 'Mensaje de ejemplo.';
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string | null = 'Cancelar';
  @Input() isVisible: boolean = false;
  @Input() disableClickOutside: boolean = false;
  @Input() disableEscapeKey: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (!this.disableEscapeKey && this.isVisible) {
      this.closeModal();
    }
  }

  closeModal(): void {
    if (!this.disableClickOutside) {
      this.isVisible = false;
      this.onClose.emit();
    }
  }

  confirmAction(): void {
    this.onConfirm.emit();
  }

  // Prevenir que el clic en el contenido del modal lo cierre
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

}
