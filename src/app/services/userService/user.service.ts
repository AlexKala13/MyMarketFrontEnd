import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    private url = 'User';

    constructor(private http: HttpClient, private router: Router) { }

    getUser(id: number) {
        return this.http.get<any>(`${environment.apiUrl}/${this.url}/${id}`);
      }  
}