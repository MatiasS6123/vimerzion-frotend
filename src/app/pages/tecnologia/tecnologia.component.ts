import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TecnologiasService } from '../../services/tecnologias.service';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-tecnologia',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './tecnologia.component.html',
  styleUrl: './tecnologia.component.css'
})
export class TecnologiaComponent {
  isEditMode = false;
  tecnologiaForm!:FormGroup;
  foto: File | null = null;
  tecnologiaId:string=''
  previewUrl: string | null = null; // Para la vista previa de la imagen
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private tecnologiaService:TecnologiasService,
    private toastr:ToastrService
  ){
    this.tecnologiaForm = this.fb.group({
          nombre: ['', Validators.required],
          descripcion: ['', Validators.required],
          foto:[]
        });
  }
  ngOnInit(): void {
    // Obtener el ID de la URL y cargar el juego si existe
    this.route.params.pipe(
      switchMap((params) => {
        if (params['id']) {
          this.isEditMode = true;
          this.tecnologiaId = params['id'];
          return this.tecnologiaService.findById(params['id']); // Llamar al servicio para obtener la tecnología
        }
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          const tecnologia = response; // Acceder al objeto `data` si viene dentro de `data`
          console.log('Tecnología recibida:', tecnologia);
  
          // Asignar valores al formulario
          this.tecnologiaForm.patchValue({
            nombre: tecnologia.nombre,
            descripcion: tecnologia.descripcion,
          });
  
          // Si hay una imagen, configurar la vista previa
          if (tecnologia.imagen) {
            this.previewUrl = tecnologia.imagen.url; // Mostrar la URL de la imagen actual
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar la tecnología:', error);
      },
    });
  }
  

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('Tipo de archivo no permitido', 'Error');
        this.foto = null;
        this.previewUrl = null; // Limpiar la vista previa si no es válido
        return;
      }
  
      this.foto = file;
  
      // Generar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.foto = null;
      this.previewUrl = null; // Limpiar si no se selecciona ningún archivo
    }
  }


  onSubmit(): void {
    if (this.tecnologiaForm.valid) {
      const formData = this.tecnologiaForm.value;
  
      if (this.isEditMode && this.tecnologiaId) {
        this.tecnologiaService.updateTecnologia(
          this.tecnologiaId,
          formData,
          this.foto as File // Aseguramos que no es null
        ).subscribe({
          next: (response) => {
            console.log('Tecnología actualizada:', response);
            // Manejar éxito
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            // Manejar error
          }
        });
      } else {
        if (this.foto === null) {
          this.toastr.error('Debe seleccionar una imagen', 'Error');
          return;
        }
  
        console.log(formData);
        console.log(this.foto);
        this.tecnologiaService.createTecnologia(
          formData,
          this.foto as File // Aseguramos que no es null
        ).subscribe({
          next: (response) => {
            console.log('Tecnología creada:', response);
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
  


  
}
