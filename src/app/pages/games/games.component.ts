import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogJuego } from '../../models/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { finalize, of, switchMap } from 'rxjs';

interface PlataformaSeleccionada {
  nombre: string;
  imagen: File | null;
  videoUrl: string | null;
  imagenUrl?: string;
}

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit {
  juegoForm!: FormGroup;
  opcionesPlataformas = ['PlayStation 5', 'PlayStation vr', 'Nintendo Switch',"Meta Quest 2","Meta Quest 3","Simuladores PsVr 2","1 Jugador","2 Jugador","3 Jugador","4 Jugador","Simuladores"];
  isEditMode = false;
  juegoId?: string;
  isLoading = false;
  plataformasOriginales: PlataformaSeleccionada[] = [];

  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.juegoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['Aventura', Validators.required],
      activo: [true],
      plataformas: this.fb.array([]),
      hashtags: [''], // <-- nuevo campo
      valoracion: [0, [Validators.min(0), Validators.max(5)]] // <-- nuevo campo con validación
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.juegoId = params['id'];
        if (this.juegoId) {
          this.isEditMode = true;
          this.isLoading = true;
          return this.catalogoService.findById(this.juegoId);
        }
        return of(null);
      })
    ).subscribe({
      next: (juego) => {
        if (juego) {
          this.cargarDatosJuego(juego);
        }
      },
      error: (error) => {
        console.error('Error cargando juego:');
        this.presentToast("Error al cargar el juego", "Error", "error");
        this.router.navigate(['/catalogo']); // Redirigir en caso de error
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private cargarDatosJuego(juego: CatalogJuego): void {
    this.juegoForm.patchValue({
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      categoria: juego.categoria,
      activo: juego.activo,
      hashtags: juego.hashtags?.join(', ') || '', // Se muestra como string separado por comas
      valoracion: juego.valoracion || 0
    });

    // Limpiar plataformas existentes
    while (this.plataformas.length) {
      this.plataformas.removeAt(0);
    }

    // Guardar plataformas originales para comparación
    this.plataformasOriginales = juego.plataformas?.map(p => ({
      nombre: p.nombre,
      imagen: null,
      videoUrl: p.videoUrl || null,
      imagenUrl: p.imagenUrl
    })) || [];

    // Agregar plataformas al formulario
    if (juego.plataformas) {
      juego.plataformas.forEach(plataforma => {
        this.addPlataforma(
          plataforma.nombre,
          null,
          plataforma.videoUrl || '',
          plataforma.imagenUrl
        );
      });
    }
  }

  get plataformas(): FormArray {
    return this.juegoForm.get('plataformas') as FormArray;
  }

  addPlataforma(
    nombre: string,
    imagen: File | null = null,
    videoUrl: string = '',
    imagenUrl: string = ''
  ): void {
    this.plataformas.push(
      this.fb.group({
        nombre: [nombre, Validators.required],
        imagen: [imagen],
        videoUrl: [videoUrl, Validators.required],
        imagenUrl: [imagenUrl]
      })
    );
  }

  removePlataforma(index: number): void {
    const plataforma = this.plataformas.at(index).value;
    // Confirmar antes de eliminar
    if (confirm(`¿Estás seguro de eliminar la plataforma ${plataforma.nombre}?`)) {
      this.plataformas.removeAt(index);
    }
  }

  onPlataformaSeleccionada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const plataforma = selectElement.value;
    if (plataforma && !this.plataformaExiste(plataforma)) {
      this.addPlataforma(plataforma);
    }
  }

  private plataformaExiste(nombrePlataforma: string): boolean {
    return this.plataformas.value.some((p: any) => p.nombre === nombrePlataforma);
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (file.size > maxSize) {
        this.presentToast("La imagen no debe superar 5MB", "Error", "error");
        input.value = ''; // Limpiar input
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.presentToast("Solo se permiten archivos de imagen", "Error", "error");
        input.value = '';
        return;
      }

      this.plataformas.at(index).patchValue({ imagen: file });
    }
  }

  onVideoUrlChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const videoUrl = input.value.trim();
    
    // Validación básica de URL
    if (videoUrl && !videoUrl.startsWith('http')) {
      this.presentToast("Por favor ingrese una URL válida", "Error", "error");
      return;
    }
    
    this.plataformas.at(index).patchValue({ videoUrl });
  }

  onSubmit(): void {
    if (this.juegoForm.invalid) {
      this.presentToast("Por favor complete todos los campos requeridos", "Error", "error");
      return;
    }
  
    this.isLoading = true;
    const formData = this.juegoForm.value;
    const todasLasPlataformas = this.plataformas.value;
  
    // ✅ Transformar hashtags string -> string[]
    formData.hashtags = (formData.hashtags || '')
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);
  
    if (this.isEditMode && this.juegoId) {
      this.catalogoService.updateCatalogoJuego(this.juegoId, formData, todasLasPlataformas)
        .pipe(
          switchMap(() => this.catalogoService.findById(this.juegoId!)),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (juegoActualizado) => {
            this.presentToast("Juego actualizado exitosamente", "Éxito", "success");
            this.cargarDatosJuego(juegoActualizado);
            this.router.navigate(['/catalogo']);
          },
          error: (error) => {
            console.error('Error en actualización:');
            this.presentToast(
              "Error al actualizar el juego. Por favor intente nuevamente",
              "Error",
              "error"
            );
          }
        });
    } else {
      this.catalogoService.createCatalogoJuego(formData, todasLasPlataformas)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.presentToast("Juego creado exitosamente", "Éxito", "success");
            this.router.navigate(['/catalogo']);
          },
          error: (error) => {
            console.error('Error en creación:', error);
            const mensajeError = error?.error?.message || error?.message || 'Error desconocido';
            this.presentToast(
              `Error al crear el juego: ${mensajeError}`,
              "Error",
              "error"
            );
          }
        });
    }
  }
  

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info'): void {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

  // Método para verificar si una plataforma tiene cambios
  plataformaTieneCambios(index: number): boolean {
    const plataformaActual = this.plataformas.at(index).value;
    const plataformaOriginal = this.plataformasOriginales.find(p => p.nombre === plataformaActual.nombre);
    
    if (!plataformaOriginal) return true;
    
    return plataformaActual.videoUrl !== plataformaOriginal.videoUrl ||
           plataformaActual.imagen !== null;
  }

  // Método para resetear el formulario
  resetForm(): void {
    if (confirm('¿Está seguro de querer resetear el formulario? Se perderán los cambios no guardados.')) {
      if (this.isEditMode && this.juegoId) {
        this.catalogoService.findById(this.juegoId).subscribe({
          next: (juego) => this.cargarDatosJuego(juego),
          error: () => this.presentToast("Error al recargar los datos", "Error", "error")
        });
      } else {
        this.initForm();
      }
    }
  }
}