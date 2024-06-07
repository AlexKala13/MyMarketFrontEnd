import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  telephone: string = '';
  password: string = '';
  
  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    try {
      await this.authService.register(this.email, this.userName, this.password, this.firstName, this.lastName, this.address, this.telephone);
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert('Registration failed');
      console.error('Registration error:', error);
    }
  }
}
