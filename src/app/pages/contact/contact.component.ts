import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre_solicitante: ['', Validators.required],
      empresa: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required],
      servicios:['',Validators.required],
      zona_envio:[this.zonasDisponibles[0],Validators.required],
      mensaje:['',Validators.required]
    });
  }

  submit(){}

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
