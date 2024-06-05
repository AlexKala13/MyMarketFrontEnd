import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product, ApiResponse } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: number[] = [1, 2, 3];
  filter: any = { name: '', category: '', date: '', minPrice: null, maxPrice: null };
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

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
      params = params.set('categoryId', this.filter.category);
    }
    if (this.filter.date) {
      params = params.set('postDate', this.filter.date);
    }
    if (this.filter.minPrice !== null) {
      params = params.set('priceMin', this.filter.minPrice);
    }
    if (this.filter.maxPrice !== null) {
      params = params.set('priceMax', this.filter.maxPrice);
    }

    this.http.get<any>('https://localhost:7039/api/Advertisement/GetAll', { params })
    .subscribe(response => {
      if (response && response.data && Array.isArray(response.data.$values)) {
        this.products = response.data.$values;
      } else {
        this.products = [];
      }
      this.loading = false;
    }, error => {
      console.error('Error loading products', error);
      this.products = [];
      this.loading = false;
    });
  }

  applyFilters() {
    this.loadProducts();
  }

  viewProductDetails(id: number) {
    this.router.navigate(['/product', id]);
  }
}
