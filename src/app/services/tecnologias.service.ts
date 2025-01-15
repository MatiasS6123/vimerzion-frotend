import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Tecnologia } from '../models/tecnologias';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TecnologiasService {
  private API_URL = `${environment.apiUrl}/tecnology`; // URL base de la API
  private http = inject(HttpClient); // Inyección del HttpClient


  getTecnologiaByName(nombre: string): Observable<Tecnologia> {
      return this.http.get<Tecnologia>(`${this.API_URL}/nombre/${nombre}`).pipe(
        catchError((error) => {
          console.error('Error al buscar la tecnologia por nombre:', error);
          return throwError(() => new Error('No se pudo encontrar el servicio.'));
        })
      );
    }

    getAllTecnologias(page: number, limit: number): Observable<{ tecnologias: Tecnologia[]; total: number; page: number; pages: number }> {
      return this.http.get<{ tecnologias: Tecnologia[]; total: number; page: number; pages: number }>(
        `${this.API_URL}/?page=${page}&limit=${limit}`
      ).pipe(
        catchError((error) => {
          console.error('Error al obtener las tecnologías:', error);
          return throwError(() => new Error('No se pudieron obtener las tecnologías.'));
        })
      );
    }
    

  /**
   * Crear una nueva tecnología.
   * @param nombre Nombre de la tecnología.
   * @param descripcion Descripción de la tecnología.
   * @param imagen Archivo de imagen de la tecnología.
   * @returns Observable<Tecnologia>
   */
  createTecnologia(tecnologia:Tecnologia, imagen: File): Observable<Tecnologia> {
    const formData = new FormData();
    formData.append('nombre', tecnologia.nombre);
    formData.append('descripcion', tecnologia.descripcion);
    formData.append('imagen', imagen);

    return this.http.post<Tecnologia>(`${this.API_URL}`, formData).pipe(
      catchError((error) => {
        console.error('Error al crear la tecnología:', error);
        return throwError(() => new Error('No se pudo crear la tecnología.'));
      })
    );
  }

  /**
   * Actualizar una tecnología existente.
   * @param id ID de la tecnología a actualizar.
   * @param nombre Nombre de la tecnología (opcional).
   * @param descripcion Descripción de la tecnología (opcional).
   * @param imagen Archivo de imagen de la tecnología (opcional).
   * @returns Observable<Tecnologia>
   */
  updateTecnologia(id: string, tecnologia:Tecnologia, imagen?: File): Observable<Tecnologia> {
    const formData = new FormData();
    if (tecnologia.nombre) formData.append('nombre', tecnologia.nombre);
    if (tecnologia.descripcion) formData.append('descripcion', tecnologia.descripcion);
    if (imagen) formData.append('imagen', imagen);

    return this.http.put<Tecnologia>(`${this.API_URL}/${id}`, formData).pipe(
      catchError((error) => {
        console.error('Error al actualizar la tecnología:', error);
        return throwError(() => new Error('No se pudo actualizar la tecnología.'));
      })
    );
  }

  /**
   * Buscar una tecnología por su ID.
   * @param id ID de la tecnología a buscar.
   * @returns Observable<Tecnologia>
   */
  findById(id: string): Observable<Tecnologia> {
    return this.http.get<Tecnologia>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al buscar la tecnología por ID:', error);
        return throwError(() => new Error('No se pudo encontrar la tecnología.'));
      })
    );
  }

  /**
   * Desactivar una tecnología (soft delete).
   * @param id ID de la tecnología a desactivar.
   * @returns Observable<{ message: string }>
   */
  deactivateTecnologia(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al desactivar la tecnología:', error);
        return throwError(() => new Error('No se pudo desactivar la tecnología.'));
      })
    );
  }
}
