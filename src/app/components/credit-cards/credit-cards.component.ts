import { Component, OnInit } from '@angular/core';
import { DebitCardService } from '../../services/debitCardService/debitCard.service';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.css']
})
export class CreditCardsComponent implements OnInit {
  cards: any[] = []; // Assuming cards data structure
  userId: number | null = null;
  isTransferModalOpen: boolean = false;
  isWithdrawModalOpen: boolean = false;
  transferAmount: number = 0;
  withdrawAmount: number = 0;
  transferAmountInvalid: boolean = false;
  withdrawAmountInvalid: boolean = false;
  selectedCardId: number | null = null; // To store selected card ID

  constructor(private debitCardService: DebitCardService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.loadCards();
    } else {
      console.error('User ID not found in local storage');
    }
    this.loadCards();
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
    this.selectedCardId = card.id;
    this.isTransferModalOpen = true;
    this.transferAmount = 0;
    this.transferAmountInvalid = false;
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
      console.log(this.userId);
      (await this.debitCardService.transferToCard(this.selectedCardId, this.userId!, this.transferAmount)).subscribe(
        (response) => {
          console.log('Transfer successful:', response);
          this.closeTransferModal();
          this.loadCards();
        },
        (error) => {
          console.error('Error transferring to card:', error);
        }
      );
    }
  }

  openWithdrawModal(card: any): void {
    this.selectedCardId = card.id;
    this.isWithdrawModalOpen = true;
    this.withdrawAmount = 0;
    this.withdrawAmountInvalid = false;
  }

  closeWithdrawModal(): void {
    this.isWithdrawModalOpen = false;
    this.withdrawAmount = 0;
    this.withdrawAmountInvalid = false;
    this.selectedCardId = null;
  }

  withdrawFromCard(): void {
    if (this.withdrawAmount <= 0) {
      this.withdrawAmountInvalid = true;
      return;
    }

    if (this.selectedCardId !== null) {
      this.debitCardService.withdrawFromCard(this.selectedCardId, this.withdrawAmount).subscribe(
        (response) => {
          // Handle success
          console.log('Withdrawal successful:', response);
          this.closeWithdrawModal();
          this.loadCards(); // Refresh cards data after withdrawal
        },
        (error) => {
          console.error('Error withdrawing from card:', error);
          // Handle error
        }
      );
    }
  }

  deleteCard(cardId: number): void {
    this.debitCardService.deleteCard(cardId).subscribe(
      (response) => {
        // Handle success
        console.log('Card deleted successfully:', response);
        this.loadCards(); // Refresh cards data after deletion
      },
      (error) => {
        console.error('Error deleting card:', error);
        // Handle error
      }
    );
  }
}
