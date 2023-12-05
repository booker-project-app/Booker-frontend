import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LayoutModule} from "./layout/layout.module";
import { RegisterComponent } from './layout/register/register.component';
import {MaterialModule} from "./infrastructure/material/material.module";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {AccommodationModule} from "./accommodation/accommodation.module";
import {UserModule} from "./user/user.module";
import {HttpClientModule} from "@angular/common/http";
import { CreateAccommodationComponent } from './accommodation/create-accommodation/create-accommodation.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import {MapModule} from "./map/map.module";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    CreateAccommodationComponent,
    PhotoUploadComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        BrowserAnimationsModule,
        MaterialModule,
        MatRadioModule,
        MatSelectModule,
        AccommodationModule,
        UserModule,
        HttpClientModule,
        MapModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
