import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  menuIsOpen: boolean;

  constructor() {
    this.menuIsOpen = false;
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
  }
}
