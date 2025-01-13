import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogJuego } from '../../models/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';

interface PlataformaSeleccionada {
  nombre: string;
  imagen: File | null;
}
@Component({
  selector: 'app-games',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {
  juegoForm: FormGroup;
  plataformasSeleccionadas: PlataformaSeleccionada[] = [];
  opcionesPlataformas = ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PC'];
  isEditMode = false;
  juegoId?: string;
  id?: string;

  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.juegoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la URL y cargar el juego si existe
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    
      if (this.id) {
        this.isEditMode = true;
        this.juegoId = this.id;
    
        // Llamar al servicio para obtener los detalles del juego
        this.catalogoService.findById(this.id).subscribe({
          next: (juego) => {
            console.log('Juego recibido:', juego);
    
            if (juego) {
              // Llenar el formulario con los datos del juego
              this.juegoForm.patchValue({
                nombre: juego.nombre,
                descripcion: juego.descripcion,
                categoria: juego.categoria,
                activo: juego.activo,
              });
    
              console.log('Plataformas antes de mapear:', juego.plataformas);
    
              // Validar si 'plataformas' existe y es un array
              if (juego.plataformas && Array.isArray(juego.plataformas)) {
                this.plataformasSeleccionadas = juego.plataformas.map((p) => ({
                  nombre: p.nombre,
                  imagen: null, // No podemos cargar el archivo original
                }));
              } else {
                console.warn('No se encontraron plataformas en el juego.');
                this.plataformasSeleccionadas = []; // Asegurar que sea un array vacío
              }
            }
          },
          error: (error) => {
            console.error('Error al cargar el juego:', error);
            this.router.navigate(['/juegos']); // Redirigir en caso de error
          },
        });
      } else {
        console.warn('No se recibió un ID en los queryParams.');
      }
    });
  }    
  
  

  onPlataformaSeleccionada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const plataforma = selectElement.value;
    
    if (plataforma && !this.plataformasSeleccionadas.some(p => p.nombre === plataforma)) {
      this.plataformasSeleccionadas.push({
        nombre: plataforma,
        imagen: null
      });
    }
  }

  onFileChange(event: Event, plataformaNombre: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const index = this.plataformasSeleccionadas.findIndex(p => p.nombre === plataformaNombre);
      
      if (index !== -1) {
        this.plataformasSeleccionadas[index].imagen = file;
      }
    }
  }

  

  onSubmit(): void {
    if (this.juegoForm.valid && this.plataformasSeleccionadas.length > 0) {
      const formData = this.juegoForm.value;
      const plataformasConImagenes = this.plataformasSeleccionadas
        .filter(p => p.imagen !== null)
        .map(p => ({
          nombre: p.nombre.toLowerCase().replace(/\s+/g, '_'), // Formatear el nombre
          imagen: p.imagen as File
        }));

      if (this.isEditMode && this.juegoId) {
        this.catalogoService.updateCatalogoJuego(
          this.juegoId,
          formData,
          plataformasConImagenes
        ).subscribe({
          next: (response) => {
            console.log('Juego actualizado:', response);
            // Manejar éxito
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            // Manejar error
          }
        });
      } else {
        console.log(formData)
        console.log(plataformasConImagenes)
        this.catalogoService.createCatalogoJuego(
          formData,
          plataformasConImagenes
        ).subscribe({
          next: (response) => {
            console.log('Juego creado:', response);
            // Manejar éxito
          },
          error: (error) => {
            console.error('Error:', error);
            // Manejar error
          }
        });
      }
    }
  }

  removePlataforma(nombrePlataforma: string): void {
    this.plataformasSeleccionadas = this.plataformasSeleccionadas
      .filter(p => p.nombre !== nombrePlataforma);
  }
   

}
