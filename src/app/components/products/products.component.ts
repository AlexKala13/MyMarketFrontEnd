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
  filter: any = { name: '', category: '', date: '', minPrice: null, maxPrice: null, sortBy: '' };
  loading: boolean = false;
  layout: number = 4; // Default layout

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
          this.sortProducts();
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

  clearFilters() {
    this.filter = { name: '', category: '', date: '', minPrice: null, maxPrice: null, sortBy: '' };
    this.loadProducts();
  }

  setLayout(layout: number) {
    this.layout = layout;
  }

  viewProductDetails(id: number) {
    window.open(`/product/${id}`, '_blank');
  }

  sortProducts() {
    if (this.filter.sortBy === 'date') {
      this.products.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
    } else if (this.filter.sortBy === 'price') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (this.filter.sortBy === 'name') {
      this.products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}
