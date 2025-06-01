import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthenticateUserUseCase, AuthenticateUserRequest } from './authenticate-user.use-case';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { USER_REPOSITORY_TOKEN } from '../../core/injection-tokens';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let mockUserRepository: jasmine.SpyObj<IUserRepository>;
  let mockUser: User;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IUserRepository', ['authenticate']);

    TestBed.configureTestingModule({
      providers: [
        AuthenticateUserUseCase,
        { provide: USER_REPOSITORY_TOKEN, useValue: spy }
      ]
    });

    useCase = TestBed.inject(AuthenticateUserUseCase);
    mockUserRepository = TestBed.inject(USER_REPOSITORY_TOKEN) as jasmine.SpyObj<IUserRepository>;

    mockUser = User.create({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      prenom: 'John',
      nom: 'Doe',
      role: UserRole.ETUDIANT,
      isActive: true
    });
  });

  describe('Successful Authentication', () => {
    it('should authenticate user with valid credentials', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: 'password123'
      };

      mockUserRepository.authenticate.and.returnValue(of(mockUser));

      useCase.execute(request).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.user).toBe(mockUser);
          expect(response.message).toBe('Authentication successful');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Failed Authentication', () => {
    it('should fail with invalid credentials', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      mockUserRepository.authenticate.and.returnValue(of(null));

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Invalid username or password');
          done();
        }
      });
    });

    it('should fail with inactive user', (done) => {
      const inactiveUser = User.create({
        ...mockUser.toJSON(),
        isActive: false
      });

      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: 'password123'
      };

      mockUserRepository.authenticate.and.returnValue(of(inactiveUser));

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Account is deactivated');
          done();
        }
      });
    });
  });

  describe('Input Validation', () => {
    it('should fail with empty username', (done) => {
      const request: AuthenticateUserRequest = {
        username: '',
        password: 'password123'
      };

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Username and password are required');
          done();
        }
      });
    });

    it('should fail with empty password', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: ''
      };

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Username and password are required');
          done();
        }
      });
    });

    it('should fail with short username', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'ab',
        password: 'password123'
      };

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Username must be at least 3 characters long');
          done();
        }
      });
    });

    it('should fail with short password', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: '12345'
      };

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Password must be at least 6 characters long');
          done();
        }
      });
    });
  });

  describe('Repository Errors', () => {
    it('should handle repository errors', (done) => {
      const request: AuthenticateUserRequest = {
        username: 'testuser',
        password: 'password123'
      };

      mockUserRepository.authenticate.and.returnValue(
        throwError(() => new Error('Database connection failed'))
      );

      useCase.execute(request).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Database connection failed');
          done();
        }
      });
    });
  });
});
