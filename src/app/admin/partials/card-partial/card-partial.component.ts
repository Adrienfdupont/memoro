import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../types/card.type';

@Component({
  selector: 'app-card',
  templateUrl: './card-partial.component.html',
})
export class CardPartialComponent {
  isReturned = false;
  @Input() card!: Card;
  @Output() emitCard = new EventEmitter<Card>();

  returnCard(): void {
    this.isReturned = !this.isReturned;
  }

  editCard(card: Card): void {
    this.isReturned = true;
    this.emitCard.emit(card);
  }
}
