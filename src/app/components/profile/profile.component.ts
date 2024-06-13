import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isEditModalOpen: boolean = false;
  editUser: any = {};
  errors: any = {};
  showPasswordFields: boolean = false;
  oldPasswordError: string = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      try {
        this.user = await (await this.userService.getUserInfo(userId)).toPromise();
        this.user.data.id = userId;
        this.editUser = { ...this.user.data };
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    } else {
      console.error('User ID not found in local storage');
    }
  }

  viewCreditCards(): void {
    this.router.navigate(['/credit-cards']);
  }

  openEditModal(): void {
    this.isEditModalOpen = true;
    this.clearErrors();
    this.editUser.oldPassword = '';
    this.editUser.newPassword = '';
    this.showPasswordFields = false;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  togglePasswordChange(): void {
    this.showPasswordFields = !this.showPasswordFields;
    this.clearPasswordErrors();
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearPasswordErrors(): void {
    this.errors.oldPassword = '';
    this.errors.newPassword = '';
  }

  validateFields(): boolean {
    this.clearErrors();
    let valid = true;

    if (!this.editUser.email) {
      this.errors.email = 'Email is required.';
      valid = false;
    }
    if (!this.editUser.userName) {
      this.errors.userName = 'Username is required.';
      valid = false;
    }
    if (!this.editUser.firstName) {
      this.errors.firstName = 'First name is required.';
      valid = false;
    }
    if (!this.editUser.lastName) {
      this.errors.lastName = 'Last name is required.';
      valid = false;
    }
    if (!this.editUser.address) {
      this.errors.lastName = 'Address is required.';
      valid = false;
    }
    if (!this.editUser.telephone) {
      this.errors.lastName = 'Telephone is required.';
      valid = false;
    }
    if (this.showPasswordFields) {
      if (!this.editUser.oldPassword) {
        this.errors.oldPassword = 'Old password is required.';
        valid = false;
      }
      if (!this.editUser.newPassword) {
        this.errors.newPassword = 'New password is required.';
        valid = false;
      }
    }
    return valid;
  }

  async saveProfile(): Promise<void> {
    if (!this.validateFields()) {
      return;
    }

    const userId = this.authService.getUserId();
    if (userId !== null) {
      try {
        const response = await this.userService.editUserInfo(userId, this.editUser);
        if (response.success) {
          this.user = { data: this.editUser };
          this.closeEditModal();
        } else {
          if (response.message === 'Your password is incorrect.') {
            this.oldPasswordError = 'Password is incorrect.';
          }
        }
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          if (error.error && error.error.message === 'Your password is incorrect.') {
            this.oldPasswordError = 'Password is incorrect.';
          } else {
            console.error('Error saving user info:', error);
          }
        } else {
          console.error('Error saving user info:', error);
        }
      }
    } else {
      console.error('User ID not found in local storage');
    }
  }

  async deactivateProfile(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      try {
        const userInfo = {
          email: this.editUser.email,
          userName: this.editUser.userName,
          firstName: this.editUser.firstName,
          lastName: this.editUser.lastName,
          address: this.editUser.address,
          telephone: this.editUser.telephone,
          isActive: false
        };
        const response = await this.userService.editUserInfo(userId, userInfo);
        if (response.success) {
          this.authService.logout();
        } else {
          console.error('Error deactivating user:', response.message);
        }
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    } else {
      console.error('User ID not found in local storage');
    }
  }
}
