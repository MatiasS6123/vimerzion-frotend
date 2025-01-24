import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class authInterceptor implements HttpInterceptor{
  private readonly publicRoutes = ['/inicio', '/servicios', '/catalogo', '/tecnologias', '/registro', '/login','/contacto','/tienda','/devoluciones'
    ,'/terminos','/pagos'
  ];

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      withCredentials: true, // Adjunta las cookies automáticamente
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        const currentUrl = this.router.url;

        if (error.status === 401) {
          // Si es una ruta pública, no redirigir
          if (this.publicRoutes.some((route) => currentUrl.includes(route))) {
            return throwError(() => error);
          }

          // Guardar la URL actual y redirigir al login
          if (!currentUrl.includes('login') && !currentUrl.includes('auth')) {
            sessionStorage.setItem('redirectUrl', currentUrl);
          }
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.warn('Acceso denegado: no tienes permisos.');

          // Redirigir a una ruta basada en el contexto
          const isAdminRoute = this.router.url.includes('ADMINISTRADOR');
          this.router.navigate([isAdminRoute ? '/catalogo' : '/inicio']);
        }

        return throwError(() => error);
      })
    );
  }

}
