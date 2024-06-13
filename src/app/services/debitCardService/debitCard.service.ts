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

  async transferToCard(cardId: number, userId: number, amount: number) {
    let params = new HttpParams();
    if (cardId) {
      params = params.set('debitCard', cardId);
    }
    if (userId) {
      params = params.set('userId', userId);
    }
    if (amount) {
      params = params.set('amount', amount);
    }
    return await this.http.post<any>(`${this.apiUrl}/AddToCard`, { params });
  }

  withdrawFromCard(cardId: number, amount: number) {
    return this.http.post<any>(`${this.apiUrl}/WithdrawFromCard`, { cardId, amount });
  }

  deleteCard(cardId: number) {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${cardId}`);
  }
}
