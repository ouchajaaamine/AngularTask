import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { User } from '../../../domain/entities/user.entity';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoggedIn = false;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // Rediriger quand même vers login en cas d'erreur
        this.router.navigate(['/auth/login']);
      }
    });
  }
}