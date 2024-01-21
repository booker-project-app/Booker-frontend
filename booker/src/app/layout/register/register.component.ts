import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserType} from "../../enums/user-type.enum";
import {UserService} from "../../user/user.service";
import {catchError, map, of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {CreateUserDTO} from "../../user/dto/CreateUserDTO";

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  submitted: boolean = false;
  notification!: DisplayMessage;
  returnUrl!: string;
  userTypes = Object.keys(UserType);
  userTypesToDisplay = [UserType.GUEST, UserType.OWNER];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm_password: new FormControl('', Validators.required),
    role: new FormControl(UserType.GUEST, [Validators.required])
    //profilePicture: new FormControl(null, Validators.required)
  }, {validators: this.passwordMatchValidator});

  constructor(private userService: UserService,
              private router: Router,
              public snackBar: SnackBarComponent,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = "/";
    // this.form = new FormGroup({
    //   name: new FormControl('', [Validators.required]),
    //   surname: new FormControl('', [Validators.required]),
    //   address: new FormControl('', [Validators.required]),
    //   phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    //   confirm_password: new FormControl('',  [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    //   role: new FormControl(UserType.GUEST, [Validators.required])

    // })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // register() {
  //   if (this.form.valid) {
  //     console.log("Register successful")
  //   } else {
  //     console.log("Invalid form")
  //   }
  // }

  onSubmit() {
    /**
     * Innocent until proven guilty
     */

    this.notification;
    this.submitted = true;

    // this.userService.login(this.form.value)
    //   .subscribe(data => {
    //       console.log(data);
    //       this.userService.getMyInfo().subscribe();
    //       this.router.navigate([this.returnUrl]);
    //     },
    //     error => {
    //       console.log(error);
    //       this.submitted = false;
    //       this.notification = {msgType: 'error', msgBody: 'Incorrect username or password.'};
    //     });

    const createUser: CreateUserDTO = {
      name: this.form.value.name!,
      surname: this.form.value.surname!,
      email: this.form.value.email!,
      address: this.form.value.address!,
      phone: this.form.value.phone!,
      password: this.form.value.password!,
      role: (this.form.value.role === "GUEST") ? UserType.GUEST : UserType.OWNER,
    }

    console.log("Selected user type: " + createUser.role)

    this.userService.signup(createUser)
      .pipe(
        map(data => {
          console.log(data);
          this.submitted = true;
          // Transform the data if needed
          return data;
        }),
        catchError(error => {
          console.log(error);
          this.submitted = false;
          this.openSnackBar("Incorrect username or password!", "Close");
          // Returning an observable here if you want to continue the error flow
          // return throwError('Custom error message');
          // or just returning an empty observable to complete the observable chain
          return of();
        })
      )
      .subscribe(data => {
        // Handle the transformed data or side effects
        //this.userService.getMyInfo().subscribe();
        this.router.navigate([this.returnUrl]);
      });

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.openSnackBar(message, action);
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  onReset() {
    this.form.reset({});
  }

  // Custom validator for password match
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirm_password = control.get('confirm_password');

    if (password && confirm_password && password.value !== confirm_password.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }
}
