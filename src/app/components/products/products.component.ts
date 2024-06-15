import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
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

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;

    (await this.productService.getProducts(this.filter)).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.$values)) {
          this.products = response.data.$values;
        } else {
          this.products = [];
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading products', error);
        this.products = [];
        this.loading = false;
      }
    );
  }

  applyFilters() {
    this.loadProducts();
  }

  viewProductDetails(id: number) {
    window.open(`/product/${id}`, '_blank');
  }
}
