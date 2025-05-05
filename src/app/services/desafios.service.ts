import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Desafio } from '../models/desafios';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {
  private API_URL = `${environment.apiUrl}/desafios`;
  private http = inject(HttpClient);

  getDesafioById(id: number): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al buscar el desafío por ID:', error);
        return throwError(() => new Error('No se pudo encontrar el desafío.'));
      })
    );
  }

  getAllDesafios(page: number, limit: number): Observable<{ desafios: Desafio[]; total: number; page: number; pages: number }> {
    return this.http.get<{ desafios: Desafio[]; total: number; page: number; pages: number }>(
      `${this.API_URL}/?page=${page}&limit=${limit}`
    ).pipe(
      catchError((error) => {
        console.error('Error al obtener los desafíos:', error);
        return throwError(() => new Error('No se pudieron obtener los desafíos.'));
      })
    );
  }

  createDesafio(desafio: Desafio): Observable<Desafio> {
    return this.http.post<Desafio>(`${this.API_URL}`, desafio).pipe(
      catchError((error) => {
        console.error('Error al crear el desafío:', error);
        return throwError(() => new Error('No se pudo crear el desafío.'));
      })
    );
  }

  updateDesafio(id: string, desafio: Desafio): Observable<Desafio> {
    return this.http.put<Desafio>(`${this.API_URL}/${id}`, desafio).pipe(
      catchError((error) => {
        console.error('Error al actualizar el desafío:', error);
        return throwError(() => new Error('No se pudo actualizar el desafío.'));
      })
    );
  }

  deleteDesafio(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el desafío:', error);
        return throwError(() => new Error('No se pudo eliminar el desafío.'));
      })
    );
  }
  
}
