import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cartService/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  productIdFilter: string = '';
  sellerFilter: string = '';
  categoryFilter: string = '';
  sortField: string = 'name';
  sortDirection: number = 1;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    console.log(this.cartItems);
    this.calculateTotalPrice();
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotalPrice();
  }

  private calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  applyFilters(): void {
    this.cartItems = this.cartService.getCartItems()
      .sort((a, b) => this.compare(a, b));
    this.calculateTotalPrice();
  }

  private compare(a: any, b: any): number {
    const aValue = a[this.sortField];
    const bValue = b[this.sortField];
    if (aValue < bValue) {
      return -1 * this.sortDirection;
    } else if (aValue > bValue) {
      return 1 * this.sortDirection;
    } else {
      return 0;
    }
  }

  toggleSortDirection(): void {
    this.sortDirection = -this.sortDirection;
    this.applyFilters();
  }
}
