import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) { }

  async getAllOrders(userId: number): Promise<Observable<any>> {
    return await this.http.get<any>(`${this.apiUrl}/GetAll?userId=${userId}`);
  }
}