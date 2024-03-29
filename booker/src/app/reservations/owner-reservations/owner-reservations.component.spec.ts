import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerReservationsComponent } from './owner-reservations.component';

describe('OwnerReservationsComponent', () => {
  let component: OwnerReservationsComponent;
  let fixture: ComponentFixture<OwnerReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerReservationsComponent]
    });
    fixture = TestBed.createComponent(OwnerReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
