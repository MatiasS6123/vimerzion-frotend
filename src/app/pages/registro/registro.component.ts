import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  clienteForm: FormGroup;

  constructor(private fb: FormBuilder,private userService:UserService, 
    private toastr:ToastrService
  ) {
    this.clienteForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      
      const cliente: Cliente = {
        username: this.clienteForm.value.username,
        email: this.clienteForm.value.email,
        password: this.clienteForm.value.password,
      };
      
      this.userService.registrarUsuario(cliente).subscribe({
        next: (response) => {
          this.presentToast('Registro Exitoso', 'Éxito', 'success');
          this.clienteForm.reset();
        },
        error: (err) => {
          this.presentToast('Ocurrió un error al registrar el usuario.', 'Error', 'error');
        },
      });
    } else {
      this.presentToast('Formulario inválido. Por favor, completa todos los campos.', 'Advertencia', 'warning');
    }
  }    

  

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

}
