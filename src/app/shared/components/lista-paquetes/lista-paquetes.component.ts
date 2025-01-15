import { Component } from '@angular/core';
import { PaquetesService } from '../../../services/paquetes.service';
import { Paquete, PaqueteCrud } from '../../../models/paquete';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [PaginationComponent,RouterLink,CommonModule],
  templateUrl: './lista-paquetes.component.html',
  styleUrl: './lista-paquetes.component.css'
})
export class ListaPaquetesComponent {
  paquetes: PaqueteCrud[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  limit: number = 10;

  constructor(private paqueteService: PaquetesService,private router:Router) {}

  ngOnInit(): void {
    this.loadPaquetes(this.currentPage, this.limit);
  }

  loadPaquetes(page: number, limit: number): void {
    this.paqueteService.getAllPaquetes(page, limit).subscribe({
      next: (response) => {
        this.paquetes = response.packages;
        this.currentPage = response.page;
        this.totalPages = response.pages;
        this.totalItems = response.total;
      },
      error: (error) => {
        console.error('Error al cargar paquetes:');
      },
    });
  }

  onPageChange(page: number): void {
    this.loadPaquetes(page, this.limit);
  }

  handleAction(id: number): void {
    this.router.navigate(['/gestion-paquetes'], { queryParams: { id: id } });
  }
  
  formatearPesos(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(valor);
  }


}
