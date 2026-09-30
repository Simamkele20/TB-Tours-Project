import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canActivateAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const AUTHORIZED_MANAGER_EMAIL = 'princetancu06@gmail.com';
  const currentUser = authService.currentUser();

  // Check if user is authenticated and is an admin
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  // Allow all admins to access /admin (dashboard)
  if (state.url === '/admin' || state.url === '/admin/') {
    return true;
  }

  // Restrict /admin/management and /admin/tours to ONLY princetancu06@gmail.com
  if (state.url.includes('/admin/management') || state.url.includes('/admin/tours')) {
    if (currentUser?.email?.toLowerCase() === AUTHORIZED_MANAGER_EMAIL) {
      return true;
    }
    return router.createUrlTree(['/admin']);
  }

  return true;
};
