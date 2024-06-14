import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shopping_cart';

  constructor() { }

  addToCart(product: any): void {
    let cartItems = this.getCartItems();
    cartItems.push(product);
    this.saveCartItems(cartItems);
  }

  getCartItems(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCartItems(items: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  removeFromCart(productId: number): void {
    let cartItems = this.getCartItems();
    cartItems = cartItems.filter(item => item.id !== productId);
    this.saveCartItems(cartItems);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }
}
