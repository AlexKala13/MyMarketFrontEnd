import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

export class ProductService {
    private url = 'Advertisement';

    constructor(private http: HttpClient, private router: Router) { }

    addProduct(product: any): Observable<any> {
        const userId = product.userId;
        return this.http.post<any>(`${environment.apiUrl}/${this.url}/Upload?userId=${userId}`, product);
      }  
}