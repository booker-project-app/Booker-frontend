import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import {RouterLink} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";



@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent
  ],
  exports: [
    NavBarComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule
  ]
})
export class LayoutModule { }
