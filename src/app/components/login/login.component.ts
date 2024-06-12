import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  forgotEmail: string = '';
  resetCode: string = '';
  newPassword: string = '';
  isForgotPasswordModalOpen: boolean = false;
  isResetPasswordMode: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  }

  openForgotPasswordModal() {
    this.isForgotPasswordModalOpen = true;
  }

  closeForgotPasswordModal() {
    this.isForgotPasswordModalOpen = false;
    this.isResetPasswordMode = false;
  }

  async onForgotPasswordSubmit() {
    try {
      const response = await this.authService.forgotPassword(this.forgotEmail);
      if (response.success) {
        alert('Password reset code sent to your email');
        this.isResetPasswordMode = true;
      } else {
        alert('Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('An error occurred while sending reset code');
    }
  }

  async onResetPasswordSubmit() {
    try {
      const response = await this.authService.resetPassword(this.forgotEmail, this.resetCode, this.newPassword);
      if (response.success) {
        alert('Password has been reset successfully');
        this.closeForgotPasswordModal();
        this.router.navigate(['/login']);
      } else {
        alert('Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      alert('An error occurred while resetting the password');
    }
  }
}
