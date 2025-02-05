import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Paquete, PaqueteCrud } from '../models/paquete';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private http=inject(HttpClient)
  private API_URL=`${environment.apiUrl}/package`

  
  getAllPaquetesPaginados(page: number, limit: number): Observable<{ paquetes: Paquete[]; total: number; page: number; pages: number }> {
    return this.http
      .get<{ paquetes: Paquete[]; total: number; page: number; pages: number }>(
        `${this.API_URL}/activo?page=${page}&limit=${limit}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los paquetes paginados:', error);
          return throwError(() => new Error('No se pudieron obtener los paquetes.'));
        })
      );
  }


  getDaysAvailable(id:number):Observable<any>{
    return this.http.get<any>(`${this.API_URL}/dias-disponibles/${id}`)
  }

  getAllPaquetes(page: number, limit: number): Observable<{ packages: PaqueteCrud[]; totalItems: number; currentPage: number; totalPages: number }> {
    return this.http
      .get<{ packages: PaqueteCrud[]; totalItems: number; currentPage: number; totalPages: number }>(
        `${this.API_URL}/?page=${page}&limit=${limit}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los paquetes paginados:', error);
          return throwError(() => new Error('No se pudieron obtener los paquetes.'));
        })
      ); 
}


  createPaquete(paqute:PaqueteCrud, foto:File):Observable<PaqueteCrud>{
    const formData= new FormData();

    formData.append('nombre',paqute.nombre);
    formData.append('descripcion',paqute.descripcion);
    formData.append('precio',paqute.precio.toString());
    formData.append('stock',paqute.stock.toString());

    // ✅ Agregar fechas formateadas en YYYY-MM-DD
    formData.append('fechaInicio', this.formatDateForAPI(paqute.fechaInicio));
    formData.append('fechaFin', this.formatDateForAPI(paqute.fechaFin));

    // ✅ Convertir días seleccionados a formato JSON y en mayúsculas
    const diasDisponiblesFormatted = JSON.stringify(
      paqute.diasDisponibles.map(dia => dia.toUpperCase()) // Convierte a mayúsculas
    );
    formData.append('diasDisponibles', diasDisponiblesFormatted);

    // ✅ Agregar cupos diarios
    formData.append('cuposDiarios', paqute.cuposDiarios.toString());
    if(foto){
      formData.append('foto',foto);  
    }
    
    formData.append('activo',paqute.activo.toString() || 'true');
    

    return this.http.post<PaqueteCrud>(`${this.API_URL}`,formData)

  }


  updatePaquete(id:number,paquete:PaqueteCrud,foto:File){
    const formData= new FormData();

    formData.append('nombre',paquete.nombre);
    formData.append('descripcion',paquete.descripcion);
    formData.append('precio',paquete.precio.toString());
    formData.append('stock',paquete.stock.toString());


  // ✅ Agregar fechas formateadas en YYYY-MM-DD
  formData.append('fechaInicio', this.formatDateForAPI(paquete.fechaInicio));
  formData.append('fechaFin', this.formatDateForAPI(paquete.fechaFin));

  // ✅ Convertir días seleccionados a formato JSON y en mayúsculas
  const diasDisponiblesFormatted = JSON.stringify(
    paquete.diasDisponibles.map(dia => dia.toUpperCase()) // Convierte a mayúsculas
  );
  formData.append('diasDisponibles', diasDisponiblesFormatted);

  // ✅ Agregar cupos diarios
  formData.append('cuposDiarios', paquete.cuposDiarios.toString());

    if(foto){
      formData.append('foto',foto);  
    }
    
    formData.append('activo',paquete.activo.toString() || 'true');
    

    return this.http.put<PaqueteCrud>(`${this.API_URL}/${id}`,formData)


  }



  private formatDateForAPI(fecha: Date | string | null): string {
    if (!fecha) return ''; // Si es null o undefined, devolver un string vacío
  
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
    }
  
    return fecha.split('T')[0]; // Si ya es string, extraer solo la fecha
  }
  

  getPackageById(id:number):Observable<PaqueteCrud>{
    return this.http.get<PaqueteCrud>(`${this.API_URL}/id/${id}`)
  }
}

