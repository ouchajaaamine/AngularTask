import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY_TOKEN } from '../../core/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository) {}

  execute(): Observable<User | null> {
    return this.userRepository.getCurrentUser();
  }
}
