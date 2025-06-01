import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { AuthenticateUserUseCase, AuthenticateUserRequest } from '../use-cases/authenticate-user.use-case';
import { GetCurrentUserUseCase } from '../use-cases/get-current-user.use-case';
import { LogoutUserUseCase } from '../use-cases/logout-user.use-case';

@Injectable({
  providedIn: 'root'
})
export class AuthApplicationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private logoutUserUseCase: LogoutUserUseCase
  ) {
    // Initialize authentication state
    this.getCurrentUser().subscribe(user => {
      this.isAuthenticatedSubject.next(!!user);
    });
  }

  login(username: string, password: string): Observable<User> {
    const request: AuthenticateUserRequest = { username, password };
    
    return this.authenticateUserUseCase.execute(request).pipe(
      map(response => response.user),
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  logout(): Observable<void> {
    return this.logoutUserUseCase.execute().pipe(
      map(() => void 0),
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.getCurrentUserUseCase.execute();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user?.role === role || false)
    );
  }

  isFormateur(): Observable<boolean> {
    return this.hasRole(UserRole.FORMATEUR);
  }

  isEtudiant(): Observable<boolean> {
    return this.hasRole(UserRole.ETUDIANT);
  }

  getUserRole(): Observable<UserRole | null> {
    return this.getCurrentUser().pipe(
      map(user => user?.role || null)
    );
  }

  getUserId(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      map(user => user?.id || null)
    );
  }

  getUserFullName(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      map(user => user?.fullName || null)
    );
  }
}
