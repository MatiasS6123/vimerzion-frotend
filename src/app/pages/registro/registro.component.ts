import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  clienteForm: FormGroup;

  constructor(private fb: FormBuilder,private userService:UserService) {
    this.clienteForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.minLength(8)]],
      direccion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Datos del Cliente:', this.clienteForm.value);
      const cliente: Cliente = {
        username: this.clienteForm.value.username,
        email: this.clienteForm.value.email,
        password: this.clienteForm.value.password,
        telefono: this.clienteForm.value.telefono,
        direccion: this.clienteForm.value.direccion,
      };
      
      this.userService.registrarUsuario(cliente).subscribe({
        next: (response) => console.log('Cliente registrado con éxito:', response),
        error: (err) => console.error('Error al registrar cliente:', err),
      });
    }
  }

}
