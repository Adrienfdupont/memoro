import { Component, OnInit } from '@angular/core';
import { Collection } from '../types/collection.type';
import { CollectionService } from '../services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  collections: Collection[] | undefined;
  newCollectionForm!: FormGroup;
  updateCollectionForm!: FormGroup;
  popupMessage: any;
  popupIsVisible = false;
  popupForm: FormGroup | undefined;
  popupCollection: Collection | undefined;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newCollectionForm = this.formBuilder.group({
      name: [null, Validators.required],
    });

    this.updateCollectionForm = this.formBuilder.group({
      newName: [null, Validators.required],
    });

    this.getCollections();
  }

  addCollection(): void {
    this.collectionService
      .addCollection(this.newCollectionForm.getRawValue())
      .subscribe({
        next: () => {
          this.getCollections();
          this.togglePopup(undefined);
        },
        error: (response: any) => {
          this.popupMessage = {
            isError: true,
            content: response.error.message,
          };
        },
      });
  }

  updateCollection(): void {
    if (this.popupCollection) {
      this.collectionService
        .updateCollection(
          this.popupCollection?.id,
          this.updateCollectionForm.getRawValue()
        )
        .subscribe({
          next: () => {
            this.getCollections();
            this.togglePopup(undefined);
          },
          error: (response: any) => {
            this.popupMessage = {
              isError: true,
              content: response.error.message,
            };
          },
        });
    }
  }

  getCollections(): void {
    this.collectionService.getCollections().subscribe({
      next: (response: any) => {
        this.collections = response;
      },
      error: () => {
        alert('An error has occurred.');
      },
    });
  }

  togglePopup(form: FormGroup | undefined): void {
    this.popupForm = form;
    this.popupMessage = {};
    this.newCollectionForm.get('name')?.setValue(null);
    this.popupIsVisible = !this.popupIsVisible;
  }

  setPopupCollection(collection: Collection): void {
    this.popupCollection = collection;
    this.updateCollectionForm
      .get('newName')
      ?.setValue(this.popupCollection.name);
  }
}
