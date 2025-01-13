import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(
      withInterceptorsFromDi()
    ),
    {provide:HTTP_INTERCEPTORS, useClass:authInterceptor, multi:true},
    provideAnimations(), // Animaciones necesarias para ngx-toastr
    provideToastr({
      timeOut: 5000, // Duración de las notificaciones
      positionClass: 'toast-bottom-right', // Posición
      preventDuplicates: true, // Evitar duplicados
    }),
  ]
};
