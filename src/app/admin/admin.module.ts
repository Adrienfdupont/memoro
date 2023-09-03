import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AccountComponent } from './account/account.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';
import { CardPartialComponent } from './partials/card-partial/card-partial.component';

@NgModule({
  declarations: [
    AccountComponent,
    NavigationComponent,
    HomeComponent,
    CollectionComponent,
    CardPartialComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule],
})
export class AdminModule {}
