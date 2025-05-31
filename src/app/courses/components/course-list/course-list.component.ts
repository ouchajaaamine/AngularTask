import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoursesService, Course } from '../../services/courses.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AddCourseComponent } from '../add-course/add-course.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent, AddCourseComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isFormateur: boolean = false;
  isModalOpen = false;
  modalTitle = '';
  editingCourseId: string | null = null;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.isFormateur = this.authService.getUserRole() === 'formateur';
  }

  loadCourses() {
    this.coursesService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  deleteCourse(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du cours:', error);
          alert('Erreur lors de la suppression du cours');
        }
      });
    }
  }

  openAddCourseModal() {
    this.modalTitle = 'Ajouter un nouveau cours';
    this.editingCourseId = null;
    this.isModalOpen = true;
  }

  openEditCourseModal(courseId: string) {
    this.modalTitle = 'Modifier le cours';
    this.editingCourseId = courseId;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingCourseId = null;
  }

  onCourseSaved() {
    this.closeModal();
    this.loadCourses();
  }
}