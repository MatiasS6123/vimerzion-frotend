import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-administradores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registro-administradores.component.html',
  styleUrl: './registro-administradores.component.css'
})
export class RegistroAdministradoresComponent {

  userForm!: FormGroup;
  isEditMode = false;
  userId!: number | null;
  showPasswordInput = false; // Controla si se muestra el campo para actualizar contraseña

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = Number(params['id']);
        if (!isNaN(this.userId)) {
          this.loadUserData(this.userId);
        } else {
          console.error('ID inválido recibido en los parámetros de consulta.');
          this.router.navigate(['/gestion-usuarios']);
        }
      } else {
        this.isEditMode = false;
        this.userId = null;
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nombreRol: ['CLIENTE', Validators.required], // Valor predeterminado como CLIENTE
      telefono: [''], // Campos adicionales para CLIENTE
      direccion: [''],
      newPassword: [''], // Campo para la nueva contraseña
      activo:[true]
    });
  }

  loadUserData(userId: number): void {
    this.userService.obtenerUsuario(userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          nombreRol: user.rol, // Cargar el rol del usuario
          telefono: user.telefono || '',
          direccion: user.direccion || '',
          activo:user.activo

        });
      },
      error: (error) => {
        alert('No se pudo cargar la información del usuario.');
        this.router.navigate(['/gestion-usuarios']);
      },
    });
  }

  togglePasswordInput(): void {
    this.showPasswordInput = !this.showPasswordInput;
    if (!this.showPasswordInput) {
      this.userForm.get('newPassword')?.reset(); // Limpiar el campo si se desactiva
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Formulario inválido. Por favor revisa los datos ingresados.');
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userService.actualizarUsuario(this.userId, userData).subscribe({
        next: () => {
          alert('Usuario actualizado con éxito.');
          this.router.navigate(['/lista-usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:');
          alert('Ocurrió un error al actualizar el usuario.');
        },
      });
    } else {
      this.userService.registrarUsuario(userData).subscribe({
        next: () => {
          alert('Usuario registrado con éxito.');
          this.router.navigate(['/gestion-usuarios']);
        },
        error: (error) => {
          console.error('Error al registrar usuario:');
          alert('Ocurrió un error al registrar el usuario.');
        },
      });
    }
  }
}
