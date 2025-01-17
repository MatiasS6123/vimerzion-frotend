import { Component } from '@angular/core';
import { TecnologiasService } from '../../services/tecnologias.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Tecnologia } from '../../models/tecnologias';

@Component({
  selector: 'app-mostrar-tecnologias',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mostrar-tecnologias.component.html',
  styleUrl: './mostrar-tecnologias.component.css'
})
export class MostrarTecnologiasComponent {
  constructor(
    private tecnologiaService: TecnologiasService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  tecnologia: Tecnologia = {
    nombre: '',
    descripcion: '',
    imagen: { url: '' }, // Inicializamos con un objeto vacío
    activo: false,
  };

  defaultName = 'Oculus 2';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const nombre = params['nombre'] ? this.mapPlatform(params['nombre']) :"";;
      console.log(nombre)
      this.loadTechnologyByName(nombre);
    });
  }

  loadTechnologyByName(nombre: string) {
    if (nombre) {
      this.tecnologiaService.getTecnologiaByName(nombre).subscribe({
        next: (data: Tecnologia) => {
          this.tecnologia = {
            ...data,
            activo: data.activo ?? false, // Manejo de undefined
          };
        },
        error: (err) => console.error('Error loading technology:'),
      });
    }
  }


  mapPlatform(nombre: string): string {
    const nombreTecnologia: { [key: string]: string } = {
      oculus_quest_2: 'Oculus Quest 2',
      tecnologia_haptica: 'Tecnología Haptica',
      hologramas_3d: 'Hologramas 3D',
      simulador_parapente:'Simulador Parapente',
      simulador_de_vuelo:'Simulador de Vuelo',
      simulador_de_carreras:'Simulador de Carreras',
      estasciones_virtuales:'Estasciones Virtuales',
      plataforma_360_View:'Plataforma 360° View',

    };
    return nombreTecnologia[nombre] || nombre; // Devolver el valor original si no está en el mapa
  }

  goToDetalle(): void {
      const titulo = this.tecnologia.nombre // Usa el título del servicio si no hay título en la foto
      const imagen = this.tecnologia.imagen.url // Valida que la URL esté disponible
      this.router.navigate(['/detalle-servicio'], {
        queryParams: { titulo, imagen }
      });
    
  }
  

}
