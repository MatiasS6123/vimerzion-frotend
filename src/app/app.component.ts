import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FooterComponent,HeaderComponent,CommonModule,ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vimerzion-frontend';
  isTokenExpired: boolean = false; // Modal de sesión expirada
  rolUsuario: string = '';
  isLoading: boolean = true; // Spinner de carga inicial
  isAuthenticated: boolean = false; // Controla si el usuario está autenticado
  currentUrl:string=''
  private authService=inject(AuthService);
  private router=inject(Router);

  ngOnInit(): void {
    const savedUrl = sessionStorage.getItem('redirectUrl');
    this.currentUrl = savedUrl || this.router.url;
    this.checkAuthentication();
    
  }

  checkAuthentication(): void {
    this.authService.isAuthenticated().subscribe(
      (response) => {
        if (response.authenticated) {
          this.isAuthenticated = true; // Marca como autenticado
          this.getRole(); // Obtén el rol del usuario
          this.checkTokenExpiration(); // Verifica si el token está próximo a expirar
        } else {
          this.isAuthenticated = false;
          this.isLoading = false; // Detiene la carga
          this.currentUrl
        }
      },
      (error) => {
        this.currentUrl
        this.isAuthenticated = false;
        this.isLoading = false; // Detiene la carga en caso de error
      }
    );
  }

  updateRole(role: string): void {
    this.rolUsuario = role;
    this.isAuthenticated = false; // Actualiza el estado de autenticación
  }
  
  private handleUnauthenticated(): void {
    this.isLoading = false;
    const publicRoutes = ['/inicio', '/servicios', '/catalogo', '/tecnologias', '/login'];
    
    if (!publicRoutes.includes(this.currentUrl)) {
      sessionStorage.setItem('redirectUrl', this.currentUrl);
      this.router.navigate(['/login']);
    }
  }
  
  // Obtiene el rol del usuario
  getRole(): void {
    this.authService.getRole().subscribe(
      (response) => {
        this.rolUsuario = response.role;
        this.isLoading = false; // Detiene el spinner después de cargar
      },
      (error) => {
        console.error('Error obteniendo el rol del usuario:', error);
        this.router.navigate(['/login']);
        this.isAuthenticated = false; // Asegura que el usuario no quede como autenticado
        this.isLoading = false; // Detiene el spinner
      }
    );
  }

  // Verifica si el token está próximo a expirar
  checkTokenExpiration(): void {
    this.authService.getRemainingTime().subscribe(
      (response) => {
        const remainingTime = response.remainingTime;
        
        if (remainingTime > 0) {
          setTimeout(() => {
            this.handleTokenExpiration();
          }, remainingTime);
        } else {
          this.handleTokenExpiration(); // Maneja la expiración inmediatamente
        }
      },
      (error) => {
        console.error('Error verificando el tiempo restante del token:', error);
        this.handleTokenExpiration(); // Maneja como si el token estuviera expirado
      }
    );
  }

  // Maneja la expiración del token
  handleTokenExpiration(): void {
    this.isTokenExpired = true;
  }

  handleSuccessfulLogin(): void {
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.router.navigate(['/catalogo']); // O la ruta por defecto que prefieras
    }
  }
  // Maneja el cierre de sesión desde el modal
  handleLogout(): void {
    this.isTokenExpired = false; // Oculta el modal
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false; // Marca como no autenticado
      this.router.navigate(['/login']); // Redirige al login
    });
  }
  
}
