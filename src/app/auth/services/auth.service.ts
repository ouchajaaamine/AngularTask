import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCK_USERS, MOCK_CREDENTIALS } from '../../infrastructure/mock-data/users.data';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export interface UserAuth {
  id: string;
  username: string;
  role: 'formateur' | 'etudiant';
  nom: string;
  prenom: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserAuth | null>;
  public currentUser: Observable<UserAuth | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUserSubject = new BehaviorSubject<UserAuth | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): UserAuth | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          console.log('AuthService - Utilisateur chargé depuis localStorage:', user);
          return user;
        }
      } catch (error) {
        console.error('AuthService - Erreur lors du chargement depuis localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  }

  public get currentUserValue(): UserAuth | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserAuth> {
    // Nettoyer les espaces
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    console.log('Tentative de connexion:', { username: cleanUsername, password: cleanPassword });
    console.log('Utilisateurs disponibles:', MOCK_USERS.map((u: User) => ({ username: u.username, role: u.role })));

    // Vérifier les credentials
    const credential = MOCK_CREDENTIALS.find(cred => cred.username === cleanUsername && cred.password === cleanPassword);
    console.log('Credential trouvé:', credential);

    if (credential) {
      // Trouver l'utilisateur correspondant
      const user = MOCK_USERS.find((u: User) => u.username === cleanUsername);
      console.log('Utilisateur trouvé:', user);

      if (user) {
        // Convertir l'entité User en UserAuth pour l'interface
        const userAuth: UserAuth = {
          id: user.id,
          username: user.username,
          role: user.role === UserRole.FORMATEUR ? 'formateur' : 'etudiant',
          nom: user.nom,
          prenom: user.prenom
        };

        // Sauvegarder dans localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(userAuth));
          console.log('Utilisateur sauvé dans localStorage:', userAuth);
        }

        // Mettre à jour le subject
        this.currentUserSubject.next(userAuth);

        // Vérification immédiate
        console.log('Connexion réussie pour:', userAuth);
        console.log('État après connexion - isLoggedIn:', this.isLoggedIn());
        console.log('État après connexion - currentUserValue:', this.currentUserValue);

        // Double vérification pour s'assurer que l'état est correct
        setTimeout(() => {
          console.log('Vérification différée - isLoggedIn:', this.isLoggedIn());
          console.log('Vérification différée - currentUserValue:', this.currentUserValue);
        }, 50);

        return of(userAuth);
      }
    }

    console.log('Échec de la connexion - utilisateur non trouvé');
    return throwError(() => new Error('Nom d\'utilisateur ou mot de passe incorrect'));
  }

  logout(): void {
    console.log('Logout - Début de la déconnexion');
    console.log('Logout - État avant:', {
      currentUserValue: this.currentUserValue,
      isLoggedIn: this.isLoggedIn()
    });

    // Nettoyer localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      console.log('Logout - localStorage nettoyé');
    }

    // Mettre à jour le subject
    this.currentUserSubject.next(null);

    console.log('Logout - État après:', {
      currentUserValue: this.currentUserValue,
      isLoggedIn: this.isLoggedIn()
    });
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    const result = !!currentUser;
    console.log('isLoggedIn - Résultat:', result, 'User:', currentUser);
    return result;
  }

  getUserRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  // Méthode pour recharger l'utilisateur depuis localStorage (uniquement au démarrage)
  loadUserFromStorage(): void {
    if (!this.currentUserValue && isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('LoadUserFromStorage - Rechargement utilisateur:', userData);
          this.currentUserSubject.next(userData);
        } catch (e) {
          console.error('LoadUserFromStorage - Erreur:', e);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  // Méthode de debug pour forcer la synchronisation
  forceSync(): void {
    console.log('ForceSync - État actuel:', {
      currentUserValue: this.currentUserValue,
      isLoggedIn: !!this.currentUserValue
    });

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      console.log('ForceSync - localStorage:', storedUser);

      if (storedUser && !this.currentUserValue) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('ForceSync - Rechargement depuis localStorage:', userData);
          this.currentUserSubject.next(userData);
        } catch (e) {
          console.error('ForceSync - Erreur:', e);
          localStorage.removeItem('currentUser');
        }
      }
    }

    console.log('ForceSync - État final:', {
      currentUserValue: this.currentUserValue,
      isLoggedIn: !!this.currentUserValue
    });
  }
}
