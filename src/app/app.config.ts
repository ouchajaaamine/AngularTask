import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Clean Architecture imports
import { USER_REPOSITORY_TOKEN, LOCAL_STORAGE_TOKEN } from './core/injection-tokens';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { LocalStorageService } from './infrastructure/storage/local-storage.service';
import { JWTService } from './infrastructure/security/jwt.service';
import { EncryptionService } from './infrastructure/security/encryption.service';
import { AuthApplicationService } from './application/services/auth-application.service';
import { ValidationService } from './application/services/validation.service';
import { StudentManagementService } from './application/services/student-management.service';
import { LoggerService } from './core/services/logger.service';

// Use cases
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';

// Guards
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // Infrastructure services
    {
      provide: LOCAL_STORAGE_TOKEN,
      useClass: LocalStorageService
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    },

    // Security services
    JWTService,
    EncryptionService,

    // Application services
    AuthApplicationService,
    ValidationService,
    StudentManagementService,
    LoggerService,

    // Use cases
    AuthenticateUserUseCase,
    GetCurrentUserUseCase,
    LogoutUserUseCase,

    // Guards
    AuthGuard,
    RoleGuard
  ]
};
