import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { Product, ApiResponse } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
  })
export class ProductService {
  private url = 'Advertisement';

  constructor(private http: HttpClient, private router: Router) { }

  addProduct(product: any): Observable<any> {
    const userId = product.userId;
    return this.http.post<any>(`${environment.apiUrl}/${this.url}/Upload?userId=${userId}`, product);
  }  

  getProductDetails(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.url}/${id}`);
  }

  getProducts(filter: any): Observable<any> {
    let params = new HttpParams();
    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.category) {
      params = params.set('categoryId', filter.category);
    }
    if (filter.date) {
      params = params.set('postDate', filter.date);
    }
    if (filter.minPrice !== null) {
      params = params.set('priceMin', filter.minPrice);
    }
    if (filter.maxPrice !== null) {
      params = params.set('priceMax', filter.maxPrice);
    }

    return this.http.get<any>(`${environment.apiUrl}/${this.url}/GetAll`, { params });
  }
}