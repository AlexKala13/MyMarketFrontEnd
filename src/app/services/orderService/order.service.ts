import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) { }

  getAllOrders(userId: number, ordersType: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAll?userId=${userId}&ordersType=${ordersType}`);
  }

  confirmOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/ConfirmBySeller?orderId=${orderId}`, {});
  }

  async confirmOrderWithPayment(orderId: number, debitCardId: number | null): Promise<Observable<any>> {
    const params = new HttpParams()
      .set('orderId', orderId.toString())
      .set('debitCardId', debitCardId !== null ? debitCardId.toString() : '');
  
    return this.http.put<any>(`${this.apiUrl}/Confirm`, {}, { params });
  }
  
}
