import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../types/card.type';

@Component({
  selector: 'app-card',
  templateUrl: './card-partial.component.html',
})
export class CardPartialComponent {
  @Input() isFlipped!: boolean;
  @Input() card!: Card;
  @Output() emitCard = new EventEmitter<Card>();

  returnCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  editCard(card: Card): void {
    this.isFlipped = true;
    this.emitCard.emit(card);
  }
}
