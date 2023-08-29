import { Component } from '@angular/core';
import { Collection } from '../types/collection.type';
import { CollectionService } from '../services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  collections: Collection[] | undefined;
  newCardForm: FormGroup;
  message: string;
  modalIsVisible: boolean;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder
  ) {
    this.newCardForm = this.formBuilder.group({
      name: [null, Validators.required],
    });
    this.modalIsVisible = false;
    this.message = '';
    this.getCollections();
  }

  submit(): void {
    this.collectionService
      .addCollection(this.newCardForm.getRawValue())
      .subscribe({
        next: () => {
          this.getCollections();
          this.toggleModal();
        },
        error: (response) => {
          this.message = response.error.message;
        },
      });
  }

  getCollections(): void {
    this.collectionService.getCollections().subscribe({
      next: (response) => {
        this.collections = response;
      },
      error: () => {
        alert('An error has occurred.');
      },
    });
  }

  toggleModal(): void {
    this.modalIsVisible = !this.modalIsVisible;
  }
}
