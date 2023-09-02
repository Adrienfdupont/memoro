import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../types/card.type';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() card!: Card;
  isReturned = false;

  toggle(): void {
    this.isReturned = !this.isReturned;
  }
}
