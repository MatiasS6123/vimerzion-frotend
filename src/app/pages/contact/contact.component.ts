import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../services/contact.service';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  messageStatus: string = '';
  serviciosDisponibles = [
    { nombre: 'Servicio 1', valor: 'servicio1' },
    { nombre: 'Servicio 2', valor: 'servicio2' },
    { nombre: 'Servicio 3', valor: 'servicio3' },
    { nombre: 'Servicio 4', valor: 'servicio4' },
  ];
  
  zonasDisponibles = [
    { nombre: 'Zona Norte' , valor:'Zona Norte'},
    { nombre: 'Zona Centro',valor:'Zona Centro'},
    { nombre: 'Zona Sur', valor:'Zona Sur'},
    { nombre: 'Extremos de santiago',valor:'Extremos de santiago' },
  ];

  constructor(private fb: FormBuilder, private toastr:ToastrService,private contactoService:ContactService) {
    this.contactForm = this.fb.group({
      nombre_solicitante: ['', Validators.required],
      empresa: ['', [Validators.required]],
      cargo: ['', Validators.required],
      servicios:[[],Validators.required],
      zona_envio:[this.zonasDisponibles[0].valor,Validators.required],
      mensaje:['',Validators.required]
    });
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  submit() {
    if (this.contactForm.invalid) {
      this.presentToast('Complete todos los campos', 'Error', 'error');
      return;
    }
  
    // Obtener el nombre de la zona basada en el valor seleccionado
    const zonaSeleccionada = this.zonasDisponibles.find(
      (zona) => zona.valor === this.contactForm.get('zona_envio')?.value
    );
  
    // Preparar los datos del formulario para enviar al backend
    const contactData = {
      nombre_solicitante: this.contactForm.get('nombre_solicitante')?.value,
      empresa: this.contactForm.get('empresa')?.value,
      cargo: this.contactForm.get('cargo')?.value,
      servicios: this.contactForm.get('servicios')?.value, // Array de servicios seleccionados
      zona_envio: zonaSeleccionada ? zonaSeleccionada.nombre : '', // Usar el nombre de la zona
      mensaje: this.contactForm.get('mensaje')?.value,
    };
  
    
    // Llamada al servicio para enviar los datos
    this.contactoService.contacto(contactData).subscribe(
      () => {
        this.presentToast(
          'Mensaje enviado con éxito, serás contactado en breve',
          'Éxito',
          'success'
        );
        this.contactForm.reset();
      },
      (error) => {
        console.error('Error al enviar el mensaje:');
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
