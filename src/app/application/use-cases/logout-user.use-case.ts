import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../core/injection-tokens';

export interface LogoutUserResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogoutUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository) {}

  execute(): Observable<LogoutUserResponse> {
    return this.userRepository.logout().pipe(
      map(() => ({
        success: true,
        message: 'Logout successful'
      }))
    );
  }
}
