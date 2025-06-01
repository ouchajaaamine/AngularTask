import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService, Course } from '../../services/courses.service';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { StudentManagementService, StudentWithEnrollment } from '../../../application/services/student-management.service';
import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AddCourseComponent } from '../add-course/add-course.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, AddCourseComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  currentUser: User | null = null;
  isFormateur: boolean = false;
  isEnrolled: boolean = false;
  isProcessing: boolean = false;

  // Propriétés pour la gestion des étudiants
  enrolledStudents: User[] = [];
  allStudents: StudentWithEnrollment[] = [];
  filteredStudents: StudentWithEnrollment[] = [];
  studentFilter: 'all' | 'enrolled' | 'not-enrolled' = 'all';

  // Propriétés pour la modal d'édition
  isEditModalOpen = false;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthApplicationService,
    private studentService: StudentManagementService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadCourse();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadCurrentUser() {
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        this.isFormateur = user?.isFormateur() || false;
        if (this.isFormateur) {
          this.loadAllStudents();
        }
      })
    );
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
          this.loadAllStudents();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.router.navigate(['/courses']);
      }
    });
  }

  private checkEnrollmentStatus() {
    if (!this.course || !this.currentUser) return;

    this.isEnrolled = this.course.students.includes(this.currentUser.id);
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
    if (!this.course || !this.currentUser || this.isProcessing) return;

    this.isProcessing = true;
    const userId = this.currentUser.id;

    const action = this.isEnrolled
      ? this.coursesService.unenrollStudent(this.course.id, userId)
      : this.coursesService.enrollStudent(this.course.id, userId);

    action.subscribe({
      next: (updatedCourse) => {
        this.course = updatedCourse;
        this.isEnrolled = !this.isEnrolled;
        this.isProcessing = false;
        // Recharger la liste des étudiants si on est formateur
        if (this.isFormateur) {
          this.loadAllStudents();
        }
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
    if (!this.course) return;

    this.subscriptions.add(
      this.studentService.getStudentsWithEnrollmentStatus(this.course.students).subscribe({
        next: (students) => {
          this.allStudents = students;
          this.enrolledStudents = students
            .filter(s => s.isEnrolled)
            .map(s => s.user);
          this.filterStudents();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des étudiants:', error);
        }
      })
    );
  }

  filterStudents() {
    if (!this.course) return;

    switch (this.studentFilter) {
      case 'enrolled':
        this.filteredStudents = this.allStudents.filter(student => student.isEnrolled);
        break;
      case 'not-enrolled':
        this.filteredStudents = this.allStudents.filter(student => !student.isEnrolled);
        break;
      default: // 'all'
        this.filteredStudents = this.allStudents;
        break;
    }
  }

  formatUsername(username: string): string {
    return `(@${username})`;
  }
}