import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../infrastructure/storage/local-storage.service';
import { JWTService } from '../../infrastructure/security/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor(
    private storageService: LocalStorageService,
    private jwtService: JWTService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token to requests (if we had a real backend)
    const token = this.storageService.getSecureItem<string>(this.AUTH_TOKEN_KEY);
    
    if (token && !this.jwtService.isTokenExpired(token)) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    // Add security headers
    req = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.storageService.removeItem(this.AUTH_TOKEN_KEY);
          this.storageService.removeItem('current_user');
          this.router.navigate(['/auth/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
