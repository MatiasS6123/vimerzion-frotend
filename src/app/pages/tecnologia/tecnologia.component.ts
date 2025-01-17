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
          nombre: ['Oculus Quest 2', Validators.required],
          descripcion: ['', Validators.required],
          activo:[true],
          foto:[]
        });
  }
  ngOnInit(): void {
    // Obtener el ID de la URL y cargar la tecnología si existe
    this.route.queryParams.subscribe((params) => {
      this.tecnologiaId = params['_id'];
  
      if (this.tecnologiaId) {
        this.isEditMode = true;
  
        // Llamar al servicio para obtener los detalles de la tecnología
        this.tecnologiaService.findById(this.tecnologiaId).subscribe({
          next: (tecnologia) => {
  
            if (tecnologia) {
              // Llenar el formulario con los datos de la tecnología
              this.tecnologiaForm.patchValue({
                nombre: tecnologia.nombre,
                descripcion: tecnologia.descripcion,
                activo:tecnologia.activo,

              });
  
              // Si hay una imagen, configurarla en la vista previa
              if (tecnologia.imagen && tecnologia.imagen.url) {
                this.previewUrl = tecnologia.imagen.url; // Mostrar la URL de la imagen actual
              } else {
                console.warn('No se encontró imagen asociada a la tecnología.');
                this.previewUrl = null; // Asegurarse de que la vista previa esté limpia
              }
            }
          },
          error: (error) => {
            
          },
        });
      } else {
      
      }
    });
  }
  
  

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
      if (!allowedTypes.includes(file.type)) {
        this.presentToast('Tipo de archivo no permitido', 'Error',"error");
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
            this.presentToast("tecnologia actualizada","Exito","success")
          },
          error: (error) => {
            this.presentToast("Error al actualizar","Error","error")
          }
        });
      } else {
        if (this.foto === null) {
          this.toastr.error('Debe seleccionar una imagen', 'Error');
          return;
        }
  
        this.tecnologiaService.createTecnologia(
          formData,
          this.foto as File // Aseguramos que no es null
        ).subscribe({
          next: (response) => {
           this.presentToast("Tecnologia creada","Exito","success")
          },
          error: (error) => {
            this.presentToast("Error al crear","Error","error")
          }
        });
      }
    }
  }
  

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }
  
}
