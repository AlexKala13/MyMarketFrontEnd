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
        console.log(response);
        if (response && response.data) {
          const token = response.data;
          localStorage.setItem('jwt_token', token);

          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem('user_id', payload.nameid);
          localStorage.setItem('username', payload.unique_name);
          localStorage.setItem('email', payload.email);

          console.log("success login");
          return true;
        }
        return false;
      }));
  }

  register(email: string, username: string, password: string, firstName: string, lastName: string, address: string, telephone: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/Register`, { email, username, password, firstName, lastName, address, telephone });
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
