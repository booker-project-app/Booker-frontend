import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../user/user.service";
import {catchError, map, of, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "../../service/socket.service";

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  hide = true;
  submitted: boolean = false;
  notification!: DisplayMessage;
  returnUrl!: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  credentials = { email: '', password: '' };
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  userId!: string;

  constructor(private userService : UserService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private socketService : SocketService) {
  }


  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        this.notification = params as DisplayMessage;
      });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64), Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])]
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  // login(): void {
  //   if (this.form.valid) {
  //     console.log("Login successful")
  //   } else {
  //     console.log("Invalid form")
  //   }
  // }
  // email = new FormControl('', [Validators.required, Validators.email]);



  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  // login() {
  //   this.userService.login(this.credentials).subscribe(response => {
  //     const token = response.token;
  //     // Store the token securely (e.g., in local storage)
  //     localStorage.setItem("jwt", token);
  //   });
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

    this.userService.login(this.form.value)
      .pipe(
        map(data => {
          console.log(data);
          this.userId = localStorage.getItem('loggedId')!;
          this.socketService.openSocket(this.userId);
          console.log("Socket opened");
          // Transform the data if needed
          return data;

        }),

        catchError(error => {
          if(error.status == 400){
            alert("Validation failed!");
            this.notification = {msgType: 'error', msgBody: 'not activated.'};

          }else{
            console.log(error);
            this.submitted = false;
            this.notification = {msgType: 'error', msgBody: 'Incorrect username or password.'};

          }
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
}
