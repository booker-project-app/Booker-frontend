import { Component } from '@angular/core';
import {ReservationRequest} from "../accommodation/model/ReservationRequest";
import {ReservationRequestStatus} from "../../enums/reservation-request-status.enum";
import {Availability} from "../accommodation/model/Availability";
import {Guest} from "../../user/guest-view/model/guest.model";
import {AccommodationViewDto} from "../accommodation/model/accommodation-view";
import {Owner} from "../../user/owner-view/model/owner.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccommodationCommentDTO} from "../accommodation/model/AccommodationCommentDTO";
import {UserService} from "../../user/user.service";
import {ActivatedRoute} from "@angular/router";
import {AccommodationService} from "../accommodation.service";

@Component({
  selector: 'app-make-reservation-request',
  templateUrl: './make-reservation-request.component.html',
  styleUrls: ['./make-reservation-request.component.css']
})
export class MakeReservationRequestComponent {
  loggedIn: number = Number(localStorage.getItem('loggedId'));
  accommodationId: number = Number(localStorage.getItem('accommodationId'));
  accommodation!: AccommodationViewDto;
  totalPrice: string = "Total price";
  price: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  people: number = 1;
  loggedInGuest: number = 0;
  invalidDateFiter: any;
  submitted: boolean = false;
  form = new FormGroup({
    people: new FormControl('', [Validators.required,
      Validators.min(1)])
  });

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private service: AccommodationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    //getting the user - if not guest hide reservation request div
    const loggedIn = localStorage.getItem("loggedId");
    const loggedRole = localStorage.getItem("loggedRole");
    console.log(loggedIn)
    if(loggedRole === 'guests') {
      this.userService.getGuestById(Number(loggedIn)).subscribe( {
        next: (result: Guest) => {
          this.loggedInGuest = Number(loggedIn);
        },
        error: (_) => {     //owner or admin
          this.loggedInGuest = 0;
        }
      })
    } else {
      this.loggedInGuest = 0;
    }
    //initializing accommodation
    this.route.params.subscribe((params) => {
      const id = +params['id']
      this.service.getAccommodation(id).subscribe({
        next: (data: AccommodationViewDto) => {
          this.accommodation = data;
          //disable dates
          this.invalidDateFiter = (d: Date | null): boolean => {
            const selectedDate = d || new Date();

            // Prevent dates that return false in the checkDate method from being selected.
            let isAvailable = this.checkDate(new Date(selectedDate.toString()));
            console.log("date " + selectedDate.toString() + "is available: " + isAvailable);
            return isAvailable;
          };
          //form validation
          this.form = this.formBuilder.group({
            people: ['', [Validators.required, Validators.min(this.accommodation.min_capacity), Validators.max(this.accommodation.max_capacity)]]
          });
        }
      })
    })
  }

  closed() {
    // dateRangeStart.value, dateRangeEnd.value to get dates
    const year1 = this.startDate.getFullYear();
    const month1 = (this.startDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day1 = this.startDate.getDate().toString().padStart(2, '0');
    const formattedFromDate = `${year1}-${month1}-${day1}`;
    const year2 = this.endDate.getFullYear();
    const month2 = (this.endDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day2 = this.endDate.getDate().toString().padStart(2, '0');
    console.log(year2 + ", " + month2 + ", " + day2)
    const formattedToDate = `${year2}-${month2}-${day2}`;
    this.service.getPrice(this.accommodation.id, formattedFromDate, formattedToDate, this.people).subscribe(
      {
        next: (data: number) => {
          this.price = data;
          this.totalPrice = this.price.toFixed(2) + " $";
          console.log(this.price);
        },
        error: (_) => {}
      }
    );
  }

  makeReservation() {
    if (this.form.valid
      && this.checkDate(new Date(this.startDate.toString()))
      && this.checkDate(new Date(this.endDate.toString()))) {
      if (this.people <= this.accommodation.max_capacity
        &&
        this.people >= this.accommodation.min_capacity) {
        let id = 0;
        this.route.params.subscribe((params) => {
          id = +params['id']
        });
        const year1 = this.startDate.getFullYear();
        const month1 = (this.startDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const day1 = this.startDate.getDate().toString().padStart(2, '0');
        console.log(year1 + ", " + month1 + ", " + day1)
        const formattedFromDate = `${year1}-${month1}-${day1}`;

        const year2 = this.endDate.getFullYear();
        const month2 = (this.endDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const day2 = this.endDate.getDate().toString().padStart(2, '0');
        console.log(year2 + ", " + month2 + ", " + day2)
        const formattedToDate = `${year2}-${month2}-${day2}`;

        const request: ReservationRequest = {
          guestId: this.loggedInGuest,
          accommodationId: id,
          id: -1,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          numberOfGuests: this.people,
          status: ReservationRequestStatus.WAITING,
          deleted: false,
          price: Number(this.price.toFixed(2))
        }
        this.service.makeReservationRequest(request).subscribe(
          {
            next: (data: ReservationRequest) => {
              //TODO: navigate to my reservations?
              console.log("made reservation request: ")
              console.log(data)
              alert("You made a reservation request!");
            },
            error: (_) => {
            }
          }
        );
      } else {
        if (!this.checkDate(new Date(this.startDate.toString()))
          || !this.checkDate(new Date(this.endDate.toString()))) {
          alert("Dates are not available!");
        } else {
          if (this.people <= 0) {
            alert("Number of people is invalid!")
          } else if (this.people < this.accommodation.min_capacity) {
            alert("More people required!")
          } else if (this.people > this.accommodation.max_capacity) {
            alert("Less people required!")
          }
        }
      }
    } else {
      if (!this.checkDate(new Date(this.startDate.toString()))
        || !this.checkDate(new Date(this.endDate.toString()))) {
        alert("Dates are not available!");
      } else if (this.people <= 0) {
        alert("Number of people is invalid!")
      } else if (this.people < this.accommodation.min_capacity) {
        alert("More people required!")
      } else if (this.people > this.accommodation.max_capacity) {
        alert("Less people required!")
      }
    }
  }

  private checkDate(selectedDate: Date) {
    if(selectedDate < new Date()) {
      return false;
    }
    for(let a in this.accommodation.availabilities) {
      let availability: Availability = this.accommodation.availabilities[a];
      let startDate = new Date(availability.startDate.toString())
      let endDate = new Date(availability.endDate.toString())
      if(selectedDate >= startDate && selectedDate <= endDate) {
        return true;
      }
    }
    return false;
  }

}
