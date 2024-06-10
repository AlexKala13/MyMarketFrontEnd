import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/authService/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router, private jwtHelper: JwtHelperService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      // Check if the token is expired
      if (this.jwtHelper.isTokenExpired(token)) {
        this.auth.logout();
        this.router.navigate(['']);
        return throwError('Token is expired');
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.logout();
          this.router.navigate(['']);
        }
        return throwError(error);
      })
    );
  }
}