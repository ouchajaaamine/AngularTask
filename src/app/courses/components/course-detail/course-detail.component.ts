import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService, Course } from '../../services/courses.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AddCourseComponent } from '../add-course/add-course.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, AddCourseComponent],
  template: `
    <div class="course-detail-container" *ngIf="course">
      <div class="course-header">
        <div class="title-section">
          <h1>{{ course.title }}</h1>
          <span class="level-badge" [class]="course.level.toLowerCase()">
            {{ course.level }}
          </span>
        </div>
        
        <div class="actions" *ngIf="isFormateur">
          <button class="edit-button" (click)="openEditModal()">Modifier</button>
          <button class="delete-button" (click)="deleteCourse()">Supprimer</button>
        </div>
      </div>

      <div class="course-meta">
        <div class="meta-item">
          <span class="label">Durée:</span>
          <span class="value">{{ course.duration }}h</span>
        </div>
        <div class="meta-item">
          <span class="label">Créé le:</span>
          <span class="value">{{ course.dateCreation | date:'dd/MM/yyyy' }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Catégories:</span>
          <div class="categories">
            <span *ngFor="let category of course.categories" class="category">
              {{ category }}
            </span>
          </div>
        </div>
      </div>

      <div class="course-description">
        <h2>Description</h2>
        <p>{{ course.description }}</p>
      </div>

      <div class="course-content">
        <h2>Contenu du cours</h2>
        <div class="sections">
          <div *ngFor="let section of course.content.sections; let i = index" class="section">
            <div class="section-header">
              <h3>Section {{ i + 1 }}: {{ section.title }}</h3>
            </div>
            <p class="section-description">{{ section.description }}</p>
            <div class="resources" *ngIf="section.resources.length > 0">
              <h4>Ressources:</h4>
              <ul>
                <li *ngFor="let resource of section.resources">{{ resource }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section pour les étudiants -->
      <div class="enrollment-section" *ngIf="!isFormateur">
        <button
          class="enroll-button"
          [class.enrolled]="isEnrolled"
          (click)="toggleEnrollment()"
          [disabled]="isProcessing">
          {{ isEnrolled ? 'Se désinscrire' : "S'inscrire au cours" }}
        </button>
      </div>

      <!-- Section pour les formateurs : liste des étudiants inscrits -->
      <div class="students-section" *ngIf="isFormateur">
        <h2>Étudiants inscrits ({{ enrolledStudents.length }})</h2>

        <div class="filter-section">
          <label for="studentFilter">Filtrer les étudiants :</label>
          <select id="studentFilter" [(ngModel)]="studentFilter" (change)="filterStudents()" class="form-control">
            <option value="all">Tous les étudiants</option>
            <option value="enrolled">Inscrits uniquement</option>
            <option value="not-enrolled">Non inscrits uniquement</option>
          </select>
        </div>

        <div class="students-list" *ngIf="filteredStudents.length > 0">
          <div *ngFor="let student of filteredStudents" class="student-item">
            <div class="student-info">
              <span class="student-name">{{ student.prenom }} {{ student.nom }}</span>
              <span class="student-username">{{ formatUsername(student.username) }}</span>
            </div>
            <span class="enrollment-status" [class.enrolled]="student.isEnrolled">
              {{ student.isEnrolled ? 'Inscrit' : 'Non inscrit' }}
            </span>
          </div>
        </div>

        <div *ngIf="filteredStudents.length === 0" class="no-students">
          <p>Aucun étudiant trouvé pour ce filtre.</p>
        </div>
      </div>

      <!-- Modal pour modifier le cours -->
      <app-modal
        [isOpen]="isEditModalOpen"
        [title]="'Modifier le cours'"
        (closeModal)="closeEditModal()">
        <app-add-course
          [courseId]="course?.id || null"
          (courseSaved)="onCourseSaved()">
        </app-add-course>
      </app-modal>
    </div>
  `,
  styles: [`
    .course-detail-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 1rem;

      h1 {
        margin: 0;
        color: #333;
        font-size: 2rem;
      }
    }

    .level-badge {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;

      &.debutant {
        background-color: #e3fcef;
        color: #28a745;
      }

      &.intermediaire {
        background-color: #fff3cd;
        color: #ffc107;
      }

      &.avance {
        background-color: #f8d7da;
        color: #dc3545;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .edit-button {
        background-color: #ffc107;
        color: #000;

        &:hover {
          background-color: #e0a800;
        }
      }

      .delete-button {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }
      }
    }

    .course-meta {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .label {
        font-weight: 500;
        color: #6c757d;
      }

      .value {
        color: #333;
      }
    }

    .categories {
      display: flex;
      gap: 0.5rem;
    }

    .category {
      background-color: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #495057;
    }

    .course-description {
      margin-bottom: 2rem;

      h2 {
        color: #333;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        line-height: 1.6;
      }
    }

    .course-content {
      h2 {
        color: #333;
        margin-bottom: 1rem;
      }
    }

    .section {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;

      .section-header {
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          color: #333;
        }
      }

      .section-description {
        color: #666;
        margin-bottom: 1rem;
      }

      .resources {
        h4 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;

          li {
            color: #666;
            padding: 0.25rem 0;
          }
        }
      }
    }

    .enrollment-section {
      margin-top: 2rem;
      text-align: center;
    }

    .enroll-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:not(.enrolled) {
        background-color: #007bff;
        color: white;

        &:hover:not(:disabled) {
          background-color: #0056b3;
        }
      }

      &.enrolled {
        background-color: #dc3545;
        color: white;

        &:hover:not(:disabled) {
          background-color: #c82333;
        }
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }

    .students-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #dee2e6;

      h2 {
        color: #333;
        margin-bottom: 1.5rem;
      }
    }

    .filter-section {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-control {
        width: 200px;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
    }

    .students-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .student-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .student-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .student-name {
        font-weight: 500;
        color: #333;
      }

      .student-username {
        font-size: 0.875rem;
        color: #6c757d;
      }
    }

    .enrollment-status {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      background-color: #dc3545;
      color: white;

      &.enrolled {
        background-color: #28a745;
      }
    }

    .no-students {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-style: italic;
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  isFormateur: boolean = false;
  isEnrolled: boolean = false;
  isProcessing: boolean = false;

  // Propriétés pour la gestion des étudiants
  enrolledStudents: any[] = [];
  allStudents: any[] = [];
  filteredStudents: any[] = [];
  studentFilter: 'all' | 'enrolled' | 'not-enrolled' = 'all';

  // Propriétés pour la modal d'édition
  isEditModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isFormateur = this.authService.getUserRole() === 'formateur';
    this.loadCourse();
    if (this.isFormateur) {
      this.loadAllStudents();
    }
  }

  private loadCourse() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) {
      this.router.navigate(['/courses']);
      return;
    }

    this.coursesService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.checkEnrollmentStatus();
        if (this.isFormateur) {
          this.loadEnrolledStudents();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.router.navigate(['/courses']);
      }
    });
  }

  private checkEnrollmentStatus() {
    if (!this.course || !this.authService.currentUserValue) return;
    
    this.isEnrolled = this.course.students.includes(this.authService.currentUserValue.id);
  }

  openEditModal() {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  onCourseSaved() {
    this.closeEditModal();
    this.loadCourse(); // Recharger les données du cours
  }

  deleteCourse() {
    if (!this.course) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.coursesService.deleteCourse(this.course.id).subscribe({
        next: () => {
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du cours:', error);
          alert('Erreur lors de la suppression du cours');
        }
      });
    }
  }

  toggleEnrollment() {
    if (!this.course || !this.authService.currentUserValue || this.isProcessing) return;

    this.isProcessing = true;
    const userId = this.authService.currentUserValue.id;
    
    const action = this.isEnrolled
      ? this.coursesService.unenrollStudent(this.course.id, userId)
      : this.coursesService.enrollStudent(this.course.id, userId);

    action.subscribe({
      next: (updatedCourse) => {
        this.course = updatedCourse;
        this.isEnrolled = !this.isEnrolled;
        this.isProcessing = false;
      },
      error: (error) => {
        console.error("Erreur lors de l'inscription/désinscription:", error);
        alert("Une erreur est survenue lors de l'inscription/désinscription");
        this.isProcessing = false;
      }
    });
  }

  // Méthodes pour la gestion des étudiants (formateurs uniquement)
  private loadAllStudents() {
    // Simuler le chargement de tous les étudiants depuis le service Auth
    // Dans une vraie application, cela viendrait d'un service dédié
    this.allStudents = [
      { id: '2', username: 'etudiant1', nom: 'Martin', prenom: 'Sophie', role: 'etudiant' },
      { id: '4', username: 'etudiant', nom: 'Khaldi', prenom: 'Hicham', role: 'etudiant' },
      // Ajouter d'autres étudiants fictifs pour la démonstration
      { id: '5', username: 'etudiant2', nom: 'Durand', prenom: 'Pierre', role: 'etudiant' },
      { id: '6', username: 'etudiant3', nom: 'Moreau', prenom: 'Marie', role: 'etudiant' }
    ];
    this.filterStudents();
  }

  private loadEnrolledStudents() {
    if (!this.course) return;

    // Filtrer les étudiants inscrits
    this.enrolledStudents = this.allStudents.filter(student =>
      this.course!.students.includes(student.id)
    );
    this.filterStudents();
  }

  filterStudents() {
    if (!this.course) return;

    switch (this.studentFilter) {
      case 'enrolled':
        this.filteredStudents = this.allStudents
          .filter(student => this.course!.students.includes(student.id))
          .map(student => ({ ...student, isEnrolled: true }));
        break;
      case 'not-enrolled':
        this.filteredStudents = this.allStudents
          .filter(student => !this.course!.students.includes(student.id))
          .map(student => ({ ...student, isEnrolled: false }));
        break;
      default: // 'all'
        this.filteredStudents = this.allStudents.map(student => ({
          ...student,
          isEnrolled: this.course!.students.includes(student.id)
        }));
        break;
    }
  }

  formatUsername(username: string): string {
    return `(@${username})`;
  }
}