import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7039/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/Auth/Login`, { email, password })
      .pipe(map(response => {
        if (response && response.token) {
          const token = response.token;
          localStorage.setItem('jwt_token', token);

          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem('user_id', payload.userId);
          localStorage.setItem('username', payload.username);
          localStorage.setItem('email', payload.email);

          return true;
        }
        return false;
      }));
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/Register`, { username, password });
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('jwt_token') !== null;
  }

  getToken() {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      const helper = new JwtHelperService();
      return !helper.isTokenExpired(token);
    }
    return false;
  }

  getUserInfo() {
    return {
      userId: localStorage.getItem('user_id'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email')
    };
  }

  addProduct(product: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/products`, product, { headers });
  }
}
