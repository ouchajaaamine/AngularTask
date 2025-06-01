import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthApplicationService } from '../application/services/auth-application.service';
import { User } from '../domain/entities/user.entity';
import { UserRole } from '../domain/enums/user-role.enum';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { AddCourseComponent } from '../courses/components/add-course/add-course.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent, AddCourseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isCreateCourseModalOpen = false;
  userRole: string = '';
  isFormateur = false;
  isEtudiant = false;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.userRole = user.role;
          this.isFormateur = user.isFormateur();
          this.isEtudiant = user.isEtudiant();
          console.log('Dashboard - Utilisateur connecté:', user.displayName, 'Rôle:', user.role);
        }
      })
    );

    // Vérifier les paramètres de requête pour le rôle
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        if (params['role']) {
          console.log('Dashboard - Rôle depuis URL:', params['role']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openCreateCourseModal() {
    this.isCreateCourseModalOpen = true;
  }

  closeCreateCourseModal() {
    this.isCreateCourseModalOpen = false;
  }

  onCourseSaved() {
    this.closeCreateCourseModal();
    // Optionnel: rediriger vers la liste des cours
    this.router.navigate(['/courses']);
  }
}
