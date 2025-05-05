import { AuthService } from '../../services/auth.service'; // Asegúrate de importar correctamente
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service'; // Tu servicio de Desafíos
import { ToastrService } from 'ngx-toastr';
import { Desafio } from '../../models/desafios'; // Tu modelo de Desafío

@Component({
  selector: 'app-desafio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './desafios.component.html',
  styleUrl: './desafios.component.css'
})
export class DesafiosComponent {
  userRole: 'ADMINISTRADOR' | 'cliente' | null = null;
  isEditMode = false;
  desafioForm!: FormGroup;
  desafioId: string = '';
  desafios: Desafio[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  currentSlideIndex: number = 0;
  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private desafiosService: DesafiosService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.desafioForm = this.fb.group({
      desafio: ['', Validators.required],
      experiencia: ['', Validators.required],
      valor: ['', Validators.required],
      premio: ['', Validators.required],
      tiempoMaximo: [0, [Validators.required, Validators.min(1)]],
      intentos: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.authService.getRole().subscribe({
      next: (res) => {
        if (res.role === 'ADMINISTRADOR' || res.role === 'cliente') {
          this.userRole = res.role;
        } else {
          this.userRole = null;
        }
         // 'admin' o 'cliente'
        this.initData();
      },
      error: () => {
        this.userRole = null;
        this.initData(); // Carga básica si no hay rol disponible
      }
    });
  }
  private initData(): void {
    this.route.queryParams.subscribe((params) => {
      this.desafioId = params['_id'];
  
      if (this.desafioId && this.userRole === 'ADMINISTRADOR') {
        this.isEditMode = true;
        this.loadDesafio(this.desafioId);
      } else {
        this.loadDesafios();
      }
    });
  }
    
  private loadDesafio(id: string): void {
    this.desafiosService.getDesafioById(+id).subscribe({
      next: (desafio) => {
        if (desafio) {
          this.desafioForm.patchValue({
            desafio: desafio.desafio,
            experiencia: desafio.experiencia,
            valor: desafio.valor,
            premio: desafio.premio,
            tiempoMaximo: desafio.tiempoMaximo,
            intentos: desafio.intentos,
          });
        }
      },
      error: (error) => {
        this.presentToast('Error al cargar el desafío', 'Error', 'error');
      }
    });
  }
  
  nextSlide(): void {
    if (this.desafios.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.desafios.length;
    }
  }

  prevSlide(): void {
    if (this.desafios.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.desafios.length) % this.desafios.length;
    }
  }
  onDelete(id: string): void {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este desafío?');
  
    if (confirmar) {
      this.desafiosService.deleteDesafio(id).subscribe({
        next: (response) => {
          this.presentToast('Desafío eliminado exitosamente', 'Éxito', 'success');
          this.loadDesafios(); // Recargar lista para reflejar el cambio
        },
        error: (error) => {
          this.presentToast('Error al eliminar el desafío', 'Error', 'error');
        }
      });
    }
  }
  
  private loadDesafios(): void {
    this.desafiosService.getAllDesafios(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.desafios = response.desafios.filter(d => d.activo === true);

      },
      error: (error) => {
        this.presentToast('Error al cargar los desafíos', 'Error', 'error');
      }
    });
  }
  onSubmit(): void {
    if (this.desafioForm.valid) {
      const formData = this.desafioForm.value;

      if (this.isEditMode && this.desafioId) {
        this.desafiosService.updateDesafio(this.desafioId, formData).subscribe({
          next: (response) => {
            this.presentToast('Desafío actualizado exitosamente', 'Éxito', 'success');
            this.desafioForm.reset({
              desafio: '',
              experiencia: '',
              valor: '',
              premio: '',
              tiempoMaximo: 0,
              intentos: 1
            });
            this.desafioForm.markAsPristine();
            this.desafioForm.markAsUntouched();
            this.desafioForm.updateValueAndValidity();

          },
          error: (error) => {
            this.presentToast('Error al actualizar el desafío', 'Error', 'error');
          }
        });
      } else {
        this.desafiosService.createDesafio(formData).subscribe({
          next: (response) => {
            this.presentToast('Desafío creado exitosamente', 'Éxito', 'success');
          },
          error: (error) => {
            this.presentToast('Error al crear el desafío', 'Error', 'error');
          }
        });
      }
    }
  }
  
  // 👉 AQUI agregas el onCancel
  onCancel(): void {
    this.desafioForm.reset({
      desafio: '',
      experiencia: '',
      valor: '',
      premio: '',
      tiempoMaximo: 0,
      intentos: 1,
    });

    this.isEditMode = false;
  }
  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }
}
