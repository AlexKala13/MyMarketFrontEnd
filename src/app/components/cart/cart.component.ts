import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cartService/cart.service';
import { AuthService } from '../../services/authService/auth.service';
import { PaymentService } from '../../services/paymentService/payment.service';
import { Router } from '@angular/router';

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

  isOrderModalOpen: boolean = false;
  isConfirmationModalOpen: boolean = false;

  constructor(private cartService: CartService, private authService: AuthService, private paymentService: PaymentService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
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

  openOrderModal(): void {
    this.isOrderModalOpen = true;
  }

  closeOrderModal(): void {
    this.isOrderModalOpen = false;
  }

  confirmOrder(): void {
    this.isOrderModalOpen = false;
    this.isConfirmationModalOpen = true;
    this.placeOrder();
  }

  closeConfirmationModal(): void {
    this.isConfirmationModalOpen = false;
  }

  async placeOrder(): Promise<void> {
    const buyerId = this.authService.getUserId();
    const orders = this.cartItems.map(item => ({
      buyerId,
      sellerId: item.userId,
      advertisementId: item.id,
      categoryId: item.categoryId,
      price: item.price
    }));

    await this.paymentService.submitOrder(orders).subscribe(
      response => {
        this.clearCart();
        alert('Order placed successfully!');
        this.router.navigate(['/products']);
      },
      error => {
        console.error('Error placing order', error);
        alert('Failed to place the order.');
      }
    );
    this.closeConfirmationModal();
  }
}
