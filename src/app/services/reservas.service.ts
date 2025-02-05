import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private API_URL = 'http://localhost:5000/api/reserva'; // URL base de la API
  private http = inject(HttpClient);

   // ✅ Obtener cupos disponibles para una fecha y paquete
   getCuposDisponibles(paqueteId: number, fecha: string): Observable<{ fecha: string; totalCupos: number; cuposReservados: number; cuposDisponibles: number; disponible: boolean }> {
    if (!paqueteId || !fecha) {
      return throwError(() => new Error("Los parámetros paqueteId y fecha son obligatorios."));
    }

    // ✅ Construcción manual de la URL para evitar errores con HttpParams
    const url = `${this.API_URL}/cupos?paqueteId=${encodeURIComponent(paqueteId)}&fecha=${encodeURIComponent(fecha)}`;

    return this.http.get<{ fecha: string; totalCupos: number; cuposReservados: number; cuposDisponibles: number; disponible: boolean }>(
      url
    )
    .pipe(
      catchError((error) => {
        return throwError(() => new Error('No se pudieron obtener los cupos.'));
      })
    );
  }

  crearReserva(data: { usuarioId: number; paqueteId: number; fecha: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, data);
  }

}
