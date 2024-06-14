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

  constructor(private cartService: CartService) { }

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
}
