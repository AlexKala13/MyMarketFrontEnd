import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import { Product, ApiResponse } from '../../models/product.model';
import { AuthService } from '../../services/authService/auth.service';
import { CartService } from '../../services/cartService/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  layout: number = 1; // Default layout
  userCartItems: any[] = []; // Array to store cart items for quick lookup

  constructor(private productService: ProductService, private router: Router, private authService: AuthService, private cartService: CartService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUserCartItems(); // Load user's cart items on component initialization
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

  getDisplayPrice(price: number): string {
    return price === 0 ? 'Negotiable' : price.toFixed(2);
  }

  toggleCart(product: any): void {
    if (product) {
      const { id, name, price, photos, categoryName, userName, userId, categoryId } = product;
      const productForCart = { id, name, price, photos, categoryName, userName, userId, categoryId };
      const authorizedUser =  this.authService.getUserId();
      if (authorizedUser !== null) {
        if (this.isProductInCart(id)) {
          this.removeFromCart(id);
          this.showNotification('Product removed from cart!');
        } else {
          this.cartService.addToCart(productForCart, authorizedUser);
          this.showNotification('Product added to cart!');
        }
      } else {
        this.showNotification('You should authorize to use a cart.');
      }
    }
  }

  isCurrentUserAuthor(id: number): boolean {
    const userId = this.authService.getUserId();
    return userId === id;
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  loadUserCartItems(): void {
    const authorizedUser = this.authService.getUserId();
    if (authorizedUser !== null) {
      this.userCartItems = this.cartService.getCartItems(authorizedUser);
    }
  }

  isProductInCart(productId: number): boolean {
    return this.userCartItems.some(item => item.id === productId);
  }

  removeFromCart(productId: number): void {
    const authorizedUser = this.authService.getUserId();
    if (authorizedUser !== null) {
      this.cartService.removeFromCart(productId, authorizedUser);
    }
  }
}
