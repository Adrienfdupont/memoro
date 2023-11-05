import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../types/collection.type';
import { CollectionService } from '../services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from '../types/card.type';
import { CardService } from '../services/card.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
})
export class CollectionComponent implements OnInit {
  collection: Collection | undefined;
  popupMessage: any;
  popupIsVisible = false;
  updateCollectionForm!: FormGroup;
  popupForm: FormGroup | undefined;
  cards: Card[] | undefined;
  newCardForm!: FormGroup;
  updateCardForm!: FormGroup;
  cardToEdit: Card | undefined;
  @ViewChildren('formInput') formInputs!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private cardService: CardService,
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.getCollection();

    this.updateCollectionForm = this.formBuilder.group({
      newName: [null, Validators.required],
    });

    this.newCardForm = this.formBuilder.group({
      label: [null, Validators.required],
      translation: [null, Validators.required],
    });

    this.updateCardForm = this.formBuilder.group({
      newLabel: [null, Validators.required],
      newTranslation: [null, Validators.required],
    });
  }

  getCollection(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollection(parseInt(collectionId)).subscribe({
        next: (response: Collection) => {
          this.collection = response;
          this.getCards();
          this.titleService.setTitle(this.collection.name);
        },
        error: (response: any) => {
          let errorMessage: string;
          switch (response.status) {
            case 404:
              errorMessage = 'Card not found.';
              break;
            default:
              errorMessage = 'An error has occurred.';
          };
          alert(errorMessage);
        },
      });
    }
  }

  getCards(): void {
    if (this.collection) {
      this.cardService.getCards(this.collection.id).subscribe({
        next: (response: Card[]) => {
          this.cards = response;
        },
        error: () => {
          alert('An error has occurred.');
        },
      });
    }
  }

  updateCollection(): void {
    if (this.collection) {
      if (
        this.updateCollectionForm.get('newName')?.value === this.collection.name
      ) {
        this.togglePopup();
        return;
      }

      const data = {
        id: this.collection.id,
        newName: this.updateCollectionForm.get('newName')?.value,
        newLastOpen: new Date().toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      };

      this.collectionService.updateCollection(data).subscribe({
        next: () => {
          this.getCollection();
          this.togglePopup();
        },
        error: (response: any) => {
          let errorMessage: string;
          switch (response.status) {
            case 409:
              errorMessage = 'You already own this collection.';
              break;
            default:
              errorMessage = 'An error has occurred.';
          };
          this.popupMessage = { isError: true, content: errorMessage };
        },
      });
    }
  }

  deleteCollection(): void {
    if (this.collection) {
      this.collectionService.deleteCollection(this.collection.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.popupMessage = {
            isError: true,
            content: 'An error has occurred.',
          };
        },
      });
    }
  }

  addCard(): void {
    if (this.collection) {
      const data = {
        label: this.newCardForm.get('label')?.value,
        translation: this.newCardForm.get('translation')?.value,
        collectionId: this.collection.id,
      };

      this.cardService.addCard(data).subscribe({
        next: () => {
          this.getCards();
          this.togglePopup();
        },
        error: (response: any) => {
          this.popupMessage = {
            isError: true,
            content: response.error.message
              ? response.error.message
              : 'An error has occurred.',
          };
        },
      });
    }
  }

  updateCard(): void {
    if (this.collection) {
      if (
        this.updateCardForm.get('newLabel')?.value === this.cardToEdit?.label &&
        this.updateCardForm.get('newTranslation')?.value ===
          this.cardToEdit?.translation
      ) {
        this.togglePopup();
        return;
      }

      const data = {
        id: this.cardToEdit?.id,
        newLabel: this.updateCardForm.get('newLabel')?.value,
        newTranslation: this.updateCardForm.get('newTranslation')?.value,
        collectionId: this.collection.id,
      };

      this.cardService.updateCard(data).subscribe({
        next: () => {
          this.getCards();
          this.togglePopup();
        },
        error: (response: any) => {
          this.popupMessage = {
            isError: true,
            content: response.error.message
              ? response.error.message
              : 'An error has occurred.',
          };
        },
      });
    }
  }

  deleteCard(): void {
    this.cardService.deleteCard(this.cardToEdit?.id).subscribe({
      next: () => {
        this.getCards();
        this.togglePopup();
      },
      error: (response: any) => {
        this.popupMessage = {
          isError: true,
          content: response.error.message
            ? response.error.message
            : 'An error has occurred.',
        };
      },
    });
  }

  togglePopup(form?: FormGroup): void {
    this.popupForm = form ? form : undefined;
    this.updateCollectionForm.get('newName')?.setValue(this.collection?.name);
    this.newCardForm.get('label')?.setValue(null);
    this.newCardForm.get('translation')?.setValue(null);
    this.popupMessage = {};
    this.popupIsVisible = !this.popupIsVisible;
    setTimeout(() => {
      this.formInputs.forEach((input) => {
        input.nativeElement.focus();
      });
    }, 0);
  }

  setPopupCard(card: Card): void {
    this.cardToEdit = card;
    this.updateCardForm.get('newLabel')?.setValue(card.label);
    this.updateCardForm.get('newTranslation')?.setValue(card.translation);
    this.togglePopup(this.updateCardForm);
  }

  @HostListener('document:keydown.escape')
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.popupIsVisible) {
      this.togglePopup();
    }
  }
}
