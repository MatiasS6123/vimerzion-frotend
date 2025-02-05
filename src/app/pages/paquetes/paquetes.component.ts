import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paquete, PaqueteCrud } from '../../models/paquete';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../services/paquetes.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.css'
})
export class PaquetesComponent implements OnInit {
  paqueteForm!:FormGroup
  paqute:Paquete[]=[];
  isEditMode:boolean=false
  id:number=0
  existFile: string = '';
  selectedFile: File | null = null;

    // Opciones de días disponibles (Visual: Primera letra en mayúscula)
    diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private fb:FormBuilder,private paqueteService:PaquetesService,
    private route:ActivatedRoute,private toastr:ToastrService
  ){}

  ngOnInit() {
    this.initializeForm();

    // Detectar si estamos en modo edición o creación
    this.route.queryParams.subscribe((params) => {
      this.id = params['id']; // Leer el parámetro "id" de la URL

      if (this.id) {
        this.isEditMode = true;
        this.loadPackageData(this.id); // Cargar datos del agente
      } else {
        this.isEditMode = false;
      }
    });
  }

   private initializeForm(): void {
      this.paqueteForm = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio:[0,Validators.required],
        stock:[0,Validators.required],
        activo: [true],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        cuposDiarios: [6, Validators.required],
        diasDisponibles: this.fb.array([]),
        foto: [], // FormArray para imágenes con títulos
      });
      this.inicializarDiasDisponibles();
    }


    private inicializarDiasDisponibles() {
      this.diasSemana.forEach(() => {
        this.diasDisponibles.push(this.fb.control(false)); // Falso por defecto
      });
    }

    get diasDisponibles(): FormArray<FormControl> {
      return this.paqueteForm.get('diasDisponibles') as FormArray<FormControl>;
    }
  
    toggleDia(index: number) {
      let control = this.diasDisponibles.at(index);
      control.setValue(!control.value);
    }
    presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
      this.toastr[tipo](mensaje, titulo, {
        timeOut: 5000,               // Duración del mensaje
        positionClass: 'toast-top-center', // Posición: arriba en el centro
        
      });
    }
    private loadPackageData(id: number): void {
      this.paqueteService.getPackageById(id).subscribe({
        next: (paquete: PaqueteCrud) => {
          this.existFile = paquete.foto; // Mantener como URL de la imagen
          this.paqueteForm.patchValue({
            nombre:paquete.nombre,
            descripcion: paquete.descripcion,
            precio: paquete.precio,
            stock: paquete.stock,
            cuposDiarios: paquete.cuposDiarios,
            fechaInicio: this.formatDate(paquete.fechaInicio),
            fechaFin: this.formatDate(paquete.fechaFin),
            activo:paquete.activo,
          });
            // Convertir días a formato correcto en la interfaz
          paquete.diasDisponibles.forEach((dia: string) => {
          let index = this.diasSemana.findIndex(d => d.toUpperCase() === dia.toUpperCase());
          if (index !== -1) {
            this.diasDisponibles.at(index).setValue(true);
          }
        });
        },
        error: (error) => this.presentToast(error.message, 'Error', 'error')
      });
    }

    private formatDate(fecha: Date | string | null): string {
      if (!fecha) return ''; // Si es null o undefined, devolver un string vacío
    
      if (fecha instanceof Date) {
        return fecha.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
      }
    
      return fecha.split('T')[0]; // Si ya es string, extraer solo la fecha
    }
    

    onSubmit(): void {
      if (this.paqueteForm.invalid) {
        this.presentToast('Formulario inválido','Error','error');
        return;
      }
    
      const paquete: PaqueteCrud = {
        nombre: this.paqueteForm.get('nombre')?.value,
        descripcion: this.paqueteForm.get('descripcion')?.value,
        precio: this.paqueteForm.get('precio')?.value,
        stock: this.paqueteForm.get('stock')?.value,
        fechaInicio: this.paqueteForm.get('fechaInicio')?.value, // ✅ Ahora se envía la fecha de inicio
        fechaFin: this.paqueteForm.get('fechaFin')?.value, // ✅ Ahora se envía la fecha de fin
        cuposDiarios: this.paqueteForm.get('cuposDiarios')?.value, // ✅ Ahora se envían los cupos diarios
        diasDisponibles: this.diasSemana
          .filter((_, i) => this.diasDisponibles.at(i).value)
          .map(dia => dia.toUpperCase()), // ✅ Se convierte a mayúsculas antes de enviar
        activo: this.paqueteForm.get('activo')?.value,
        foto: this.existFile
      };
    
      if (this.isEditMode && this.id) {
        this.paqueteService.getPackageById(this.id).subscribe({
          next: (currentPaqute: PaqueteCrud) => {
            if (this.selectedFile) {
              this.updatePaquete(paquete, this.selectedFile);
            } else {
              this.updatePaquete(paquete, new File([], ""));
            }
          },
          error: (err) => this.presentToast(err.message, 'Error', 'error')
        });
      } else {
        if (this.selectedFile) {
          this.createPaquete(paquete, this.selectedFile);
        } else {
          this.presentToast('No se ha seleccionado ningún archivo','Error','error');
          return;
        }
      }
    }
    

    onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0]; // Asignar el archivo seleccionado
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(this.selectedFile.type)) {
          
          this.selectedFile = null; // Reiniciar si no es válido
        }
      }
    }

    private updatePaquete(paquete: PaqueteCrud, foto:File): void {
      if (this.id) {
        this.paqueteService.updatePaquete(this.id, paquete, foto).subscribe({
          next: (response) => {
            this.presentToast('Paquete Actualizado', 'Paquete actualizado', 'success');
            // Opcional: Redirigir a una lista de propiedades
          },
          error: (err) => {
            this.presentToast(err.message, 'Error', 'error');
          },
        });
      }
    }
  
    private createPaquete(paquete: PaqueteCrud, foto:File): void {
      this.paqueteService.createPaquete(paquete, foto).subscribe({
        next: (response) => {
          this.presentToast('Paquete Creado', 'Notificacion', 'success');
          this.paqueteForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          this.presentToast('Error al crear paquete', 'Error', 'error');
        },
      });
    }

}
