import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Course {
  id: string;
  title: string;
  description: string;
  formateurId: string;
  dateCreation: Date;
  duration: number; // en heures
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  categories: string[];
  students: string[]; // IDs des étudiants inscrits
  content: {
    sections: {
      title: string;
      description: string;
      resources: string[];
    }[];
  };
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction à Angular',
    description: 'Apprenez les bases du framework Angular',
    formateurId: '1',
    dateCreation: new Date(),
    duration: 20,
    level: 'DEBUTANT',
    categories: ['Web', 'Frontend', 'Angular'],
    students: [],
    content: {
      sections: [
        {
          title: 'Introduction',
          description: 'Découverte du framework',
          resources: ['slides.pdf', 'demo.mp4']
        }
      ]
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courses: Course[] = [];
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCourses();
  }

  private loadCourses(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
      } else {
        this.courses = MOCK_COURSES;
        this.saveCourses();
      }
    } else {
      this.courses = MOCK_COURSES;
    }
    this.coursesSubject.next(this.courses);
  }

  private saveCourses(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('courses', JSON.stringify(this.courses));
    }
    this.coursesSubject.next(this.courses);
  }

  getAllCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourseById(id: string): Observable<Course> {
    const course = this.courses.find(c => c.id === id);
    return course ? of(course) : throwError(() => new Error('Cours non trouvé'));
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    const newCourse = {
      ...course,
      id: Date.now().toString(),
      dateCreation: new Date()
    };
    this.courses.push(newCourse);
    this.saveCourses();
    return of(newCourse);
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Cours non trouvé'));
    }
    
    this.courses[index] = { ...this.courses[index], ...updates };
    this.saveCourses();
    return of(this.courses[index]);
  }

  deleteCourse(id: string): Observable<boolean> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Cours non trouvé'));
    }

    this.courses.splice(index, 1);
    this.saveCourses();
    return of(true);
  }

  // Méthodes spécifiques pour les étudiants
  enrollStudent(courseId: string, studentId: string): Observable<Course> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) {
      return throwError(() => new Error('Cours non trouvé'));
    }

    if (course.students.includes(studentId)) {
      return throwError(() => new Error('Étudiant déjà inscrit'));
    }

    course.students.push(studentId);
    this.saveCourses();
    return of(course);
  }

  unenrollStudent(courseId: string, studentId: string): Observable<Course> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) {
      return throwError(() => new Error('Cours non trouvé'));
    }

    const index = course.students.indexOf(studentId);
    if (index === -1) {
      return throwError(() => new Error('Étudiant non inscrit'));
    }

    course.students.splice(index, 1);
    this.saveCourses();
    return of(course);
  }
} 