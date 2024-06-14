import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebitCardService {
  private apiUrl = `${environment.apiUrl}/DebitCard`;

  constructor(private http: HttpClient) { }

  async getAllDebitCards(userId: number): Promise<Observable<any>> {
    return await this.http.get<any>(`${this.apiUrl}/GetAll?userId=${userId}`);
  }

  async transferToCard(cardId: number, userId: number, amount: number): Promise<Observable<any>> {
    const params = new HttpParams()
      .set('debitCard', cardId.toString())
      .set('userId', userId.toString())
      .set('amount', amount.toString());
    return await this.http.post<any>(`${this.apiUrl}/AddToCard`, {}, { params });
  }

  async withdrawFromCard(cardId: number, userId: number, amount: number): Promise<Observable<any>> {
    const params = new HttpParams()
      .set('debitCard', cardId.toString())
      .set('userId', userId.toString())
      .set('amount', amount.toString());
    return await this.http.post<any>(`${this.apiUrl}/AddToBalance`, {}, { params });
  }

  async deleteCard(cardId: number, userId: number): Promise<Observable<any>> {
    return await this.http.delete<any>(`${this.apiUrl}/Delete/${cardId}?userId=${userId}`);
  }
}
