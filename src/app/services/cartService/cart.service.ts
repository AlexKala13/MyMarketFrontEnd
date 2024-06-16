import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKeyPrefix = 'shopping_cart_';

  constructor() { }

  private getUserCartKey(userId: number): string {
    return this.cartKeyPrefix + userId;
  }

  addToCart(product: any, userId: number): void {
    let cartItems = this.getCartItems(userId);
    cartItems.push(product);
    this.saveCartItems(cartItems, userId);
  }

  getCartItems(userId: number): any[] {
    const cartKey = this.getUserCartKey(userId);
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCartItems(items: any[], userId: number): void {
    const cartKey = this.getUserCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(items));
  }

  removeFromCart(productId: number, userId: number): void {
    let cartItems = this.getCartItems(userId);
    cartItems = cartItems.filter(item => item.id !== productId);
    this.saveCartItems(cartItems, userId);
  }

  clearCart(userId: number): void {
    const cartKey = this.getUserCartKey(userId);
    localStorage.removeItem(cartKey);
  }
}