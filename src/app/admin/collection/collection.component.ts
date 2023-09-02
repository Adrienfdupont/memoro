import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../types/collection.type';
import { CollectionService } from '../services/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
})
export class CollectionComponent implements OnInit {
  collection: Collection | undefined;
  popupMessage: any;
  popupIsVisible = false;
  updateCollectionForm!: FormGroup;
  popupIsForm = false;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCollection();

    this.updateCollectionForm = this.formBuilder.group({
      newName: [null, Validators.required],
    });
  }

  getCollection(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollection(parseInt(collectionId)).subscribe({
        next: (response: Collection) => {
          this.collection = response;
        },
        error: (response: any) => {
          alert(response.error.message);
        },
      });
    }
  }

  updateCollection(): void {
    if (this.collection) {
      this.collectionService
        .updateCollection(
          this.collection?.id,
          this.updateCollectionForm.getRawValue()
        )
        .subscribe({
          next: () => {
            this.getCollection();
            this.togglePopup(false);
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

  deleteCollection(): void {
    if (this.collection) {
      this.collectionService.deleteCollection(this.collection.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (response) => {
          this.popupMessage = {
            isError: true,
            content: response.error.message,
          };
        },
      });
    }
  }

  togglePopup(popupIsForm: boolean): void {
    this.popupIsForm = popupIsForm;
    this.updateCollectionForm.get('newName')?.setValue(this.collection?.name);
    this.popupMessage = {};
    this.popupIsVisible = !this.popupIsVisible;
  }
}
