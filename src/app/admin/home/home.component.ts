import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Collection } from '../types/collection.type';
import { CollectionService } from '../services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  collections: Collection[] | undefined;
  newCollectionForm!: FormGroup;
  popupIsVisible = false;
  popupCollection: Collection | undefined;
  @ViewChild('formInput') formInput!: ElementRef;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.newCollectionForm = this.formBuilder.group({
      name: [null, Validators.required],
    });

    this.getCollections();
  }

  addCollection(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      const data = {
        userId: userId,
        name: this.newCollectionForm.get('name')?.value,
      };

      this.collectionService.addCollection(data).subscribe({
        next: () => {
          this.getCollections();
          this.togglePopup();
        },
        error: (response: any) => {
          switch (response.status) {
            case 409:
              alert('Collection name already exists.');
              break;
            default:
              alert('An error has occurred.');
          }
        },
      });
    }
  }

  getCollections(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.collectionService.getCollections(userId).subscribe({
        next: (response: Collection[]) => {
          this.collections = response;
        },
        error: () => {
          alert('An error has occurred.');
        },
      });
    }
  }

  togglePopup(): void {
    this.newCollectionForm.get('name')?.setValue(null);
    this.popupIsVisible = !this.popupIsVisible;
  }

  openCollection(collection: Collection): void {
    const now = new Date().toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (collection.lastOpen === now) {
      this.router.navigateByUrl(`/collection/${collection.id}`);
    } else {
      this.collectionService
        .updateCollection({
          id: collection.id,
          newName: collection.name,
          newLastOpen: now,
        })
        .subscribe({
          next: () => {
            this.router.navigateByUrl(`/collection/${collection.id}`);
          },
        });
    }
  }

  @HostListener('document:keydown.escape')
  handleKeyboardEvent() {
    if (this.popupIsVisible) {
      this.togglePopup();
    }
  }
}
