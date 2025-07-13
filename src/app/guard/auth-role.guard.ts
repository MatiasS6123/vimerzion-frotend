import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authRoleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string> | undefined;
  const isPublic = route.data['public'] ?? false;
  const currentUrl = state.url;

  //console.log('authRoleGuard running - isPublic:', isPublic, 'url:', currentUrl);


  try {
    if (isPublic) {
      //console.log('Public route, access granted');

      return true; // Permitir acceso a rutas públicas
    }

    const isAuthenticated = await firstValueFrom(authService.isAuthenticated());
    if (!isAuthenticated) {
    //  console.log('Not authenticated, redirecting');

      sessionStorage.setItem('redirectUrl', currentUrl);
      await router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
    //  console.log('Unauthorized role, redirecting');

      const response = await firstValueFrom(authService.getRole());
      const userRole = response.role;

      if (!requiredRoles.includes(userRole)) {
     //   console.log('Guard error, redirecting to login', Error);

        const redirectPath = userRole === 'CLIENTE' ? '/catalogo' : '/inicio';
        await router.navigate([redirectPath]);
        return false;
      }
    }

    return true;
  } catch (error) {
    sessionStorage.setItem('redirectUrl', currentUrl);
    await router.navigate(['/login']);
    return false;
  }
};

