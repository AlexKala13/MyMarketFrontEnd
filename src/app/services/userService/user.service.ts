import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'User';

  constructor(private http: HttpClient) { }

  getUserInfo(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.url}/${id}`);
  }
}
