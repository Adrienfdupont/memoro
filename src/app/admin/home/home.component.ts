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
  popupMessage: any;
  popupIsVisible = false;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newCollectionForm = this.formBuilder.group({
      name: [null, Validators.required],
    });

    this.getCollections();
  }

  addCollection(): void {
    this.collectionService
      .addCollection(this.newCollectionForm.getRawValue())
      .subscribe({
        next: () => {
          this.getCollections();
          this.togglePopup();
        },
        error: (response: any) => {
          this.popupMessage = {
            isError: true,
            content: response.error.message,
          };
        },
      });
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

  togglePopup(): void {
    this.popupIsVisible = !this.popupIsVisible;
    this.newCollectionForm.get('name')?.setValue(null);
    this.popupMessage = {};
  }
}
