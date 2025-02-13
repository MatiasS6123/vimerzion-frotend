import { Component } from '@angular/core';
import { CarritoItem } from '../../../models/carrito';
import { CarritoService } from '../../../services/carrito.service';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarioFechasComponent } from '../calendario-fechas/calendario-fechas.component';
import { ReservasService } from '../../../services/reservas.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, CalendarioFechasComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  carrito: CarritoItem[] = [];
  fechasSeleccionadas: Record<string, string> = {}; // Ahora está bien tipado
  promocionesDisponibles: { [key: number]: boolean } = {}; 
  preciosOriginales: { [key: number]: number } = {}; 
  total = 0;
  telefono = '';
  direccion = '';
  usuarioId = 0
  notas = ''
   // 📌 Definir los paquetes en promoción con su incremento de precio
   promociones: { [key: string]: number } = {
    'Mando PS5 adicional': 5000,
    'Silla Play seat puma': 10000,
  };
  opcionesEnvio = [
    { nombre: 'Santiago', costo: 20000 },
  ];
  submitted = false;

  opcionEnvio: number | null = null; // Valor inicial como null

  totalConEnvio = 0;

  modalEnvioVisible = false; // Controla el modal de opciones de envío
  modalFechasVisible = false;
  constructor(
    private carritoService: CarritoService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private reservaService: ReservasService
  ) { }

  ngOnInit(): void {
    this.carritoService.getCarrito$().subscribe((items) => {
      this.carrito = items;
      this.detectarPromociones();
      this.calcularTotal();
      this.getUserId()
      this.actualizarTotal();

    });
  }


    // 🔹 Detectar si hay paquetes con promoción
    detectarPromociones() {
      this.carrito.forEach((item) => {
        const nombreNormalizado = item.nombre.trim();
        
        if (this.promociones[nombreNormalizado]) {
          this.promocionesDisponibles[item.id] = false;
          this.preciosOriginales[item.id] = item.subtotal ?? 0;
        }
        
      });
    }
  
    // 🔹 Activar/Desactivar promoción (Solo cambia el precio)
    activarPromocion(item: CarritoItem) {
      const nombreNormalizado = item.nombre.trim();
      if (this.promociones[nombreNormalizado]) {
        if (this.promocionesDisponibles[item.id]) {
          // Desactivar promoción
          item.subtotal = this.preciosOriginales[item.id] ?? 0;
          this.notas = this.notas.replace(`Adicional  solicitado para: ${item.nombre}\n`, '');
          this.promocionesDisponibles[item.id] = false;
        } else {
          // Activar promoción
          item.subtotal = (this.preciosOriginales[item.id] ?? 0) + this.promociones[nombreNormalizado];
          this.notas += `Adicional  solicitado para: ${item.nombre}\n`;
          this.promocionesDisponibles[item.id] = true;
        }
    
        this.calcularTotal();  // Recalcula el total de los items
        this.actualizarTotal();  // Actualiza el total con envío
        this.toastr.success(`Adicional  aplicado: ${item.nombre}`, 'Adicinal Agregado ');
      }
    }


  getFechasSeleccionadasKeys(): string[] {
    return Object.keys(this.fechasSeleccionadas);
  }

  actualizarFechasSeleccionadas(fechas: { [paqueteId: number]: string }) {

    // ✅ Solo actualizar si la fecha fue confirmada
    this.fechasSeleccionadas = { ...this.fechasSeleccionadas, ...fechas };
  }

  getFechasConfirmadasKeys(): number[] {
    return Object.keys(this.fechasSeleccionadas).map(id => Number(id));
  }

  actualizarTotal(): void {
    const envio = Number(this.opcionEnvio) || 0; // Forzar conversión a número
    this.totalConEnvio = this.total + envio;
  }

  abrirModalEnvio(): void { this.modalEnvioVisible = true; }
  cerrarModalEnvio(): void { this.modalEnvioVisible = false; }
  abrirModalFechas(): void { this.modalFechasVisible = true; }
  cerrarModalFechas(): void { this.modalFechasVisible = false; }

  getUserId() {
    this.authService.getId().subscribe(
      (response) => {
        this.usuarioId = response.id

      }
    )
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro

    });
  }
  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    this.actualizarTotal(); // Actualizar el total con envío
  }

  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(monto);
  }

  confirmarCompra(): void {
    this.submitted = true;

    if (!this.telefono || !this.direccion || !this.opcionEnvio) {
      this.presentToast('Por favor, complete todos los campos obligatorios.', 'Error', 'error');
      return;
    }

    // 🔹 Verificar que todos los paquetes tengan una fecha de reserva confirmada
    const paquetesSinFecha = this.carrito.filter(
      (item) => !this.fechasSeleccionadas[item.id]
    );

    if (paquetesSinFecha.length > 0) {
      this.presentToast('Debe seleccionar una fecha para todos los paquetes.', 'Error', 'error');
      return;
    }

    const paquetesConFechas = this.carrito.map((item) => ({
      paqueteId: item.id,
      cantidad: item.cantidad,
      fecha: this.fechasSeleccionadas[item.id], // 🔥 Se mantiene la fecha en el frontend
      adicional: this.promocionesDisponibles[item.id] ? this.promociones[item.nombre.trim()] : 0
  }));

  // ✅ Crear la orden sin la fecha (se eliminará en el servicio)
  const orderData = {
      usuarioId: this.usuarioId,
      paquetes: paquetesConFechas, // Se pasa con fecha, pero el servicio la ignora
      direccionEnvio: this.direccion,
      telefonoContacto: this.telefono,
      metodoPago: 'WEBPAY',
      notas: this.notas,
      costoEnvio: this.opcionEnvio,
  };

    this.orderService.createOrderWithWebpay(orderData).subscribe({
          next: (response: any) => {
            if (response.transactionUrl) {
              window.location.href = response.transactionUrl;
            } else {
              this.router.navigate(['/checkout']);
            }
          },
          error: (error) => {
            this.presentToast('Error al procesar la compra', 'Error', 'error');
            this.router.navigate(['/checkout']);
          },
        });
      

  }



}
