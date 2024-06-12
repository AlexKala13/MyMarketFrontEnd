import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'Auth';
  
  constructor(private http: HttpClient, private router: Router) { }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/${this.url}/Login`, { email, password }).toPromise();
      if (response && response.data) {
        const token = response.data;
        localStorage.setItem('jwt_token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user_id', payload.nameid);
        localStorage.setItem('username', payload.unique_name);
        localStorage.setItem('email', payload.email);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/${this.url}/ForgotPassword`, { email }).toPromise();
      return response;
    } catch (error) {
      console.error('Error during forgot password:', error);
      throw error;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<any> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/${this.url}/ResetPassword`, { email, token, newPassword }).toPromise();
      return response;
    } catch (error) {
      console.error('Error during reset password:', error);
      throw error;
    }
  }

  async register(email: string, username: string, password: string, firstName: string, lastName: string, address: string, telephone: string): Promise<any> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/${this.url}/Register`, { email, username, password, firstName, lastName, address, telephone }).toPromise();
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.router.navigate(['']);
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

  checkTokenExpiry() {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }

  getUserId() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return parseInt(userId, 10);
    } else {
      return null;
    }
  }
}
