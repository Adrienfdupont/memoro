import { Component } from '@angular/core';
import { User } from '../types/user.types';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  user: User | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUser(userId).subscribe((user) => {
        this.user = user;
      });
    }
  }
}
