import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('AuthGuard - Vérification d\'accès pour:', state.url);

    // Charger l'utilisateur depuis localStorage si nécessaire
    this.authService.loadUserFromStorage();

    // Retourner un Observable avec un délai pour permettre la synchronisation
    return of(null).pipe(
      delay(50), // Petit délai pour la synchronisation
      map(() => {
        const currentUser = this.authService.currentUserValue;
        const isLoggedIn = this.authService.isLoggedIn();

        console.log('AuthGuard - Après délai - isLoggedIn:', isLoggedIn);
        console.log('AuthGuard - Après délai - currentUser:', currentUser);

        // Vérification avec localStorage comme fallback
        let hasValidUser = isLoggedIn;

        if (!hasValidUser && typeof window !== 'undefined' && window.localStorage) {
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              console.log('AuthGuard - Utilisateur trouvé dans localStorage:', userData);
              hasValidUser = true;
            } catch (e) {
              console.error('AuthGuard - Erreur localStorage:', e);
            }
          }
        }

        if (hasValidUser) {
          console.log('AuthGuard - Accès autorisé');
          return true;
        }

        // Non connecté, redirection vers la page de login
        console.log('AuthGuard - Accès refusé, redirection vers login');
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
} 