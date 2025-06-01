import { Observable } from 'rxjs';
import { Course } from '../entities/course.entity';
import { CourseLevel } from '../enums/course-level.enum';

export interface ICourseRepository {
  // Lecture
  findAll(): Observable<Course[]>;
  findById(id: string): Observable<Course | null>;
  findByFormateur(formateurId: string): Observable<Course[]>;
  findByLevel(level: CourseLevel): Observable<Course[]>;
  findByCategory(category: string): Observable<Course[]>;
  findByStudentEnrollment(studentId: string): Observable<Course[]>;
  
  // CRUD
  create(course: Omit<Course, 'id' | 'dateCreation'>): Observable<Course>;
  update(id: string, updates: Partial<Course>): Observable<Course>;
  delete(id: string): Observable<boolean>;
  
  // Gestion des inscriptions
  enrollStudent(courseId: string, studentId: string): Observable<Course>;
  unenrollStudent(courseId: string, studentId: string): Observable<Course>;
  getEnrolledStudents(courseId: string): Observable<string[]>;
  
  // Recherche et filtrage
  search(query: string): Observable<Course[]>;
  filterByMultipleCriteria(criteria: {
    level?: CourseLevel;
    categories?: string[];
    formateurId?: string;
    isActive?: boolean;
  }): Observable<Course[]>;
}
