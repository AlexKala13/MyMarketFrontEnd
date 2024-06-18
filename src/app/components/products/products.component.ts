import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing and Accessories" },
    { id: 3, name: "Home and Garden" },
    { id: 4, name: 'Beauty and Health' },
    { id: 5, name: 'Sports and Leisure' },
    { id: 6, name: 'Auto and Moto' }
  ];
  filter: any = { name: '', category: '', date: '', minPrice: null, maxPrice: null, sortBy: '' };
  loading: boolean = false;
  layout: number = 1; // Default layout
  userCartItems: any[] = []; // Array to store cart items for quick lookup
  defaultImage=  '/assets/images/default-photo.jpg';

  constructor(private productService: ProductService, private router: Router, private authService: AuthService, private cartService: CartService, private snackBar: MatSnackBar,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filter.category = params['category'];
      }
      if (params['name']) {
        this.filter.name = params['name'];
      }
      this.loadProducts();
    });
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
    this.products.sort((a, b) => {
      if (a.status === 2 && b.status !== 2) {
        return -1;
      } else if (a.status !== 2 && b.status === 2) {
        return 1;
      } else {
        if (this.filter.sortBy === 'date') {
          return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
        } else if (this.filter.sortBy === 'price') {
          return a.price - b.price;
        } else if (this.filter.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return 0;
        }
      }
    });
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

  toggleCategoryFilter(categoryId: number | string): void {
    if (categoryId === 'all') {
      this.filter.category = '';
    } else {
      this.filter.category = categoryId.toString();
    }
  }
}
