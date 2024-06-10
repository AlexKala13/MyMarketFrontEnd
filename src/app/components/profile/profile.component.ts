import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private userService: UserService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      try {
        this.user = await (await this.userService.getUserInfo(userId)).toPromise();
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    } else {
      console.error('User ID not found in local storage');
    }
  }
}
