import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UpdateAvailabilityComponent} from './update-availability.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule, By} from "@angular/platform-browser";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AccommodationService} from "../accommodation.service";
import {of, throwError} from "rxjs";
import {AccommodationViewDto} from "../accommodation/model/accommodation-view";
import {MaterialModule} from "../../infrastructure/material/material.module";
import {MatNativeDateModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AccommodationUpdatedAvailabilityDTO} from "./model/AccommodationUpdatedAvailabilityDTO";
import {PriceType} from "../../enums/price-type.enum";
import {Reservation} from "../../reservations/model/Reservation";
import {ReservationRequestStatus} from "../../enums/reservation-request-status.enum";
import {ReservationStatus} from "../../enums/reservation-status-enum";


describe('UpdateAvailabilityComponent', () => {
  let component: UpdateAvailabilityComponent;
  let fixture: ComponentFixture<UpdateAvailabilityComponent>;
  let el: HTMLElement;

  beforeEach(() => {

    const accommodation: AccommodationViewDto = {
      address: {
        street: '',
        city: '',
        latitude: 0,
        longitude: 0
      },
      amenities: [],
      availabilities: [],
      comments: {},
      deadline: 0,
      description: "",
      images: [],
      manual_accepting: false,
      max_capacity: 0,
      min_capacity: 0,
      owner_id: 0,
      prices: {},
      ratings: {},
      id: 1,
      title: "neki string"
    }

    const reservation: Reservation[] = [{
      guestId: 1,
      accommodationId: 1,
      id: 1,
      fromDate: '2024-02-12',
      toDate: '2024-02-14',
      numberOfGuests: 3,
      requestStatus: ReservationRequestStatus.ACCEPTED,
      status: ReservationStatus.ACCEPTED,
      deleted: false,
      price: 150.0
    }]


    const updatedAvailability: AccommodationUpdatedAvailabilityDTO = {
      id: 1,
      availabilities: [{
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-31")
      }],
      prices: [{
        id: 123,
        cost: 150.0,
        fromDate: '2024-12-15',
        toDate: '2024-12-31',
        type: PriceType.PER_GUEST
      }],
      deadline: 3
    };
    const AccommodationServiceSpy = jasmine.createSpyObj<AccommodationService>(['getAccommodation', 'updateAvailability']);
    AccommodationServiceSpy.getAccommodation.and.returnValue(of(accommodation));
    AccommodationServiceSpy.updateAvailability.and.returnValue(of(updatedAvailability));
    TestBed.configureTestingModule({
      declarations: [UpdateAvailabilityComponent],
      imports: [BrowserModule,
                FormsModule,
                ReactiveFormsModule, MaterialModule, MatNativeDateModule, MatRadioModule, BrowserAnimationsModule],
      providers: [SnackBarComponent, MatSnackBar, {provide: AccommodationService, useValue: AccommodationServiceSpy}]
    });
    fixture = TestBed.createComponent(UpdateAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create UpdateAvailability component', () => {
    expect(component).toBeTruthy();
  });

  it(`should set submitted on true`, () => {
    component.submitForm();
    expect(component.submitted).toBeTruthy();
  });

  it(`should call submitForm() method`, () => {
    spyOn(component, "submitForm");
    el = fixture.debugElement.query(By.css('#submitBtn')).nativeElement;
    el.click();
    expect(component.submitForm).toHaveBeenCalledTimes(0);
  });

  it(`form should be invalid`, () => {
    component.formGroupAvailability.controls['startDate'].setValue('');
    component.formGroupAvailability.controls['endDate'].setValue('');
    component.formGroupPrice.controls['priceStartDate'].setValue('');
    component.formGroupPrice.controls['priceEndDate'].setValue('');
    component.formGroupPrice.controls['price_type'].setValue(null);
    component.formGroupDeadline.controls['deadline'].setValue(-1);
    expect(component.formGroupAvailability.valid).toBeFalsy();
    expect(component.formGroupPrice.valid).toBeFalsy();
    expect(component.formGroupDeadline.valid).toBeFalsy();
  });

  it(`form should be valid`, () => {
    component.formGroupAvailability.controls['startDate'].setValue('2024-12-01');
    component.formGroupAvailability.controls['endDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-01');
    component.formGroupPrice.controls['priceEndDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_GUEST);
    component.formGroupDeadline.controls['deadline'].setValue(5);
    expect(component.formGroupAvailability.valid).toBeTruthy();
    expect(component.formGroupPrice.valid).toBeTruthy();
    expect(component.formGroupDeadline.valid).toBeTruthy();
  });

  it(`should disable submit button when some form group is not valid`, () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#submitBtn"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should enable button when all form groups are valid`, () => {
    component.formGroupAvailability.controls['startDate'].setValue('2024-12-01');
    component.formGroupAvailability.controls['endDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-01');
    component.formGroupPrice.controls['priceEndDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_GUEST);
    component.formGroupDeadline.controls['deadline'].setValue(5);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#submitBtn"));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it(`should reset form upon on resetBtn click`, () => {
    component.formGroupAvailability.controls['startDate'].setValue('2024-12-01');
    component.formGroupAvailability.controls['endDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-01');
    component.formGroupPrice.controls['priceEndDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(5);

    const resetButton = fixture.nativeElement.querySelector('button[type="reset"]');
    resetButton.click();

    expect(component.formGroupAvailability.value).toEqual({
      startDate: null,
      endDate: null
    });

    expect(component.formGroupPrice.value).toEqual({
      priceStartDate: null,
      priceEndDate: null,
      price_type: PriceType.PER_GUEST,
      amount: 100.0
    });

    expect(component.formGroupDeadline.value).toEqual({
      deadline: 0
    });
  });


  it(`should disable submit button when start date is in past`, () => {


    component.formGroupAvailability.controls['startDate'].setValue("2023-05-10");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-01");
    component.formGroupPrice.controls['priceStartDate'].setValue("2024-12-01");
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(5);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when end date is in past`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2023-05-10");
    component.formGroupPrice.controls['priceStartDate'].setValue("2024-12-01");
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(5);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when both dates are in past`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2023-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2023-12-10");
    component.formGroupPrice.controls['priceStartDate'].setValue("2024-12-01");
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(5);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when end date is before start date`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-31");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when price start date is in past`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2023-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when price end date is in past`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2023-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when both price dates are in past`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2023-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2023-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button when price end date is before price start date`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2023-12-31');
    component.formGroupPrice.controls['priceEndDate'].setValue("2023-12-15");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button, amount is negative`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2023-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2023-12-31");
    component.formGroupPrice.controls['amount'].setValue(-150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button, price type is null`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2023-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2023-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(null);
    component.formGroupDeadline.controls['deadline'].setValue(3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable submit button, deadline is negative`, () => {
    component.formGroupAvailability.controls['startDate'].setValue("2024-12-01");
    component.formGroupAvailability.controls['endDate'].setValue("2024-12-15");
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-15');
    component.formGroupPrice.controls['priceEndDate'].setValue("2024-12-31");
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_ACCOMMODATION);
    component.formGroupDeadline.controls['deadline'].setValue(-3);

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css("#submitBtn"));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should update availability and show success message`, () => {
    spyOn(component.snackBar, 'openSnackBar');

    component.formGroupAvailability.controls['startDate'].setValue('2024-12-01');
    component.formGroupAvailability.controls['endDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['priceStartDate'].setValue('2024-12-01');
    component.formGroupPrice.controls['priceEndDate'].setValue('2024-12-31');
    component.formGroupPrice.controls['amount'].setValue(150.0);
    component.formGroupPrice.controls['price_type'].setValue(PriceType.PER_GUEST);
    component.formGroupDeadline.controls['deadline'].setValue(5);

    fixture.detectChanges();

    component.submitForm();
    expect(component.submitted).toBeTruthy();

    fixture.detectChanges();


    expect(component.formGroupAvailability.value).toEqual({
      startDate: null,
      endDate: null
    });

    expect(component.formGroupPrice.value).toEqual({
      priceStartDate: null,
      priceEndDate: null,
      price_type: PriceType.PER_GUEST,
      amount: 100.0
    });

    expect(component.formGroupDeadline.value).toEqual({
      deadline: 0
    });

    expect(component.snackBar.openSnackBar).toHaveBeenCalledWith("Success!", "Close");
  });
});




