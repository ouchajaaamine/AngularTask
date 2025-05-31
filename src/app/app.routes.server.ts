import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'courses',
    renderMode: RenderMode.Server
  },
  {
    path: 'courses/add',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
