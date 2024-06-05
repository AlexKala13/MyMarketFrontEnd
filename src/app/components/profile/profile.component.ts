import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
  }
}
