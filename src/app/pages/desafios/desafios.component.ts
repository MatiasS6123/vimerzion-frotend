import { AuthService } from '../../services/auth.service'; // Asegúrate de importar correctamente
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service'; // Tu servicio de Desafíos
import { ToastrService } from 'ngx-toastr';
import { Desafio } from '../../models/desafios'; // Tu modelo de Desafío
import { VistaClienteComponent } from './vista-cliente/vista-cliente.component';
@Component({
  selector: 'app-desafio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, VistaClienteComponent  ],
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
  itemsPerPage = 50;
  currentSlideIndex: number = 0;
  mostrarFormulario: boolean = false;
  paginaActual: number = 1;
elementosPorPagina: number = 5;
totalPaginas: number = 1;
pagedDesafios: any[] = [];

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
  formFields = [
  { name: 'desafio', label: 'Desafío', type: 'text', placeholder: 'Nombre del desafío' },
  { name: 'experiencia', label: 'Experiencia', type: 'text', placeholder: 'Experiencia del desafío' },
  { name: 'valor', label: 'Valor (puntos)', type: 'text', placeholder: 'Valor en puntos' },
  { name: 'premio', label: 'Premio (gemas)', type: 'text', placeholder: 'Premio en gemas' },
  { name: 'tiempoMaximo', label: 'Tiempo Máximo (minutos)', type: 'number', placeholder: 'Tiempo máximo permitido' },
  { name: 'intentos', label: 'Intentos', type: 'number', placeholder: 'Cantidad de intentos permitidos' },
];

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
  desafiosFiltrados: any[] = [];
filtro: string = '';

filtrarDesafios(): void {
  if (!this.filtro.trim()) {
    this.desafiosFiltrados = [...this.desafios];
  } else {
    this.desafiosFiltrados = this.desafios.filter(d =>
      d.desafio.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  this.paginaActual = 1;
  this.actualizarPaginacion();
}

    actualizarPaginacion(): void {
  const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
  const fin = inicio + this.elementosPorPagina;
  this.totalPaginas = Math.ceil(this.desafiosFiltrados.length / this.elementosPorPagina);
  this.pagedDesafios = this.desafiosFiltrados.slice(inicio, fin);
}

  paginaAnterior(): void {
  if (this.paginaActual > 1) {
    this.paginaActual--;
    this.actualizarPaginacion();
  }
}

paginaSiguiente(): void {
  if (this.paginaActual < this.totalPaginas) {
    this.paginaActual++;
    this.actualizarPaginacion();
  }
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
      //  console.log(response);
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
