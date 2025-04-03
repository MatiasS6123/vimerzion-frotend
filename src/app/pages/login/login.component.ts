import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // <- Ahora es un array de strings
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService,
     private fb: FormBuilder,
    private router:Router,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  showFormErrors(): void {
    const errors: string[] = [];
  
    if (this.loginForm.get('email')?.hasError('required')) {
      errors.push('El campo de correo electrónico es obligatorio.');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      errors.push('El correo electrónico no tiene un formato válido.');
    }
  
    if (this.loginForm.get('password')?.hasError('required')) {
      errors.push('El campo de contraseña es obligatorio.');
    } else if (this.loginForm.get('password')?.hasError('minlength')) {
      errors.push('La contraseña debe tener al menos 6 caracteres.');
    }
  
    if (errors.length > 0) {
      this.presentToast(errors.join(' '), 'Error en el formulario', 'error');
    }
  }
  

  submit(): void {
    if (this.loginForm.invalid) {
      this.showFormErrors();
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.isAuthenticated().subscribe({
          next: (authResponse) => {
            this.isLoggedIn = authResponse.authenticated;
            this.router.navigate(['/tienda']).then(() => {
              window.location.reload();
            });
          },
          error: (authError) => {
            console.error('Error verificando autenticación:', authError);
            this.presentToast('Error verificando autenticación', 'Error', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.handleLoginError(error);
      }
    });
  }

  handleLoginError(error: any): void {
    if (error.status === 400) {
      this.presentToast('Usuario o contraseña incorrectos', 'Error', 'error');
    } else if (error.status === 403) {
      this.presentToast('Acceso denegado. Verifica tus credenciales.', 'Error', 'error');
    } else if (error.status === 500) {
      this.presentToast('Error del servidor. Intente más tarde.', 'Error', 'error');
    } else if (error.status === 0) {
      this.presentToast('Error de conexión. Verifique su red.', 'Error', 'error');
    } else {
      this.presentToast('Error desconocido. Contacte al soporte.', 'Error', 'error');
    }
  }
  

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }


}
