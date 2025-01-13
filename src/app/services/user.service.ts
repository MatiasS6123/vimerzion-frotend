import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroUsuario } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.apiUrl}/users`; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) {}

  /**
   * Registrar un usuario (cliente o administrador)
   */
  registrarUsuario(data: RegistroUsuario): Observable<any> {
    return this.http.post(`${this.API_URL}`, data);
  }

  /**
   * Actualizar un usuario existente
   */
  actualizarUsuario(id: number, data: RegistroUsuario): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  /**
   * Obtener un usuario por ID
   */
  obtenerUsuario(id: number): Observable<RegistroUsuario> {
    return this.http.get<RegistroUsuario>(`${this.API_URL}/${id}`);
  }
}
