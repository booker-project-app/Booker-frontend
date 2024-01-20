import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestViewComponent } from './guest-view.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

describe('GuestViewComponent', () => {
  let component: GuestViewComponent;
  let fixture: ComponentFixture<GuestViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestViewComponent],
      imports: [HttpClientModule, MatIconModule, FormsModule]
    });
    fixture = TestBed.createComponent(GuestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
