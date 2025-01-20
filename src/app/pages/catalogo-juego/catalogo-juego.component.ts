import { Component } from '@angular/core';
import { CatalogJuego, FetchCatalogo } from '../../models/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  selectedJuego: any | null = null; // Juego seleccionado para el modal
  constructor(private gameService: CatalogoService, private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchJuegos();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/default-game.jpg';
    }
  }

  fetchJuegos(): void {
    this.route.queryParams.subscribe((params) => {
      const platform = params['platform'] ? this.mapPlatform(params['platform']) : null;
  
      this.loading = true;
      this.gameService
        .getCatalogData(this.page, this.limit, platform)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (response) => {
            this.juegos = response.games;
            this.total = response.total;
            this.page = response.page;
            this.pages = response.pages;
          },
          error: (error) => {
            console.error('Error al cargar el catálogo de juegos:');
            this.juegos = [];
          },
        });
    });
  }

  
  
  openModal(juego: any): void {
    if (!juego.plataforma || typeof juego.plataforma !== 'object') {
      console.error('Plataforma no definida o no es un objeto:');
      return;
    }
  
    const sanitizedVideoUrl = this.sanitizeVideoUrl(juego.plataforma.videoUrl);
  
    this.selectedJuego = {
      ...juego,
      plataforma: {
        ...juego.plataforma,
        videoUrl: sanitizedVideoUrl, // SafeResourceUrl
      },
    };
  }
  

  
  sanitizeVideoUrl(videoUrl: string): SafeResourceUrl {
    if (videoUrl?.includes('youtube.com/watch')) {
      const embedUrl = videoUrl.replace('watch?v=', 'embed/');
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
  
  
  
  mapPlatform(platform: string): string {
    const platformMap: { [key: string]: string } = {
      playstation_5: 'PlayStation 5',
      playstation_vr: 'PlayStation vr',
      nintendo_switch: 'Nintendo Switch',
      meta_quest_2:'Meta Quest 2',
      simuladores_psvr_2:'Simuladores PsVr 2',
    };
    return platformMap[platform] || platform; // Devolver el valor original si no está en el mapa
  }

  closeModal(): void {
    this.selectedJuego = null;
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

  trackById(index: number, item: FetchCatalogo): string {
    return item._id;
  }
}
