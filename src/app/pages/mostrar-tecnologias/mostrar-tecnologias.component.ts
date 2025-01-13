import { Component } from '@angular/core';
import { TecnologiasService } from '../../services/tecnologias.service';
import { ActivatedRoute } from '@angular/router';
import { Tecnologia } from '../../models/tecnologias';

@Component({
  selector: 'app-mostrar-tecnologias',
  standalone: true,
  imports: [],
  templateUrl: './mostrar-tecnologias.component.html',
  styleUrl: './mostrar-tecnologias.component.css'
})
export class MostrarTecnologiasComponent {
  constructor(
    private tecnologiaService: TecnologiasService,
    private route: ActivatedRoute
  ) {}

  tecnologia: Tecnologia = {
    nombre: '',
    descripcion: '',
    imagen: { url: '' }, // Inicializamos con un objeto vacío
    activo: false,
  };

  defaultName = 'Oculus';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const nombre = params['nombre'] || this.defaultName;
      console.log('Loading technology for name:', nombre);
      this.loadTechnologyByName(nombre);
    });
  }

  loadTechnologyByName(nombre: string) {
    if (nombre) {
      console.log('Loading technology:', nombre);
      this.tecnologiaService.getTecnologiaByName(nombre).subscribe({
        next: (data: Tecnologia) => {
          console.log('Technology data received:', data);
          this.tecnologia = {
            ...data,
            activo: data.activo ?? false, // Manejo de undefined
          };
          console.log('Image loaded:', data.imagen?.url);
        },
        error: (err) => console.error('Error loading technology:', err),
      });
    }
  }


}
