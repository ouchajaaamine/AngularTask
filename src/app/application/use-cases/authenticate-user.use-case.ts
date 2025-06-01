import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY_TOKEN } from '../../core/injection-tokens';

export interface AuthenticateUserRequest {
  username: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: User;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticateUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository) {}

  execute(request: AuthenticateUserRequest): Observable<AuthenticateUserResponse> {
    if (!request.username || !request.password) {
      return throwError(() => new Error('Username and password are required'));
    }

    if (request.username.trim().length < 3) {
      return throwError(() => new Error('Username must be at least 3 characters long'));
    }

    if (request.password.length < 6) {
      return throwError(() => new Error('Password must be at least 6 characters long'));
    }

    return this.userRepository.authenticate(request.username.trim(), request.password).pipe(
      map(user => {
        if (!user) {
          throw new Error('Invalid username or password');
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }

        return {
          user,
          success: true,
          message: 'Authentication successful'
        };
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Authentication failed'));
      })
    );
  }
}
