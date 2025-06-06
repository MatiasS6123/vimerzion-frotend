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
  logoUrl:string='';
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
            // Asignar logo a cada juego dependiendo de la plataforma (sin modificar la interfaz)
            this.assignPlatformLogo(platform)
          },
          error: (error) => {
            console.error('Error al cargar el catálogo de juegos:');
            this.juegos = [];
          },
        });
    });
  }
  assignPlatformLogo(platformName: string | null): void {
    if (platformName) {
      this.logoUrl = this.getLogoUrl(platformName); // Asigna el logo dinámicamente
    } else {
      this.logoUrl = 'assets/default-logo.svg';
    }
  }


  getLogoUrl(platformName: string): string {
    const logos: { [key: string]: string } = {
      'PlayStation 5': 'assets/ps5.png',
      'PlayStation vr': 'assets/PlayStation_VR2_logo (1).svg',
      'Nintendo Switch': 'assets/Nintendo_Switch_Logo (1).svg',
      'Meta Quest 2': 'assets/Oculus_(10).svg',
      'Meta Quest 3': 'assets/meta2.svg',
      'Simuladores PsVr 2': 'assets/PlayStation_VR2_logo (1).svg',
      '1 Jugador': 'assets/Oculus_(10).svg',
      '2 Jugador': 'assets/Oculus_(10).svg',
      '3 Jugador': 'assets/Oculus_(10).svg',
      '4 Jugador': 'assets/Oculus_(10).svg',
      'Simuladores': 'assets/PlayStation_VR2_logo (1).svg',
    };
    
    // Si no hay logo para la plataforma, devuelve un logo predeterminado
    return logos[platformName] || 'assets/default-logo.svg';
  }
  
  openModal(juego: any): void {
    console.log('Juego seleccionado:', juego);
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
      hashtags: juego.hashtags || [],  // Asegurándonos de asignar hashtags
      valoracion: juego.valoracion || 0 // Asegurándonos de asignar valoracion (valor por defecto 0 si es undefined)
    };
  
    // Depuración: Verificar los valores de hashtags y valoración
    console.log('selectedJuego', this.selectedJuego);
    console.log('Hashtags:', this.selectedJuego.hashtags);
    console.log('Valoración:', this.selectedJuego.valoracion);
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
      meta_quest_3: 'Meta Quest 3',
      simuladores_psvr_2:'Simuladores PsVr 2',
      jugador_1 : '1 Jugador',
      jugador_2 : '2 Jugador',
      jugador_3 : '3 Jugador',
      jugador_4 : '4 Jugador',
      simuladores : 'Simuladores'
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
