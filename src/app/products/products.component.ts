import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Electronics', 'Books', 'Clothing'];
  filter: any = { name: '', category: '', date: '', minPrice: null, maxPrice: null };
  loading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    let params = new HttpParams();
    if (this.filter.name) {
      params = params.set('name', this.filter.name);
    }
    if (this.filter.category) {
      params = params.set('category', this.filter.category);
    }
    if (this.filter.date) {
      params = params.set('date', this.filter.date);
    }
    if (this.filter.minPrice !== null) {
      params = params.set('minPrice', this.filter.minPrice);
    }
    if (this.filter.maxPrice !== null) {
      params = params.set('maxPrice', this.filter.maxPrice);
    }

    this.http.get<any>('http://your-backend-api-url/products', { params })
      .subscribe(response => {
        this.products = response.data;
        this.loading = false;
      }, error => {
        console.error('Error loading products', error);
        this.loading = false;
      });
  }

  applyFilters() {
    this.loadProducts();
  }
}
