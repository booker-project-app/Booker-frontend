import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeReservationRequestComponent } from './make-reservation-request.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";

describe('MakeReservationRequestComponent', () => {
  let component: MakeReservationRequestComponent;
  let fixture: ComponentFixture<MakeReservationRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeReservationRequestComponent],
      imports: [HttpClientModule,
                RouterTestingModule]
    });
    fixture = TestBed.createComponent(MakeReservationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
