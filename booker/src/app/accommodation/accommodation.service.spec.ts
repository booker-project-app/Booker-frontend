import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AccommodationService } from './accommodation.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ReservationRequest} from "./accommodation/model/ReservationRequest";

describe('AccommodationService', () => {
  let service: AccommodationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AccommodationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=> {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makeReservationRequest() should query url and save a reservation request', fakeAsync(()=> {
    let request: ReservationRequest = {
      id: 0,
      accommodationId: 1,
      guestId: 1,
      fromDate: "2024-03-01",
      toDate: "2024-03-10",
      numberOfGuests: 1,
      status: 0,
      deleted: false,
      price: 120.0
    };

    let mockRequest: ReservationRequest = {
      id: 1,
      accommodationId: 1,
      guestId: 1,
      fromDate: "2024-03-01",
      toDate: "2024-03-10",
      numberOfGuests: 1,
      status: 0,
      deleted: false,
      price: 120.0
    };

    service.makeReservationRequest(request).subscribe(res => request = res);
    const req = httpController.expectOne('http://localhost:8080/api/requests');
    expect(req.request.method).toBe('POST');
    req.flush(mockRequest);

    tick();
    expect(request).toBeDefined();
    expect(request.id).toEqual(1);
    expect(request.accommodationId).toEqual(1);
    expect(request.guestId).toEqual(1);
    expect(request.fromDate).toEqual('2024-03-01');
    expect(request.toDate).toEqual('2024-03-10');
    expect(request.numberOfGuests).toEqual(1);
    expect(request.status).toEqual(0);
    expect(request.deleted).toEqual(false);
    expect(request.price).toEqual(120.0);

  }));
});
