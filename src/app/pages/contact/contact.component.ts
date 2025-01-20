import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../services/contact.service';
import { RouterLink } from '@angular/router';
import { ModalPaqueteComponent } from '../../shared/components/modal-paquete/modal-paquete.component';
import { Paquete } from '../../models/paquete';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink,ModalPaqueteComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  modalPaquetesVisible = false; // Controla la visibilidad del modal
  paquetes: Paquete[] = []; // Lista de paquetes
  paquetesSeleccionados: Paquete[] = []; // Lista de paquetes seleccionados
  contactForm: FormGroup;
  formSubmitted = false;
  @ViewChild(ModalPaqueteComponent) modalPaquete!: ModalPaqueteComponent; // Referencia al modal
  serviciosDisponibles = [
    { nombre: 'Activacion Publicitaria VR', valor: 'Activacion Publicitaria VR' },
    { nombre: 'Eventos Corporativos VR', valor: 'Eventos Corporativos VR' },
    { nombre: 'Team Building VR', valor: 'Team Building VR' },
  ];
  
  zonasDisponibles = [
    { nombre: 'Zona Norte' , valor:'Zona Norte'},
    { nombre: 'Zona Centro',valor:'Zona Centro'},
    { nombre: 'Zona Sur', valor:'Zona Sur'},
    { nombre: 'Extremos de santiago',valor:'Extremos de santiago' },
  ];
  currentIndex = 0;
  // Imágenes del slider
  images = [
    { url: 'assets/servicio-empresa.jpg' },
    { url: 'assets/servicio-empresa2.jpg' },
    { url: 'assets/servicio-empresa3.jpg' },
  ];


  
  constructor(private fb: FormBuilder, private toastr:ToastrService,private contactoService:ContactService) {
    this.contactForm = this.fb.group({
      nombre_solicitante: ['', Validators.required],
      empresa: ['', [Validators.required]],
      cargo: ['', Validators.required],
      servicios:[[],Validators.required],
      zona_envio:[this.zonasDisponibles[0].valor,Validators.required],
      mensaje:['',Validators.required],
      paquetes: [[]], 
    });
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  get transform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

   // Navegar a la imagen anterior
   prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  // Navegar a la imagen siguiente
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }



  abrirModal(): void {
    this.modalPaquetesVisible = true;
    
  }
  
  cerrarModal(): void {
    this.modalPaquetesVisible = false;
  }
  
  guardarPaquetesSeleccionados(paquetes: Paquete[]): void {
    this.paquetesSeleccionados = paquetes;
  
    // Extraer solo los nombres de los paquetes seleccionados
    const nombresPaquetes = paquetes.map(paquete => paquete.nombre);
  
    // Actualizar el formulario con los nombres
    this.contactForm.patchValue({ paquetes: nombresPaquetes });
  
    this.cerrarModal();
  }
  
  
  limpiarEstadoModal(): void {
    this.paquetesSeleccionados = []; // Limpia los paquetes seleccionados
    this.cerrarModal(); // Cierra el modal
  }
  

  submit() {
    
  if (this.contactForm.invalid) {
    this.formSubmitted = true;
    this.presentToast('Complete todos los campos', 'Error', 'error');
    console.log(this.contactForm.value)
    return;
  }

  const zonaSeleccionada = this.zonasDisponibles.find(
    (zona) => zona.valor === this.contactForm.get('zona_envio')?.value
  );

  const contactData = {
    nombre_solicitante: this.contactForm.get('nombre_solicitante')?.value,
    empresa: this.contactForm.get('empresa')?.value,
    cargo: this.contactForm.get('cargo')?.value,
    servicios: this.contactForm.get('servicios')?.value,
    zona_envio: zonaSeleccionada ? zonaSeleccionada.nombre : '',
    mensaje: this.contactForm.get('mensaje')?.value,
    paquetes: this.contactForm.get('paquetes')?.value, // Incluir paquetes seleccionados
  };

  this.contactoService.contacto(contactData).subscribe(
    () => {
      this.presentToast(
        'Mensaje enviado con éxito, serás contactado en breve',
        'Éxito',
        'success'
      );
      this.contactForm.reset({
        nombre_solicitante: '',
        empresa: '',
        cargo: '',
        servicios: [],
        zona_envio: this.zonasDisponibles[0].valor,
        mensaje: '',
        paquetes: [], // Resetear los paquetes seleccionados
      });
      // Limpiar el estado del modal y cerrarlo
      this.modalPaquete.limpiarEstado();
      this.cerrarModal();

    },
    (error) => {
      console.error('Error al enviar el mensaje:', error);
      this.presentToast(
        'Ha ocurrido un error al enviar el correo, inténtalo nuevamente',
        'Error',
        'error'
      );
    }
  );
}

  
  

  onCheckboxChange(event: Event, controlName: string): void {
    const checkbox = event.target as HTMLInputElement;
    const valueArray = this.contactForm.get(controlName)?.value || [];
  
    if (checkbox.checked) {
      // Añadir el valor si está marcado
      valueArray.push(checkbox.value);
    } else {
      // Eliminar el valor si está desmarcado
      const index = valueArray.indexOf(checkbox.value);
      if (index > -1) {
        valueArray.splice(index, 1);
      }
    }
  
    // Actualizar el campo con el nuevo array
    this.contactForm.get(controlName)?.setValue(valueArray);
  }
  
}
