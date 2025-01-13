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
  isEditMode = false; // Define si estamos creando o actualizando un usuario
  userId!: number; // ID del usuario a actualizar

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Verifica si hay un ID en la URL para habilitar modo edición
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        this.loadUserData(this.userId); // Cargar datos del usuario
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]], // Requiere password solo en creación
      nombreRol: ['ADMINISTRADOR', Validators.required], // Fijado a ADMINISTRADOR
    });
  }

  loadUserData(userId: number): void {
    this.userService.obtenerUsuario(userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          nombreRol: 'ADMINISTRADOR', // El rol está fijo
        });
        // No cargamos el password para seguridad
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        alert('No se pudo cargar la información del usuario.');
        this.router.navigate(['/gestion-usuarios']); // Redirige si falla la carga
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Formulario inválido. Por favor revisa los datos ingresados.');
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditMode) {
      this.userService.actualizarUsuario(this.userId, userData).subscribe({
        next: () => {
          alert('Usuario actualizado con éxito.');
          this.router.navigate(['/gestion-usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
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
          console.error('Error al registrar usuario:', error);
          alert('Ocurrió un error al registrar el usuario.');
        },
      });
    }
  }
}
