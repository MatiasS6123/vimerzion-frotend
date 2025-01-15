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

  registrarAdministrador(data: RegistroUsuario): Observable<any> {
    return this.http.post(`${this.API_URL}/create/admin`, data);
  }

  /**
   * Actualizar un usuario existente
   */
  actualizarUsuario(id: number, data: RegistroUsuario): Observable<any> {
    return this.http.put(`${this.API_URL}/update/${id}`, data);
  }

  /**
   * Obtener un usuario por ID
   */
  obtenerUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  getPaginatedUsers(page: number, rol: string = '') {
    const params: any = { page, limit: 10 };
    if (rol) {
      params.rol = rol; // Solo agregar si el rol no está vacío
    }
    return this.http.get(`${this.API_URL}/paginated`, { params });
  }

  // Obtener roles disponibles
  getRoles(): Observable<any> {
    return this.http.get(`${this.API_URL}/roles`);
  }
}
