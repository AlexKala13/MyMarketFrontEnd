import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKeyPrefix = 'shopping_cart_';
  private cartItemsCount = new BehaviorSubject<number>(0);

  cartItemsCount$ = this.cartItemsCount.asObservable();

  constructor(private authService: AuthService) { 
    // Initialize cart count if user is logged in
    const userId = this.getLoggedInUserId();
    if (userId) {
      this.updateCartCount(userId);
    }
  }

  private getUserCartKey(userId: number): string {
    return this.cartKeyPrefix + userId;
  }

  private getLoggedInUserId(): number | null {
    const userId = this.authService.getUserId();
    return userId; // Example user ID
  }

  addToCart(product: any, userId: number): void {
    let cartItems = this.getCartItems(userId);

    // Check if the product is already in the cart
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (!existingProduct) {
      // Product is not in the cart, add it
      cartItems.push(product);
      this.saveCartItems(cartItems, userId);
      this.updateCartCount(userId);
    } else {
      console.log('Product is already in the cart');
    }
  }

  getCartItems(userId: number): any[] {
    const cartKey = this.getUserCartKey(userId);
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCartItems(items: any[], userId: number): void {
    const cartKey = this.getUserCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(items));
    this.updateCartCount(userId);
  }

  removeFromCart(productId: number, userId: number): void {
    let cartItems = this.getCartItems(userId);
    cartItems = cartItems.filter(item => item.id !== productId);
    this.saveCartItems(cartItems, userId);
    this.updateCartCount(userId);
  }

  clearCart(userId: number): void {
    const cartKey = this.getUserCartKey(userId);
    localStorage.removeItem(cartKey);
    this.updateCartCount(userId);
  }

  updateCartCount(userId: number): void {
    const cartItems = this.getCartItems(userId);
    this.cartItemsCount.next(cartItems.length);
  }
}
