import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCardComponent } from './owner-card.component';

describe('OwnerCardComponent', () => {
  let component: OwnerCardComponent;
  let fixture: ComponentFixture<OwnerCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerCardComponent]
    });
    fixture = TestBed.createComponent(OwnerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
