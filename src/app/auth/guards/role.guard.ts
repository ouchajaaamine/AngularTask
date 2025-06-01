import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthApplicationService } from '../../application/services/auth-application.service';
import { UserRole } from '../../domain/enums/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthApplicationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'] as UserRole;

    return this.authService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        if (requiredRole && user.role === requiredRole) {
          return true;
        }

        // Redirection vers la page d'accueil si le rôle ne correspond pas
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}