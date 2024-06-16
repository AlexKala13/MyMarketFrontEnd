import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orderService/order.service';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { DebitCardService } from '../../services/debitCardService/debitCard.service';

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
  isViewingMyOrders: boolean = false;
  isPaymentModalOpen: boolean = false;
  selectedOrderId: number | null = null;
  selectedPaymentMethod: string = 'personalAccount';
  debitCards: any[] = [];
  selectedDebitCardId: number | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private debitCardService: DebitCardService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.loadOrders(0);
    }
  }

  async loadOrders(sellerFlag: number): Promise<void> {
    (await this.orderService.getAllOrders(this.userId!, sellerFlag)).subscribe(
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

  toggleOrderView(): void {
    this.isViewingMyOrders = !this.isViewingMyOrders;
    const sellerFlag = this.isViewingMyOrders ? 1 : 0;
    this.loadOrders(sellerFlag);
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

  async confirmOrder(orderId: number): Promise<void> {
    try {
      await this.orderService.confirmOrder(orderId).subscribe(
        response => {
          alert('Order confirmed successfully!');
          // Reload orders to update the list
          this.loadOrders(1);
        },
        error => {
          console.error('Error confirming order', error);
          alert('Failed to confirm the order.');
        }
      );
    } catch (error) {
      console.error('Error confirming order', error);
      alert('Failed to confirm the order.');
    }
  }

  async openPaymentModal(orderId: number): Promise<void> {
    this.selectedOrderId = orderId;
    this.isPaymentModalOpen = true;

    if (this.selectedPaymentMethod === 'debitCard') {
      const userId = this.authService.getUserId();
      if (userId !== null) {
        (await this.debitCardService.getAllDebitCards(this.userId!)).subscribe(
          response => {
            if (response && response.data && Array.isArray(response.data.$values)) {
              this.debitCards = response.data.$values;
            } else {
              this.debitCards = [];
            }
          },
          error => {
            console.error('Error loading debit cards', error);
            this.debitCards = [];
          }
        );
      }
    }
  }

  closePaymentModal(): void {
    this.isPaymentModalOpen = false;
    this.selectedOrderId = null;
    this.selectedPaymentMethod = 'personalAccount';
    this.debitCards = [];
    this.selectedDebitCardId = null;
  }

  onPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'debitCard') {
      const userId = this.authService.getUserId();
      if (userId !== null) {
        this.debitCardService.getAllDebitCards(userId).then(observable => {
          observable.subscribe(
            response => {
              if (response && Array.isArray(response.data.$values)) {
                this.debitCards = response.data.$values;
              } else {
                this.debitCards = [];
              }
            },
            error => {
              console.error('Error loading debit cards', error);
              this.debitCards = [];
            }
          );
        });
      }
    } else {
      this.debitCards = [];
    }
  }

  async confirmOrderWithPayment() {
    try {
      if (this.selectedOrderId !== null) {
        await (await this.orderService.confirmOrderWithPayment(this.selectedOrderId, this.selectedDebitCardId)).subscribe(
          response => {
            alert('Order confirmed successfully!');
            // Reload orders to update the list
            this.loadOrders(0);
            this.closePaymentModal();
          },
          error => {
            console.error('Error confirming order', error);
            alert('Failed to confirm the order.');
          }
        );
      } else {
        console.error('selectedOrderId is null');
        alert('Selected order is invalid.');
      }
    } catch (error) {
      console.error('Error confirming order', error);
      alert('Failed to confirm the order.');
    }
  }  
}
