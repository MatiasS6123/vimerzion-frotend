import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '../../services/servicios.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from '../../models/servicios';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {

  servicioForm!: FormGroup;
  isEditMode: boolean = false;
  id: string | null = null;
  isValidForm: boolean = false;
  constructor(
    private fb: FormBuilder,
    private servicioService: ServiciosService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  
    // Escuchar cambios en el formulario
    this.servicioForm.statusChanges.subscribe(() => {
      this.updateFormValidity();
    });
  
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
  
      if (this.id) {
        this.isEditMode = true;
        this.loadServiceData(this.id);
      } else {
        this.isEditMode = false;
      }
    });
  }
  
  private updateFormValidity(): void {
    this.isValidForm =
      this.servicioForm.valid &&
      this.fotos.controls.some((control) => !!control.value.url);
  }
  

  private initializeForm(): void {
    this.servicioForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      activo: [true],
      fotos: this.fb.array([]), // FormArray para imágenes con títulos
    });
  }

  get fotos(): FormArray {
    return this.servicioForm.get('fotos') as FormArray;
  }

  private loadServiceData(id: string): void {
    this.servicioService.findById(id).subscribe({
      
      next: (service: Servicio) => {

        this.servicioForm.patchValue({
          titulo: service.titulo,
          descripcion: service.descripcion,
          activo: service.activo,
        });

        // Cargar las imágenes existentes
        service.fotos?.forEach((foto) => {
          this.fotos.push(
            this.fb.group({
              url: [foto.url, Validators.required],
              titulo: [foto.titulo, Validators.required],
              descripcion_foto: [foto.descripcion_foto, Validators.required]
            })
          );
        });
        console.log(this.servicioForm.value)
      },
      error: () => {
        this.presentToast('Error al cargar los datos del servicio.', 'Error', 'error');
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        // Crear solo una entrada por archivo con todos los campos necesarios
        this.fotos.push(
          this.fb.group({
            url: [''], // Se llenará en el backend
            titulo: ['Sin título'], // Título por defecto
            descripcion_foto: ['Sin descripcion'], // Descripción predeterminada
            file: [file]
          })
        );
      });
    }
  }

  removeImage(index: number): void {
    this.fotos.removeAt(index); // Eliminar la imagen del FormArray
  }
  onSubmit(): void {
    if (this.servicioForm.invalid) {
      this.presentToast('Formulario inválido. Por favor, complete todos los campos.', 'Error', 'error');
      return;
    }
  
    // Filtrar y preparar las fotos
    const fotosExistentes = this.fotos.controls
      .filter(control => control.value.url) // Solo fotos con URL (existentes)
      .map(control => ({
        url: control.value.url,
        titulo: control.value.titulo || 'Sin título',
        descripcion_foto: control.value.descripcion_foto,

      }));
  
    const fotosNuevas = this.fotos.controls
      .filter(control => control.value.file) // Solo fotos nuevas
      .map(control => ({
        url: '', // URL vacía para nuevas fotos
        titulo: control.value.titulo || 'Sin título',
        descripcion_foto: control.value.descripcion_foto,
      }));
  
    const servicio: Servicio = {
      titulo: this.servicioForm.get('titulo')?.value,
      descripcion: this.servicioForm.get('descripcion')?.value,
      activo: this.servicioForm.get('activo')?.value ?? true,
      fotos: [...fotosExistentes, ...fotosNuevas]
    };
  
    console.log('Servicio enviado:', servicio);
    // Obtener solo los archivos nuevos
    const archivos: File[] = this.fotos.controls
      .filter(control => control.value.file)
      .map(control => control.value.file);
  
    if (this.isEditMode && this.id) {
      this.updateServicio(servicio, archivos);
    } else {
      this.createServicio(servicio, archivos);
    }
  }
  
  
  
  private updateServicio(servicio: Servicio, archivos: File[]): void {
    if (this.id) {
      this.servicioService.updateServicio(this.id, servicio, archivos).subscribe({
        next: () => {
          this.presentToast('Servicio actualizado correctamente.', 'Éxito', 'success');
        },
        error: (err) => {
          this.presentToast(err.message, 'Error', 'error');
        },
      });
    }
  }
  

  private createServicio(servicio: Servicio, archivos: File[]): void {
    this.servicioService.createServicio(servicio, archivos).subscribe({
      next: () => {
        this.presentToast('Servicio creado correctamente.', 'Éxito', 'success');
        this.servicioForm.reset();
        this.fotos.clear();
      },
      error: (err) => {
        this.presentToast(err.message, 'Error', 'error');
      },
    });
  }

  private presentToast(message: string, title: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.toastr[type](message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  } 
}
