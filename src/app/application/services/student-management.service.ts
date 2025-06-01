import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { USER_REPOSITORY_TOKEN } from '../../core/injection-tokens';

export interface StudentWithEnrollment {
  user: User;
  isEnrolled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository
  ) {}

  getAllStudents(): Observable<User[]> {
    return this.userRepository.findByRole(UserRole.ETUDIANT);
  }

  getStudentsWithEnrollmentStatus(enrolledStudentIds: string[]): Observable<StudentWithEnrollment[]> {
    return this.getAllStudents().pipe(
      map(students => 
        students.map(student => ({
          user: student,
          isEnrolled: enrolledStudentIds.includes(student.id)
        }))
      )
    );
  }

  getEnrolledStudents(enrolledStudentIds: string[]): Observable<User[]> {
    return this.getAllStudents().pipe(
      map(students => 
        students.filter(student => enrolledStudentIds.includes(student.id))
      )
    );
  }

  getNotEnrolledStudents(enrolledStudentIds: string[]): Observable<User[]> {
    return this.getAllStudents().pipe(
      map(students => 
        students.filter(student => !enrolledStudentIds.includes(student.id))
      )
    );
  }

  searchStudents(query: string, enrolledStudentIds: string[]): Observable<StudentWithEnrollment[]> {
    return this.getStudentsWithEnrollmentStatus(enrolledStudentIds).pipe(
      map(students => 
        students.filter(student => 
          student.user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          student.user.username.toLowerCase().includes(query.toLowerCase()) ||
          student.user.email.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}
