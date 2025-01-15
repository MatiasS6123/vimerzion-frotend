import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogJuego } from '../../models/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';

interface PlataformaSeleccionada {
  nombre: string;
  imagen: File | null;
  videoUrl: string | null;
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
  opcionesPlataformas = ['PlayStation 5', 'PlayStation vr', 'Nintendo Switch', 'Oculus'];
  isEditMode = false;
  juegoId?: string;

  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.juegoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      activo: [true],
      plataformas: this.fb.array([]) // FormArray inicializado
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.juegoId = params['id'];
      if (this.juegoId) {
        this.isEditMode = true;
        this.catalogoService.findById(this.juegoId).subscribe({
          next: (juego) => {
            this.juegoForm.patchValue({
              nombre: juego.nombre,
              descripcion: juego.descripcion,
              categoria: juego.categoria,
              activo: juego.activo,
            });
            if (juego.plataformas) {
              juego.plataformas.forEach((plataforma: any) => {
                this.addPlataforma(plataforma.nombre, null, plataforma.videoUrl || '');
              });
            }
          },
          error: () => this.presentToast("Error al cargar el juego", "Error", "error"),
        });
      }
    });
  }

  get plataformas(): FormArray {
    return this.juegoForm.get('plataformas') as FormArray;
  }

  addPlataforma(nombre: string, imagen: File | null = null, videoUrl: string = ''): void {
    this.plataformas.push(
      this.fb.group({
        nombre: [nombre, Validators.required],
        imagen: [imagen],
        videoUrl: [videoUrl, Validators.required],
      })
    );
  }

  removePlataforma(index: number): void {
    this.plataformas.removeAt(index);
  }

  onPlataformaSeleccionada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const plataforma = selectElement.value;
    if (plataforma && !this.plataformas.value.some((p: any) => p.nombre === plataforma)) {
      this.addPlataforma(plataforma);
    }
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.plataformas.at(index).patchValue({ imagen: file });
    }
  }

  onVideoUrlChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const videoUrl = input.value;
    this.plataformas.at(index).patchValue({ videoUrl });
  }

  onSubmit(): void {
    if (this.juegoForm.valid) {
      const formData = this.juegoForm.value;
      const plataformasConImagenes = this.plataformas.value.filter((p: any) => p.imagen !== null);

      if (this.isEditMode && this.juegoId) {
        this.catalogoService.updateCatalogoJuego(this.juegoId, formData, plataformasConImagenes).subscribe({
          next: () => this.presentToast("Juego actualizado", "Éxito", "success"),
          error: () => this.presentToast("Error al actualizar el juego", "Error", "error"),
        });
      } else {
        this.catalogoService.createCatalogoJuego(formData, plataformasConImagenes).subscribe({
          next: () => this.presentToast("Juego creado", "Éxito", "success"),
          error: () => this.presentToast("Error al crear el juego", "Error", "error"),
        });
      }
    }
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }
   

}
