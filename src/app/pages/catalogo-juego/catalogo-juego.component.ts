import { Component } from '@angular/core';
import { CatalogJuego, FetchCatalogo } from '../../models/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo-juego.component.html',
  styleUrl: './catalogo-juego.component.css'
})
export class CatalogoJuegoComponent {
  juegos: FetchCatalogo[] = [];
  total: number = 0;
  page: number = 1;
  pages: number = 1;
  limit: number = 10;
  loading: boolean = false;

  constructor(private gameService: CatalogoService) {}

  ngOnInit(): void {
    this.fetchJuegos();
  }

  fetchJuegos(): void {
    this.loading = true;
    this.gameService
      .getAllPaginated(this.page, this.limit)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.juegos = response.games;
          console.log(this.juegos)
          this.total = response.total;
          this.page = response.page;
          this.pages = response.pages;
        },
        error: (error) => {
          console.error('Error al cargar los juegos:', error);
        }
      });
  }

  nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.fetchJuegos();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchJuegos();
    }
  }
}
