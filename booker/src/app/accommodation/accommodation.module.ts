import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationListingComponent } from './accommodation-listing/accommodation-listing.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import { AccommodationComponent } from './accommodation/accommodation.component';
import {AccommodationCardComponent} from "./accommodation-card/accommodation-card.component";
import {MatCardModule} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { OwnerAccommodationListingComponent } from './owner-accommodation-listing/owner-accommodation-listing.component';
import { OwnerAccommodationCardComponent } from './owner-accommodation-card/owner-accommodation-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UpdateAccommodationComponent } from './update-accommodation/update-accommodation.component';
import {MapModule} from "../map/map.module";
import { ApproveAccommodationComponent } from './approve-accommodation/approve-accommodation.component';
import { ApproveAccommodationCardComponent } from './approve-accommodation-card/approve-accommodation-card.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { FavouriteCardComponent } from './favourite-card/favourite-card.component';
import { FavouriteAccommodationsComponent } from './favourite-accommodations/favourite-accommodations.component';
import { MakeReservationRequestComponent } from './make-reservation-request/make-reservation-request.component';



@NgModule({
  declarations: [
    AccommodationListingComponent,
    AccommodationCardComponent,
    AccommodationCardComponent,
    OwnerAccommodationListingComponent,
    OwnerAccommodationCardComponent,
    UpdateAccommodationComponent,
    ApproveAccommodationComponent,
    ApproveAccommodationCardComponent,
    FavouriteCardComponent,
    FavouriteAccommodationsComponent,
    MakeReservationRequestComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    RouterLink,
    MatInputModule,
    MatDatepickerModule,
    AccommodationComponent,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
    MatSlideToggleModule
  ],
  exports: [
    AccommodationComponent
  ]
})
export class AccommodationModule { }
