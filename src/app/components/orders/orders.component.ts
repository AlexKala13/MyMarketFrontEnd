import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orderService/order.service';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  userId: number | null = null;
  productIdFilter: string = '';
  sellerFilter: string = '';
  categoryFilter: string = '';
  sortField: string = 'orderDate'; // Default sort field
  sortDirection: number = -1; // Default sort direction (descending)

  constructor(private orderService: OrderService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.loadOrders();
    }
  }

  async loadOrders(): Promise<void> {
    (await this.orderService.getAllOrders(this.userId!)).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.$values)) {
          this.orders = response.data.$values;
          this.applyFiltersAndSort(); // Apply initial filters and sorting
        } else {
          this.orders = [];
          this.filteredOrders = [];
        }
      },
      error => {
        console.error('Error loading orders', error);
        this.orders = [];
        this.filteredOrders = [];
      }
    );
  }

  applyFiltersAndSort(): void {
    this.filteredOrders = this.orders
      .filter(order =>
        order.id.toString().includes(this.productIdFilter.toLowerCase()) &&
        order.sellerName.toLowerCase().includes(this.sellerFilter.toLowerCase()) &&
        order.categoryName.toLowerCase().includes(this.categoryFilter.toLowerCase())
      )
      .sort((a, b) => this.compare(a, b));
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
    this.applyFiltersAndSort();
  }
}