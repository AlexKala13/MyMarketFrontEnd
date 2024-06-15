import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) { }

  submitOrder(orders: any[]): Observable<any> {
    console.log(orders);
    return this.http.post<any>(`${this.apiUrl}/Add`, orders);
  }
}
