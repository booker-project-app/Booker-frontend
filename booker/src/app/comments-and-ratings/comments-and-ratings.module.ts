import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from './comment-card/comment-card.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import { OwnerCommentsCardComponent } from './owner-comments-card/owner-comments-card.component';
import { OwnerCommentsAndRatingsComponent } from './owner-comments-and-ratings/owner-comments-and-ratings.component';
import {ReservationsModule} from "../reservations/reservations.module";
import { RatingCardComponent } from './rating-card/rating-card.component';
import { OwnerRatingsCardComponent } from './owner-ratings-card/owner-ratings-card.component';



@NgModule({
  declarations: [
    CommentCardComponent,
    OwnerCommentsCardComponent,
    OwnerCommentsAndRatingsComponent,
    RatingCardComponent,
    OwnerRatingsCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReservationsModule
  ]
})
export class CommentsAndRatingsModule { }
