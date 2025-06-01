import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { LocalStorageService } from '../storage/local-storage.service';
import { JWTService } from '../security/jwt.service';
import { EncryptionService } from '../security/encryption.service';
import { MOCK_USERS, MOCK_CREDENTIALS } from '../mock-data/users.data';

@Injectable({
  providedIn: 'root'
})
export class UserRepository implements IUserRepository {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 heures
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private sessionTimer: any;

  constructor(
    private storageService: LocalStorageService,
    private jwtService: JWTService,
    private encryptionService: EncryptionService
  ) {
    // Initialisation seulement côté client
    if (typeof window !== 'undefined') {
      this.initializeData();
      this.loadCurrentUser();
      // Démarrer le monitoring seulement après un délai
      setTimeout(() => this.startSessionMonitoring(), 1000);
    }
  }

  private initializeData(): void {
    if (!this.storageService.hasItem(this.USERS_KEY)) {
      this.storageService.setItem(this.USERS_KEY, MOCK_USERS.map(user => user.toJSON()));
    }
  }

  private loadCurrentUser(): void {
    const userData = this.storageService.getItem<any>(this.CURRENT_USER_KEY);
    if (userData) {
      const user = User.create(userData);
      this.currentUserSubject.next(user);
    }
  }

  private getUsers(): User[] {
    const usersData = this.storageService.getItem<any[]>(this.USERS_KEY) || [];
    return usersData.map(userData => User.create(userData));
  }

  private saveUsers(users: User[]): void {
    this.storageService.setItem(this.USERS_KEY, users.map(user => user.toJSON()));
  }

  authenticate(username: string, password: string): Observable<User | null> {
    return of(null).pipe(
      delay(500), // Simulate network delay
      map(() => {
        // Sanitize inputs
        const sanitizedUsername = this.encryptionService.sanitizeInput(username);
        const sanitizedPassword = this.encryptionService.sanitizeInput(password);

        const credential = MOCK_CREDENTIALS.find(
          cred => cred.username === sanitizedUsername && cred.password === sanitizedPassword
        );

        if (!credential) {
          throw new Error('Invalid credentials');
        }

        const users = this.getUsers();
        const user = users.find(u => u.username === sanitizedUsername);

        if (!user || !user.isActive) {
          throw new Error('User not found or inactive');
        }

        // Generate JWT token
        const token = this.jwtService.generateToken({
          userId: user.id,
          username: user.username,
          role: user.role
        });

        // Store token and user securely
        this.storageService.setSecureItem(this.AUTH_TOKEN_KEY, token);
        this.storageService.setSecureItem(this.CURRENT_USER_KEY, user.toJSON());
        this.currentUserSubject.next(user);

        // Start session monitoring
        this.startSessionMonitoring();

        return user;
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
      map(() => {
        this.clearSession();
      })
    );
  }

  private startSessionMonitoring(): void {
    // Seulement côté client
    if (typeof window === 'undefined') return;

    // Clear existing timer
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    // Check token validity every minute
    this.sessionTimer = setInterval(() => {
      this.validateSession();
    }, 60000);
  }

  private validateSession(): void {
    const token = this.storageService.getSecureItem<string>(this.AUTH_TOKEN_KEY);

    if (!token || this.jwtService.isTokenExpired(token)) {
      this.clearSession();
      return;
    }

    // Auto-refresh token if it expires in less than 1 hour
    const expirationDate = this.jwtService.getTokenExpirationDate(token);
    if (expirationDate) {
      const timeUntilExpiry = expirationDate.getTime() - Date.now();
      if (timeUntilExpiry < 60 * 60 * 1000) { // 1 hour
        const refreshedToken = this.jwtService.refreshToken(token);
        if (refreshedToken) {
          this.storageService.setSecureItem(this.AUTH_TOKEN_KEY, refreshedToken);
        }
      }
    }
  }

  private clearSession(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    this.storageService.removeItem(this.CURRENT_USER_KEY);
    this.storageService.removeItem(this.AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  findById(id: string): Observable<User | null> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return users.find(user => user.id === id) || null;
      })
    );
  }

  findByUsername(username: string): Observable<User | null> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return users.find(user => user.username === username) || null;
      })
    );
  }

  findByEmail(email: string): Observable<User | null> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return users.find(user => user.email === email) || null;
      })
    );
  }

  findByRole(role: UserRole): Observable<User[]> {
    return of([]).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return users.filter(user => user.role === role);
      })
    );
  }

  findAll(): Observable<User[]> {
    return of([]).pipe(
      delay(200),
      map(() => this.getUsers())
    );
  }

  create(userData: Omit<User, 'id' | 'dateCreation'>): Observable<User> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const users = this.getUsers();
        const newUser = User.create({
          ...userData,
          id: Date.now().toString(),
          dateCreation: new Date()
        });
        
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
      })
    );
  }

  update(id: string, updates: Partial<User>): Observable<User> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        const existingUser = users[userIndex];
        const updatedUser = User.create({
          ...existingUser.toJSON(),
          ...updates,
          id: existingUser.id,
          dateCreation: existingUser.dateCreation
        });
        
        users[userIndex] = updatedUser;
        this.saveUsers(users);
        
        // Update current user if it's the same
        if (this.currentUserSubject.value?.id === id) {
          this.currentUserSubject.next(updatedUser);
          this.storageService.setSecureItem(this.CURRENT_USER_KEY, updatedUser.toJSON());
        }
        
        return updatedUser;
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return of(false).pipe(
      delay(300),
      map(() => {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        
        if (filteredUsers.length === users.length) {
          return false;
        }
        
        this.saveUsers(filteredUsers);
        return true;
      })
    );
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    return of(false).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return !users.some(user => user.username === username);
      })
    );
  }

  isEmailAvailable(email: string): Observable<boolean> {
    return of(false).pipe(
      delay(200),
      map(() => {
        const users = this.getUsers();
        return !users.some(user => user.email === email);
      })
    );
  }
}
