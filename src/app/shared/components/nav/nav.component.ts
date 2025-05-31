import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">Gestion des Cours</div>
      <div class="nav-links">
        <a routerLink="/courses" routerLinkActive="active">Cours</a>
        <ng-container *ngIf="!authService.isLoggedIn()">
          <a routerLink="/auth/login">Connexion</a>
        </ng-container>
        <ng-container *ngIf="authService.isLoggedIn()">
          <button (click)="logout()" class="logout-btn">Déconnexion</button>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;

      a {
        text-decoration: none;
        color: #333;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #e9ecef;
        }

        &.active {
          color: #007bff;
          font-weight: bold;
        }
      }
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #c82333;
      }
    }
  `]
})
export class NavComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    // Rediriger vers la page de login après déconnexion
    this.router.navigate(['/auth/login']);
  }
}