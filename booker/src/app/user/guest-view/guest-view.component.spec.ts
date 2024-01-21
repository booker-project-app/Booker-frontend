import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';

import { GuestViewComponent } from './guest-view.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {UpdateUserDTO} from "../dto/UpdateUserDTO";
import {UserService} from "../user.service";
import {BehaviorSubject, of} from "rxjs";
import {Guest} from "./model/guest.model";
import {UserType} from "../../enums/user-type.enum";
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {By} from "@angular/platform-browser";

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

describe('GuestViewComponent', () => {
  let component: GuestViewComponent;
  let fixture: ComponentFixture<GuestViewComponent>;
  let userService: any;
  let activatedRoute: any;
  let location: any;

  beforeEach(async () => {
    let userServiceMock = {
      getGuestById: jasmine.createSpy('getGuestById').and.returnValue(of({
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
        } )),
      updateGuest: jasmine.createSpy('updateGuest').and.returnValue(of({}))
    };

    let locationMock = {
      back: jasmine.createSpy('back')
    };

    let activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRouteStub.testParams = { id: 1 };

    await TestBed.configureTestingModule({
      declarations: [GuestViewComponent],
      imports: [HttpClientModule, MatIconModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Location, useValue: locationMock} ]
    }).compileComponents();
    fixture = TestBed.createComponent(GuestViewComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from the server in edit mode', fakeAsync( () => {
    component.ngOnInit();
    expect(userService.getGuestById).toHaveBeenCalledWith(1);
    tick();
    expect(component.guest.id).toBe(1);
    expect(component.guest.name).toBe("Imenko");
    expect(component.guest.surname).toBe("Prezimic");
    expect(component.guest.address).toBe("Adresa 123");
    expect(component.guest.email).toBe("email1@gmail.com");
    expect(component.guest.phone).toBe("+381601234567");
    expect(component.guest.password).toBe("12345678");
    expect(component.guest.reported).toBe(false);
    expect(component.guest.blocked).toBe(false);
    expect(component.guest.deleted).toBe(false);
    expect(component.guest.notificationEnabled).toBe(false);
    expect(component.guest.role).toBe(UserType.GUEST);
    expect(component.guest.favouriteAccommodations).toEqual([]);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let nameSurnameInput = fixture.debugElement.query(By.css('#name-surname')).nativeElement;
    expect(nameSurnameInput.value).toEqual('Imenko');
    let emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
    expect(emailInput.value).toEqual('email1@gmail.com');
    let addressInput = fixture.debugElement.query(By.css('#address')).nativeElement;
    expect(addressInput.value).toEqual('Adresa 123');
    let phoneInput = fixture.debugElement.query(By.css('#phone')).nativeElement;
    expect(phoneInput.value).toEqual('+381601234567');
    let password1Input = fixture.debugElement.query(By.css('#password1')).nativeElement;
    expect(password1Input.value).toEqual('');
    let password2Input = fixture.debugElement.query(By.css('#password2')).nativeElement;
    expect(password2Input.value).toEqual('');

  }));


});
