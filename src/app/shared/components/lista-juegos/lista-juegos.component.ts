import { Component } from '@angular/core';
import { CatalogoService } from '../../../services/catalogo.service';
import { CatalogJuego, FetchCatalogo } from '../../../models/catalogo';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-juegos',
  standalone: true,
  imports: [PaginationComponent,RouterLink,CommonModule],
  templateUrl: './lista-juegos.component.html',
  styleUrl: './lista-juegos.component.css'
})
export class ListaJuegosComponent {
  games: CatalogJuego[] = [];
  totalGames: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1; // Nueva propiedad para almacenar el total de páginas

  constructor(private gameService: CatalogoService, private router: Router) {}

  ngOnInit() {
    this.loadGames(this.currentPage, this.itemsPerPage);
  }

  handleAction(id: string): void {
    this.router.navigate(['/gestion-juegos'], { queryParams: { id: id } });
  }

  loadGames(page: number, limit: number) {
  //  console.log('🔄 Solicitando juegos - Página:', page, ' Límite:', limit);
    
    this.gameService.getAllPaginated(page, limit).subscribe({
      next: (response) => {
    //    console.log('✅ Respuesta recibida:', response);
  
        this.games = response.games.map((game, index) => {
      //    console.log(`🎮 Juego ${index + 1}:`, game);
  
          return {
            id: game.id,
            nombre: game.nombre,
            descripcion: game.descripcion || 'Sin descripción',
            plataformas: game.plataformas, // Aquí puedes también loggear game.plataformas
            categoria: game.categoria || 'Sin categoría',
            activo: true,
          };
        });
  
        this.totalGames = response.total;
        this.totalPages = Math.ceil(this.totalGames / this.itemsPerPage);
        //console.log('📄 Total juegos:', this.totalGames, ' Total páginas:', this.totalPages);
      },
      error: (err) => console.error('❌ Error al cargar los juegos:', err),
    });
  }
  
  

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadGames(this.currentPage, this.itemsPerPage);
  }
}
