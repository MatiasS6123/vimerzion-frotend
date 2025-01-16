import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink,CarritoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentSection: string = '';
  isCarritoOpen = false;
  carritoCount = 0;
  isUserMenuOpen = false;
  @Input() rolUsuario: string | null = null;
  @Output() roleCleared = new EventEmitter<void>();
  activeSubmenu: string | null = null;
  constructor(
    private router: Router,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private toastr:ToastrService
  ) {
    this.router.events.subscribe(() => {
      this.currentSection = this.router.url.replace('/', '') || 'inicio';
    });

    this.carritoService.getCarrito$().subscribe((items) => {
      this.carritoCount = items.length;
    });

    this.carritoService.getIsOpen$().subscribe((isOpen) => {
      this.isCarritoOpen = isOpen;
    });
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  toggleSubmenu(menu: string): void {
    this.activeSubmenu = this.activeSubmenu === menu ? null : menu;
  }
  
  get isAuthenticated(): boolean {
    return !!this.rolUsuario && this.rolUsuario !== '';
  }


  get isAdmin(): boolean {
    return this.rolUsuario === 'ADMINISTRADOR';
  }

  get isClient(): boolean {
    return this.rolUsuario === 'CLIENTE';
  }
  get showDefaultMenu(): boolean {
    return !this.isAuthenticated || this.isClient;
  }

  navegarACheckout(): void {
    if(this.isAuthenticated){
      this.presentToast("Porfavor inicie sesión o registrese para continuar","Informacion","info")
    }
    this.closeCarrito(); // Cierra el carrito
    this.router.navigate(['/checkout']); // Redirige al checkout
  }
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.roleCleared.emit();
      this.router.navigate(['/login']);
    });
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }

  toggleCarrito(): void {
    this.carritoService.toggleCarrito();
  }

  closeCarrito(): void {
    this.isCarritoOpen = false;
  }



}
