import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PaquetesService } from '../../../services/paquetes.service';
import { ReservasService } from '../../../services/reservas.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-calendario-fechas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-fechas.component.html',
  styleUrl: './calendario-fechas.component.css'
})
export class CalendarioFechasComponent implements OnInit{
  carrito: any[] = [];
  fechasSeleccionadas: { [paqueteId: number]: string | null } = {};
  cuposDisponibles: { [paqueteId: number]: number } = {};
  totalCupos: { [paqueteId: number]: number } = {};
  diasDisponibles: { [paqueteId: number]: string[] } = {};
   // Agregar una nueva propiedad para rastrear las fechas confirmadas
   fechasConfirmadas: { [paqueteId: number]: string } = {};
  diasPaquetes:{[paqueteId:number]:string[]}={}
  fechaMinima: string = ''; // ✅ Variable para la fecha mínima
   // ✅ Emitir las fechas al componente padre (Checkout)
   
   @Output() fechaSeleccionada = new EventEmitter<{ [paqueteId: number]: string }>();
   @Output() fechaConfirmada = new EventEmitter<{ [paqueteId: number]: string }>();
 
  constructor(private carritoService: CarritoService, private reservasService: ReservasService,private paqueteService:PaquetesService) {}

  ngOnInit(): void {
    this.obtenerPaquetesCarrito();
    this.fechaMinima = this.obtenerFechaActual();
  }

   // ✅ Obtener la fecha actual en formato YYYY-MM-DD
   obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Se obtiene la fecha sin la hora
  }

  // ✅ Obtener paquetes en el carrito
  obtenerPaquetesCarrito() {
    
    this.carritoService.getCarrito$().subscribe(items => {
      this.carrito = items;
      
      this.carrito.forEach(paquete => {
        

        this.diasDisponibles[paquete.id] = Array.isArray(paquete.diasDisponibles) 
          ? paquete.diasDisponibles.map((dia: string) =>
              dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
            ) 
          : [];

        this.fechasSeleccionadas[paquete.id] = null;
        this.cuposDisponibles[paquete.id] = 0;
        this.totalCupos[paquete.id] = 0;
         // Obtener los días disponibles del paquete desde la API
         this.getDaysAvailable(paquete.id);
      });
    });
  }

  // ✅ Seleccionar una fecha y verificar cupos
  // ✅ Método corregido para manejar eventos de cambio en el input date
seleccionarFecha(paqueteId: number, event: Event) {
  const inputElement = event.target as HTMLInputElement; // Casting para acceder a `value`
  const fecha = inputElement.value;

  if (!fecha) {
    return;
  }

  this.fechasSeleccionadas[paqueteId] = fecha; 
  this.verificarCupos(paqueteId, fecha);
}


getDaysAvailable(id: number) {
  this.paqueteService.getDaysAvailable(id).subscribe(
    (response) => {
      this.diasDisponibles[id] = response.diasDisponibles?.map((dia: string) =>
        dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
      ) || [];

    },
    (error) => {
      
      this.diasDisponibles[id] = []; // Evita que el array sea undefined
    }
  );
}
  
  // ✅ Verificar los cupos disponibles para una fecha
  verificarCupos(paqueteId: number, fecha: string) {

    this.reservasService.getCuposDisponibles(paqueteId, fecha).subscribe(
      res => {

        if (res.disponible) {
          this.fechasSeleccionadas[paqueteId] = fecha;
          this.cuposDisponibles[paqueteId] = res.cuposDisponibles;
          this.totalCupos[paqueteId] = res.totalCupos;


          // ✅ Filtrar valores `null` antes de emitir
          const fechasValidas = Object.fromEntries(
            Object.entries(this.fechasSeleccionadas).filter(([_, value]) => value !== null)
          ) as { [paqueteId: number]: string };

          this.fechaSeleccionada.emit(fechasValidas);
        } else {
          console.warn(`❌ [Error] No hay cupos disponibles para el paquete ${paqueteId} en la fecha ${fecha}`);
          this.fechasSeleccionadas[paqueteId] = null;
        }
      },
      error => {
        console.error(`⚠️ [Error] No se pudieron obtener los cupos para ${fecha}:`, error);
        this.fechasSeleccionadas[paqueteId] = null;
      }
    );
  }

   // Método para confirmar la fecha
   confirmarReserva(paqueteId: number) {
    const fecha = this.fechasSeleccionadas[paqueteId];

    if (!fecha || this.cuposDisponibles[paqueteId] <= 0) {
      return;
    }

    // Agregar la fecha a fechasConfirmadas
    this.fechasConfirmadas[paqueteId] = fecha;

    // Emitir solo las fechas confirmadas
    this.fechaConfirmada.emit(this.fechasConfirmadas);
  }

}
