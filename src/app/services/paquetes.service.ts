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


  getAllPaquetes(page: number, limit: number): Observable<{ packages: PaqueteCrud[]; total: number; page: number; pages: number }>{
    return this.http
      .get<{ packages: PaqueteCrud[]; total: number; page: number; pages: number }>(
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
    if(foto){
      formData.append('foto',foto);  
    }
    
    formData.append('activo',paquete.activo.toString() || 'true');
    

    return this.http.put<PaqueteCrud>(`${this.API_URL}/${id}`,formData)


  }


  getPackageById(id:number):Observable<PaqueteCrud>{
    return this.http.get<PaqueteCrud>(`${this.API_URL}/id/${id}`)
  }
}

