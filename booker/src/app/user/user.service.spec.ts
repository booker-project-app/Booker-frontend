import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {UpdateUserDTO} from "./dto/UpdateUserDTO";
import {Guest} from "./guest-view/model/guest.model";
import {UserType} from "../enums/user-type.enum";

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=> {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateGuest() should query url and update guest data', fakeAsync(() => {
    let guest: UpdateUserDTO = {
      _id: 0,
      name: "Imenko",
      surname: "Prezimic",
      email: "email1@gmail.com",
      address: "Adresa 123",
      phone: "+381601234567",
      password: "12345678",
      profilePicture: undefined
    }
    let mockGuest: UpdateUserDTO = {
      _id: 1,
      name: "Imenko",
      surname: "Prezimic",
      email: "email1@gmail.com",
      address: "Adresa 123",
      phone: "+381601234567",
      password: "12345678",
      profilePicture: undefined
    }

    service.updateGuest(1, guest).subscribe(res => guest = res.body);
    const req = httpController.expectOne('http://localhost:8080/api/guests/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockGuest);

    tick();
    expect(guest).toBeDefined();
    expect(guest._id).toBe(1);
    expect(guest.name).toBe("Imenko");
    expect(guest.surname).toBe("Prezimic");
    expect(guest.email).toBe("email1@gmail.com");
    expect(guest.address).toBe("Adresa 123");
    expect(guest.phone).toBe("+381601234567");
    expect(guest.password).toBe("12345678");


  }));

  it('getGuestById() should query url and get guest data', fakeAsync(() => {
    let guest: Guest = {
      id: 0,
      name: "Imenko",
      surname: "Prezimic",
      email: "email1@gmail.com",
      address: "Adresa 123",
      phone: "+381601234567",
      password: "12345678",
      profilePicture: undefined,
      reported: false,
      blocked: false,
      deleted: false,
      favouriteAccommodations: [],
      notificationEnabled: false,
      role: UserType.GUEST
    }
    let mockGuest: Guest = {
      id: 1,
      name: "Imenko",
      surname: "Prezimic",
      email: "email1@gmail.com",
      address: "Adresa 123",
      phone: "+381601234567",
      password: "12345678",
      profilePicture: undefined,
      reported: false,
      blocked: false,
      deleted: false,
      favouriteAccommodations: [],
      notificationEnabled: false,
      role: UserType.GUEST
    }

    service.getGuestById(1).subscribe(res => guest = res);
    const req = httpController.expectOne('http://localhost:8080/api/guests/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGuest);

    tick();
    expect(guest).toBeDefined();
    expect(guest.id).toBe(1);
    expect(guest.name).toBe("Imenko");
    expect(guest.surname).toBe("Prezimic");
    expect(guest.email).toBe("email1@gmail.com");
    expect(guest.address).toBe("Adresa 123");
    expect(guest.phone).toBe("+381601234567");
    expect(guest.password).toBe("12345678");
    expect(guest.reported).toBe(false);
    expect(guest.blocked).toBe(false);
    expect(guest.deleted).toBe(false);
    expect(guest.favouriteAccommodations).toEqual([]);
    expect(guest.notificationEnabled).toBe(false);
    expect(guest.role).toBe(UserType.GUEST);


  }));

});
