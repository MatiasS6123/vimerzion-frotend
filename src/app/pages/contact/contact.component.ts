import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../services/contact.service';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formSubmitted = false;

  // Configuración general
  titulosCampos: any = {};
  visibilidadCampos: any = {};

  // Definición de configuraciones por tipo
  private static readonly CONFIGURACION_FORMULARIO: any = {
  Personas: {
    titulos: {
      nombre_solicitante: 'Nombre del Solicitante',
      empresa: 'Empresa (Opcional)',
      cargo: '',  // No se muestra, pero es bueno dejarlo definido
    },
    visibilidad: {
      nombre_solicitante: true,
      empresa: false,
      cargo: false,  // Oculto para clientes
    },
  },
  Empresas: {
    titulos: {
      nombre_solicitante: 'Nombre del Solicitante',
      empresa: 'Nombre de la Empresa',
      cargo: 'Cargo',
    },
    visibilidad: {
      nombre_solicitante: true,
      empresa: true,
      cargo: true,
    },
  },
};

  // Listas de servicios
  private static readonly SERVICIOS_PERSONAS = [
    'Arriendo en local',
    'Salon de cumpleaños en local',
    'Otros eventos en local',
    'Otros eventos a Domicilio',
    'Arriendo a Domicilio',
    'Fiestas de Cumpleaños a Domicilio'
  ];

  private static readonly SERVICIOS_EMPRESAS = [
    'Arriendo del local',
    'Salon de reuniones en local',
    'Team building en local',
    'Eventos corporativos a Domicilio',
    'Activaciones Publicitarias a Domicilio',
    'Team Building VR a Domicilio'
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private contactoService: ContactService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Inicialización del formulario
    this.contactForm = this.fb.group({
      nombre_solicitante: ['', Validators.required],
      empresa: ['', [Validators.required]],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]], // ⬅️ NUEVO CAMPO
      mensaje: ['', Validators.required],
      servicios: [[], Validators.required]  // ⬅️ AÑADIR ESTA LÍNEA


    });
  }
  
  ngOnInit() {
  const servicio = this.route.snapshot.queryParamMap.get('servicio');

  if (servicio) {
    if (ContactComponent.SERVICIOS_PERSONAS.includes(servicio)) {
      this.aplicarConfiguracion('Personas');
    } else if (ContactComponent.SERVICIOS_EMPRESAS.includes(servicio)) {
      this.aplicarConfiguracion('Empresas');
    }
  }

  // 🟢 Aquí usamos el correo del usuario logueado (si está disponible)
  const user = this.authService.getUserData();
  if (user?.email) {
    this.contactForm.get('correo')?.setValue(user.email);
  }
  console.log('cargando contacto');
  console.log('user', user);
}

  serviciosDisponibles: string[] = [];
  
  aplicarConfiguracion(tipo: 'Personas' | 'Empresas') {
  const configuracion = ContactComponent.CONFIGURACION_FORMULARIO[tipo];
  this.titulosCampos = configuracion.titulos;
  this.visibilidadCampos = configuracion.visibilidad;

  if (tipo === 'Personas') {
    this.serviciosDisponibles = ContactComponent.SERVICIOS_PERSONAS;
    this.contactForm.get('servicios')?.setValue([]);

    // 🟢 Valores por defecto para campos ocultos
    this.contactForm.get('empresa')?.setValue('N/A');
    this.contactForm.get('cargo')?.setValue('N/A');
  } else if (tipo === 'Empresas') {
    this.serviciosDisponibles = ContactComponent.SERVICIOS_EMPRESAS;
    this.contactForm.get('servicios')?.setValue([]);

    // 🧹 Limpiar por si venía de tipo Persona
    this.contactForm.get('empresa')?.setValue('');
    this.contactForm.get('cargo')?.setValue('');
  }
}

onCheckboxChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const serviciosSeleccionados = this.contactForm.get('servicios')?.value || [];

  if (checkbox.checked) {
    serviciosSeleccionados.push(checkbox.value);
  } else {
    const index = serviciosSeleccionados.indexOf(checkbox.value);
    if (index > -1) {
      serviciosSeleccionados.splice(index, 1);
    }
  }
  this.contactForm.get('servicios')?.setValue(serviciosSeleccionados);
}


  submit() {
    if (this.contactForm.invalid) {
      this.formSubmitted = true;
      this.presentToast('Complete todos los campos', 'Error', 'error');
      return;
    }

    const contactData = this.contactForm.value;

    this.contactoService.contacto(contactData).subscribe(
      () => {
        this.presentToast('Mensaje enviado con éxito, serás contactado en breve', 'Éxito', 'success');
        this.contactForm.reset();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
        this.presentToast('Ha ocurrido un error al enviar el correo, inténtalo nuevamente', 'Error', 'error');
      }
    );
  }

  presentToast(mensaje: string, titulo: string, tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }
}
