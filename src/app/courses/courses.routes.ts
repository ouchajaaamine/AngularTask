import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

export const coursesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/course-list/course-list.component')
          .then(m => m.CourseListComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'add',
        loadComponent: () => import('./components/add-course/add-course.component')
          .then(m => m.AddCourseComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'formateur' }
      },
      {
        path: ':id',
        loadComponent: () => import('./components/course-detail/course-detail.component')
          .then(m => m.CourseDetailComponent),
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/add-course/add-course.component')
          .then(m => m.AddCourseComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'formateur' }
      }
    ]
  }
]; 