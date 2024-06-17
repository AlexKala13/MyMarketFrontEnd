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

    // Check if the product is already in the cart
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (!existingProduct) {
      // Product is not in the cart, add it
      cartItems.push(product);
      this.saveCartItems(cartItems, userId);
    } else {
      // Product is already in the cart, you may want to handle this case (optional)
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
