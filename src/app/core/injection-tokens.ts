import { InjectionToken } from '@angular/core';
import { IUserRepository } from '../domain/interfaces/user-repository.interface';
import { ICourseRepository } from '../domain/interfaces/course-repository.interface';
import { ILocalStorageService } from '../domain/interfaces/storage.interface';

export const USER_REPOSITORY_TOKEN = new InjectionToken<IUserRepository>('UserRepository');
export const COURSE_REPOSITORY_TOKEN = new InjectionToken<ICourseRepository>('CourseRepository');
export const LOCAL_STORAGE_TOKEN = new InjectionToken<ILocalStorageService>('LocalStorageService');
