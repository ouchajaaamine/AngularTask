import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface IUserRepository {
  // Authentification
  authenticate(username: string, password: string): Observable<User | null>;
  getCurrentUser(): Observable<User | null>;
  logout(): Observable<void>;
  
  // Gestion des utilisateurs
  findById(id: string): Observable<User | null>;
  findByUsername(username: string): Observable<User | null>;
  findByEmail(email: string): Observable<User | null>;
  findByRole(role: UserRole): Observable<User[]>;
  findAll(): Observable<User[]>;
  
  // CRUD
  create(user: Omit<User, 'id' | 'dateCreation'>): Observable<User>;
  update(id: string, updates: Partial<User>): Observable<User>;
  delete(id: string): Observable<boolean>;
  
  // Validation
  isUsernameAvailable(username: string): Observable<boolean>;
  isEmailAvailable(email: string): Observable<boolean>;
}
