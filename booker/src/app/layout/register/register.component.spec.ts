import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {CreateUserDTO} from "../../user/dto/CreateUserDTO";
import {UserType} from "../../enums/user-type.enum";
import {UserService} from "../../user/user.service";
import {of} from "rxjs";
import {BrowserModule, By} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../infrastructure/material/material.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    const createUser: CreateUserDTO = {
      name: "John",
      surname: "Doe",
      email: "john@example.com",
      password: "12345678",
      address: "123 Main Street",
      phone: "12345678",
      role: UserType.GUEST,
    };
    const UserServiceSpy = jasmine.createSpyObj<UserService>(['signup']);
    UserServiceSpy.signup.and.returnValue(of(createUser));
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [BrowserModule,
               FormsModule, ReactiveFormsModule, MaterialModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [HttpClientTestingModule, SnackBarComponent]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Register component', () => {
    expect(component).toBeTruthy();
  });

  it(`should set submitted on true`, () => {
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
  });

  it(`should call the onSubmit method`,() => {
    spyOn(component, 'onSubmit');
    el = fixture.debugElement.query(By.css('#btnRegister')).nativeElement;
    el.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', () => {
    component.form.controls['name'].setValue('');
    component.form.controls['surname'].setValue('');
    component.form.controls['address'].setValue('');
    component.form.controls['phone'].setValue('');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    component.form.controls['confirm_password'].setValue('');
    component.form.controls['role'].setValue(null);

    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    expect(component.form.valid).toBeTruthy();
  });

  it(`should disable submit button when some form group is not valid`, () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should enable register button when all form groups are valid`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it(`should reset form upon reset button click`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    const resetButton = fixture.nativeElement.querySelector('button[type="reset"]');
    resetButton.click();

    expect(component.form.controls['name'].value).toEqual(null);
    expect(component.form.controls['surname'].value).toEqual(null);
    expect(component.form.controls['address'].value).toEqual(null);
    expect(component.form.controls['phone'].value).toEqual(null);
    expect(component.form.controls['email'].value).toEqual(null);
    expect(component.form.controls['password'].value).toEqual(null);
    expect(component.form.controls['confirm_password'].value).toEqual(null);
    expect(component.form.controls['role'].value).toEqual(null);
  });

  it(`should validate passwords don't match`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('87654321');
    component.form.controls['role'].setValue(UserType.GUEST);

    component.onSubmit();

    expect(component.form.hasError('passwordMismatch')).toBeTruthy();
  });

  it(`should disable register button, name is empty`, () => {
    component.form.controls['name'].setValue('');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, surname is empty`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, address is empty`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, phone is empty`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, phone has less than 10 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('123');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, phone has more than 10 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('12345678901');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, email is empty`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, email does not contain '@' character`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, password has less than 8 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('123');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, password has more than 8 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('123456789');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, confirm_password has more than 8 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('123456780');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, confirm_password has less than 8 characters`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('123');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it(`should disable register button, user type is null`, () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('123');
    component.form.controls['role'].setValue(null);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#btnRegister"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should register user', () => {
    component.form.controls['name'].setValue('Marko');
    component.form.controls['surname'].setValue('Nikolic');
    component.form.controls['address'].setValue('markova adresa');
    component.form.controls['phone'].setValue('1234567890');
    component.form.controls['email'].setValue('marko@example.com');
    component.form.controls['password'].setValue('12345678');
    component.form.controls['confirm_password'].setValue('12345678');
    component.form.controls['role'].setValue(UserType.GUEST);

    fixture.detectChanges();

    component.onSubmit();

    fixture.detectChanges();
    expect(component.submitted).toBeTruthy();
  });
});
