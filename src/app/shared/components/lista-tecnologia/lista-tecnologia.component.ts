import { Component } from '@angular/core';
import { Tecnologia } from '../../../models/tecnologias';
import { TecnologiasService } from '../../../services/tecnologias.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-lista-tecnologia',
  standalone: true,
  imports: [CommonModule,RouterLink,PaginationComponent],
  templateUrl: './lista-tecnologia.component.html',
  styleUrl: './lista-tecnologia.component.css'
})
export class ListaTecnologiaComponent {
  tecnologias: Tecnologia[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  limit: number = 10;

  constructor(private tecnologiasService: TecnologiasService,private router:Router) {}

  ngOnInit(): void {
    this.loadTecnologias(this.currentPage, this.limit);
  }

  loadTecnologias(page: number, limit: number): void {
    this.tecnologiasService.getAllTecnologias(page, limit).subscribe({
      next: (response) => {
        this.tecnologias = response.tecnologias;
        this.totalItems = response.total;
        this.currentPage = page;
        this.totalPages = Math.ceil(response.total / this.limit);
      },
      error: (error) => {
        console.error('Error al cargar tecnologías:');
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadTecnologias(page, this.limit);
    }
  }

  handleAction(_id: string): void {
    //console.log(_id)
    this.router.navigate(['/gestion-tecnologias'], { queryParams: { _id: _id } });

  }


}
