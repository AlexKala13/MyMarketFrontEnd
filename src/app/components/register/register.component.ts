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

  onSubmit() {
    this.authService.register(this.email, this.userName, this.firstName, this.lastName, this.address, this.telephone, this.password).subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      alert('Registration failed');
    });
  }
}
