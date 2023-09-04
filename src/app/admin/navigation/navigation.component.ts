import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  menuIsOpen: boolean;

  constructor(private authService: AuthService) {
    this.menuIsOpen = false;
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
