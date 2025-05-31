import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de bord</h1>
      <div class="welcome-message">
        <h2>Bienvenue, {{ currentUser?.prenom }} {{ currentUser?.nom }} !</h2>
        <p>Rôle : <span class="badge">{{ currentUser?.role }}</span></p>
      </div>
      
      <div class="quick-actions">
        <h3>Actions rapides</h3>
        <div class="actions-grid">
          <a routerLink="/courses" class="action-card">
            <h4>📚 Mes Cours</h4>
            <p>Voir tous les cours disponibles</p>
          </a>
          
          <a routerLink="/courses/add" class="action-card" *ngIf="currentUser?.role === 'formateur'">
            <h4>➕ Créer un cours</h4>
            <p>Ajouter un nouveau cours</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-message {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .badge {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .action-card h4 {
      margin: 0 0 0.5rem 0;
      color: #007bff;
    }

    .action-card p {
      margin: 0;
      color: #666;
    }
  `]
})
export class DashboardComponent {
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }
}
