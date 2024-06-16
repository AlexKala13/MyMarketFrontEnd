import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  profileMenu: any;

  constructor(public authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, true);
  }
}
