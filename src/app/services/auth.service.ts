import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RoleResponse, userLogin } from '../models/user';
import { environment } from '../../environments/environment.prod';
import { LoginResponse } from '../models/user'; // asegúrate de importar la nueva interfaz


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/auth`
  private userData?: LoginResponse['user'];

  constructor(private http: HttpClient) {}

  /**
   * Iniciar sesión del usuario y almacenar el token en una cookie.
   * @param user Objeto con las credenciales del usuario.
   * @returns Observable con la respuesta del servidor.
   */
login(user: userLogin): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/login`, user).pipe(
    tap((response) => {
      this.setUserData(response.user);
    }),
    catchError((error) => {
      return throwError(() => error);
    })
  );
}

setUserData(user: LoginResponse['user']) {
  this.userData = user;
  localStorage.setItem('userData', JSON.stringify(user)); // AGREGAR ESTO
}

getUserData(): LoginResponse['user'] | undefined {
  if (!this.userData) {
    const stored = localStorage.getItem('userData');
    if (stored) {
      this.userData = JSON.parse(stored); // CARGAR DESDE LOCALSTORAGE
    }
  }
  return this.userData;
}

clearUserData() {
  this.userData = undefined;
  localStorage.removeItem('userData');
}

  /**
   * Cerrar sesión del usuario eliminando la cookie del token.
   * @returns Observable con la respuesta del servidor.
   */
 logout(): Observable<any> {
  return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
    tap(() => this.clearUserData())
  );
}

  /**
   * Verificar si el usuario está autenticado.
   * @returns Observable<boolean> indicando si está autenticado.
   */
  isAuthenticated(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>(`${this.API_URL}/authenticated`, { withCredentials: true });
  }
  

  /**
   * Obtener el rol del usuario autenticado.
   * @returns Observable<string> con el rol del usuario.
   */
  getRole(): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.API_URL}/role`, { withCredentials: true });
  }

  getRemainingTime(): Observable<{ remainingTime: number }> {
    return this.http.get<{ remainingTime: number }>(`${this.API_URL}/remaining-time`, { withCredentials: true });
  }
  getId(): Observable<{ id: number }> {
    return this.http.get<{ id: number }>(`${this.API_URL}/id`, { withCredentials: true });
  }
}
