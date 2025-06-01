import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Infrastructure
import { LocalStorageService } from '../infrastructure/storage/local-storage.service';
import { UserRepository } from '../infrastructure/repositories/user.repository';

// Domain interfaces and tokens
import { IUserRepository } from '../domain/interfaces/user-repository.interface';
import { ILocalStorageService } from '../domain/interfaces/storage.interface';
import { USER_REPOSITORY_TOKEN, LOCAL_STORAGE_TOKEN } from './injection-tokens';

// Application services
import { AuthApplicationService } from '../application/services/auth-application.service';

// Use cases
import { AuthenticateUserUseCase } from '../application/use-cases/authenticate-user.use-case';
import { GetCurrentUserUseCase } from '../application/use-cases/get-current-user.use-case';
import { LogoutUserUseCase } from '../application/use-cases/logout-user.use-case';

@NgModule({
  imports: [CommonModule],
  providers: [
    // Storage services
    {
      provide: LOCAL_STORAGE_TOKEN,
      useClass: LocalStorageService
    },

    // Repositories
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    },
    
    // Use cases
    AuthenticateUserUseCase,
    GetCurrentUserUseCase,
    LogoutUserUseCase,
    
    // Application services
    AuthApplicationService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
