import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { CartService } from '../../services/cartService/cart.service';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  categories = environment.categories;
  profileMenu: any;
  isVerticalMenuOpen = false;
  cartItemCount: number = 0;
  searchTerm: string = '';

  constructor(public authService: AuthService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartItemsCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  logout() {
    this.authService.logout();
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, true);
  }

  toggleVerticalMenu() {
    this.isVerticalMenuOpen = !this.isVerticalMenuOpen;
  }

  closeVerticalMenu(): void {
    this.isVerticalMenuOpen = false;
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
    this.closeVerticalMenu();
  }

  searchProducts() {
    this.router.navigate(['/products'], { queryParams: { name: this.searchTerm } });
  }
}
