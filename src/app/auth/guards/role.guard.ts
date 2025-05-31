import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole();

    if (requiredRole && userRole === requiredRole) {
      return true;
    }

    // Redirection vers la page d'accueil si le rôle ne correspond pas
    this.router.navigate(['/']);
    return false;
  }
} 