import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { MakeReservationRequestComponent } from './make-reservation-request.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {AccommodationService} from "../accommodation.service";
import {BehaviorSubject, of} from "rxjs";
import {AccommodationViewDto} from "../accommodation/model/accommodation-view";
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // Test parameters
  // @ts-ignore
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams };
  }
}

describe('MakeReservationRequestComponent', () => {
  let component: MakeReservationRequestComponent;
  let fixture: ComponentFixture<MakeReservationRequestComponent>;
  let accService : any;
  let activatedRoute: any;
  let location: any;

  beforeEach(() => {
    let accServiceMock = {
      getAccommodation: jasmine.createSpy('getAccommodation')
        .and.returnValue(of({
            address: {
              street: 'ulica',
              city: 'grad',
              latitude: 0,
              longitude: 0
            },
            amenities: [],
            availabilities: [],
            comments: {},
            deadline: 5,
            description: "opis",
            images: [],
            manual_accepting: false,
            max_capacity: 10,
            min_capacity: 1,
            owner_id: 1,
            prices: {},
            ratings: {},
            id: 1,
            title: "neki string"
          }
        ))
    }

    let locationMock = {
      back: jasmine.createSpy('back')
    };

    let activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRouteStub.testParams = { id: 1 };

    TestBed.overrideComponent(
      MakeReservationRequestComponent,
      {
        set: {
          providers: [{provide: AccommodationService, useValue: accServiceMock }]
        }
      }
    );


    // const AccommodationServiceSpy = jasmine.createSpyObj<AccommodationService>(['getAccommodation']);
    // AccommodationServiceSpy.getAccommodation.and.returnValue(of(accommodation));

    TestBed.configureTestingModule({
      declarations: [MakeReservationRequestComponent],
      imports: [HttpClientModule,
                RouterTestingModule],
      providers:    [
        {provide: AccommodationService, useValue: accServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Location, useValue: locationMock} ]
    }).compileComponents();
    fixture = TestBed.createComponent(MakeReservationRequestComponent);
    component = fixture.componentInstance;
    accService = TestBed.inject(AccommodationService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should fetch accommodation from service`, fakeAsync(() => {
    component.ngOnInit();
    expect(accService.getAccommodation).toHaveBeenCalledWith(1);
    tick();

    fixture.detectChanges(); // tell angular that data are fetched
    tick(); // initiate next cycle of binding these data to HTML components
    fixture.detectChanges(); // detect changes in the HTML components

    // should fetch student from service
    expect(component.accommodation.id).toBe(1);
    expect(component.accommodation.owner_id).toBe(1);
    expect(component.accommodation.min_capacity).toBe(1);
    expect(component.accommodation.description).toEqual('opis');
    expect(component.accommodation.title).toEqual('neki string');
    expect(component.accommodation.max_capacity).toBe(10);
    expect(component.accommodation.min_capacity).toBe(1);
    expect(component.accommodation.deadline).toBe(5);
    expect(component.accommodation.manual_accepting).toEqual(false);
    expect(component.accommodation.availabilities).toEqual([]);
    expect(component.accommodation.amenities).toEqual([]);
    expect(component.accommodation.prices).toEqual({});
    expect(component.accommodation.comments).toEqual({});
    expect(component.accommodation.ratings).toEqual({});
    expect(component.accommodation.images).toEqual([]);
    expect(component.accommodation.address.street).toEqual('ulica');
    expect(component.accommodation.address.city).toEqual('grad');
  }));

  it(`form should be valid`, () => {
    component.startDate = new Date('2024-03-22');
    component.endDate = new Date('2024-03-25');
    component.form.controls["people"].setValue('2');
    expect(component.form.valid).toBeTruthy();
  });
});
