import { Component, HostListener, OnInit } from '@angular/core';
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
  errorMessage = '';
  popupIsVisible = false;
  popupCollection: Collection | undefined;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
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
          this.errorMessage = response.error.message
            ? response.error.message
            : 'An error has occurred.';
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
        error: (response: any) => {
          alert(response ? response.error.message : 'An error has occurred.');
        },
      });
    }
  }

  togglePopup(): void {
    this.errorMessage = '';
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
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.popupIsVisible) {
      this.togglePopup();
    }
  }
}
