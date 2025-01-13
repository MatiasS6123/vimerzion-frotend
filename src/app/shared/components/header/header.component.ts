import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private router: Router,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
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
