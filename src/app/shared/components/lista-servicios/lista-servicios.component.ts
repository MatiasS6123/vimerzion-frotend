import { Component } from '@angular/core';
import { Servicio } from '../../../models/servicios';
import { ServiciosService } from '../../../services/servicios.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-lista-servicios',
  standalone: true,
  imports: [CommonModule,PaginationComponent,RouterLink],
  templateUrl: './lista-servicios.component.html',
  styleUrl: './lista-servicios.component.css'
})
export class ListaServiciosComponent {
  servicios: Servicio[] = [];
  totalServices: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private servicioService: ServiciosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadServices(this.currentPage, this.itemsPerPage);
  }

  handleAction(id: string): void {
    this.router.navigate(['/gestion-servicios'], { queryParams: { id: id } });
  }

  loadServices(page: number, limit: number) {
    this.servicioService.getAllServicios(page, limit).subscribe({
      next: (response) => {
        this.servicios = response.servicios;
        this.totalServices = response.total;
        this.totalPages = Math.ceil(this.totalServices / this.itemsPerPage);
      },
      error: (err) => console.error('Error al cargar los servicios:'),
    });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadServices(this.currentPage, this.itemsPerPage);
  }
}
