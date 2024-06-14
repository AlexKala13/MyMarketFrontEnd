import { Component, OnInit } from '@angular/core';
import { DebitCardService } from '../../services/debitCardService/debitCard.service';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.css']
})
export class CreditCardsComponent implements OnInit {
  cards: any[] = []; // Assuming cards data structure
  userId: number | null = null;
  user: any = null;
  isTransferModalOpen: boolean = false;
  isWithdrawModalOpen: boolean = false;
  transferAmount: number = 0;
  withdrawAmount: number = 0;
  transferAmountInvalid: boolean = false;
  withdrawAmountInvalid: boolean = false;
  selectedCardId: number | null = null; // To store selected card ID

  constructor(private debitCardService: DebitCardService, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.loadUser();
      this.loadCards();
    } else {
      console.error('User ID not found in local storage');
    }
  }

  async loadUser(): Promise<void> {
    if (this.userId !== null) {
      try {
        this.user = await (await this.userService.getUserInfo(this.userId)).toPromise();
        this.user.data.id = this.userId;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  }

  async loadCards(): Promise<void> {
    (await this.debitCardService.getAllDebitCards(this.userId!)).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.$values)) {
          this.cards = response.data.$values;
        } else {
          this.cards = [];
        }
      },
      error => {
        console.error('Error loading products', error);
        this.cards = [];
      }
    );
  }

  openTransferModal(card: any): void {
    if (!this.isWithdrawModalOpen) {
      this.selectedCardId = card.id;
      this.isTransferModalOpen = true;
      this.transferAmount = 0;
      this.transferAmountInvalid = false;
    }
  }

  closeTransferModal(): void {
    this.isTransferModalOpen = false;
    this.transferAmount = 0;
    this.transferAmountInvalid = false;
    this.selectedCardId = null;
  }

  async transferToCard(): Promise<void> {
    if (this.transferAmount <= 0) {
      this.transferAmountInvalid = true;
      return;
    }

    if (this.selectedCardId !== null) {
      (await this.debitCardService.transferToCard(this.selectedCardId, this.userId!, this.transferAmount)).subscribe(
        (response) => {
          console.log('Transfer successful:', response);
          this.closeTransferModal(); // Close modal after successful transfer
          this.loadUser();
          this.loadCards();
        },
        (error) => {
          console.error('Error transferring to card:', error);
        }
      );
    }
  }

  openWithdrawModal(card: any): void {
    if (!this.isTransferModalOpen) {
      this.selectedCardId = card.id;
      this.isWithdrawModalOpen = true;
      this.withdrawAmount = 0;
      this.withdrawAmountInvalid = false;
    }
  }

  closeWithdrawModal(): void {
    this.isWithdrawModalOpen = false;
    this.withdrawAmount = 0;
    this.withdrawAmountInvalid = false;
    this.selectedCardId = null;
  }

  async withdrawFromCard(): Promise<void> {
    if (this.withdrawAmount <= 0) {
      this.withdrawAmountInvalid = true;
      return;
    }

    if (this.selectedCardId !== null) {
      (await this.debitCardService.withdrawFromCard(this.selectedCardId, this.userId!, this.withdrawAmount)).subscribe(
        (response) => {
          console.log('Withdrawal successful:', response);
          this.closeWithdrawModal(); // Close modal after successful withdrawal
          this.loadUser();
          this.loadCards();
        },
        (error) => {
          console.error('Error withdrawing from card:', error);
        }
      );
    }
  }

  async deleteCard(cardId: number): Promise<void> {
    if (this.userId !== null) {
      (await this.debitCardService.deleteCard(cardId, this.userId)).subscribe(
        (response) => {
          console.log('Card deleted successfully:', response);
          this.loadUser();
          this.loadCards(); // Refresh cards data after deletion
        },
        (error) => {
          console.error('Error deleting card:', error);
        }
      );
    }
  }
}
