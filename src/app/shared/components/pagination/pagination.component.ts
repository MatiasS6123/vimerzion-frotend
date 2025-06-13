import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 1; // Página actual
  @Input() totalPages: number = 1; // Total de páginas

  @Output() pageChange = new EventEmitter<number>(); // Emite el cambio de página

  changePage(newPage: number) {
   // console.log("🔄 Intentando cambiar a página:", newPage, "de", this.totalPages);

    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageChange.emit(newPage);
     // console.log("✅ Página cambiada a:", newPage);
    } else {
     // console.log("❌ No se puede cambiar de página, fuera de rango.");
    }
  }
  

}
