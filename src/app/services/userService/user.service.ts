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

  async getUserInfo(id: number): Promise<Observable<any>> {
    return await this.http.get<any>(`${environment.apiUrl}/${this.url}/${id}`);
  }
}
