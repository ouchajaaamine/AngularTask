import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  role: 'formateur' | 'etudiant';
  nom: string;
  prenom: string;
}

const MOCK_USERS = [
  {
    id: '1',
    username: 'formateur1',
    password: 'pass123',
    role: 'formateur' as const,
    nom: 'Dupont',
    prenom: 'Jean'
  },
  {
    id: '2',
    username: 'etudiant1',
    password: 'pass123',
    role: 'etudiant' as const,
    nom: 'Martin',
    prenom: 'Sophie'
  },
  {
    id: '3',
    username: 'formateur',
    password: 'formateur',
    role: 'formateur' as const,
    nom: 'Ouchajaa',
    prenom: 'Amine'
  },
  {
    id: '4',
    username: 'etudiant',
    password: 'etudiant',
    role: 'etudiant' as const,
    nom: 'Khaldi',
    prenom: 'Hicham'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
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

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // Nettoyer les espaces
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    console.log('Tentative de connexion:', { username: cleanUsername, password: cleanPassword });
    console.log('Utilisateurs disponibles:', MOCK_USERS.map(u => ({ username: u.username, role: u.role })));

    const user = MOCK_USERS.find(u => u.username === cleanUsername && u.password === cleanPassword);
    console.log('Utilisateur trouvé:', user);

    if (user) {
      // Omit password from stored user data
      const { password: _, ...userWithoutPassword } = user;

      // Sauvegarder dans localStorage d'abord
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        console.log('Utilisateur sauvé dans localStorage:', userWithoutPassword);
      }

      // Mettre à jour le subject
      this.currentUserSubject.next(userWithoutPassword);

      // Vérification immédiate
      console.log('Connexion réussie pour:', userWithoutPassword);
      console.log('État après connexion - isLoggedIn:', this.isLoggedIn());
      console.log('État après connexion - currentUserValue:', this.currentUserValue);

      // Double vérification pour s'assurer que l'état est correct
      setTimeout(() => {
        console.log('Vérification différée - isLoggedIn:', this.isLoggedIn());
        console.log('Vérification différée - currentUserValue:', this.currentUserValue);
      }, 50);

      return of(userWithoutPassword);
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
