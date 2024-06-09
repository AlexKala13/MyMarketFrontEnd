import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userService.getUserInfo(userId).subscribe(
        data => {
          this.user = data;
          console.log(this.user);
        },
        error => {
          console.error('Error fetching user info:', error);
        }
      );
    } else {
      console.error('User ID not found in local storage');
    }
  }
}
