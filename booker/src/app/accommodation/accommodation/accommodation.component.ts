import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccommodationViewDto} from "./model/accommodation-view";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AccommodationService} from "../accommodation.service";
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ReservationRequest} from "./model/ReservationRequest";
import {ReservationRequestStatus} from "../../enums/reservation-request-status.enum";
import {Owner} from "../../user/owner-view/model/owner.model";
import {MapModule} from "../../map/map.module";
import {MapComponent} from "../../map/map.component";
import {UserService} from "../../user/user.service";
import {Guest} from "../../user/guest-view/model/guest.model";
import {SharedService} from "../../shared/shared.service";
import {Availability} from "./model/Availability";
import {MatButtonModule} from "@angular/material/button";
import {CreateAccommodationCommentDTO} from "./model/CreateAccommodationCommentDTO";
import {AccommodationCommentService} from "../accommodation-comment.service";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {AccommodationCommentDTO} from "./model/AccommodationCommentDTO";
import {MatIconModule} from "@angular/material/icon";
import {Notification} from "../../notifications/model/Notification";
import {NotificationType} from "../../enums/notification-type";
import {NotificationService} from "../../notifications/notification.service";
import {format} from "date-fns";

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule, NgForOf, NgIf, RouterLink, DatePipe, MapModule, ReactiveFormsModule, MatButtonModule, NgClass, MatIconModule, DecimalPipe]
})

export class AccommodationComponent implements OnInit  {
  loggedIn: number = Number(localStorage.getItem('loggedId'));
  accommodationId: number = Number(localStorage.getItem('accommodationId'));
  accommodation!: AccommodationViewDto;
  totalPrice: string = "Total price";
  owner!: Owner;
  price: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  people: number = 1;
  loggedInGuest: number = 0;
  invalidDateFiter: any;
  submitted: boolean = false;
  submittedComment: boolean = false;
  selectedRating: number = 0;
  stars = Array(5).fill(0);
  hoverIndex: number = 0;
  averageRating: number = 0;
  accommodationComments: AccommodationCommentDTO[] = [];
  form = new FormGroup({
    people: new FormControl('', [Validators.required,
      Validators.min(1)])
  });
  add_comment_form = new FormGroup({
    content: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)])
  });

  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();

  constructor(private route: ActivatedRoute,
              private sharedService: SharedService,
              private userService: UserService,
              private service: AccommodationService,
              private map: MapComponent,
              private formBuilder: FormBuilder,
              private accommodationCommentService: AccommodationCommentService,
              private snackBar: SnackBarComponent,
              private notificationService: NotificationService,
              private router: Router) {
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
          this.loadAccommodationComments();
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
          this.service.getOwner(this.accommodation.owner_id).subscribe({
            next: (owner: Owner) => {
              this.owner = owner;
            }
          })
          //disable dates
          this.invalidDateFiter = (d: Date | null): boolean => {
            const selectedDate = d || new Date();

            // Prevent dates that return false in the checkDate method from being selected.
            let isAvailable = this.checkDate(new Date(selectedDate.toString()));
            console.log("date " + selectedDate.toString() + "is available: " + isAvailable);
            return isAvailable;
          };
        }
      })
    })
    //form validation
    this.form = this.formBuilder.group({
      people: ['', [Validators.required, Validators.min(this.accommodation.min_capacity), Validators.max(this.accommodation.max_capacity)]]
    });
  }

  sendMessageUsingRest() {
      let message: Notification = {
        userId: this.accommodation.owner_id,
        time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        content: "New reservation request for accommodation " + this.accommodation.title,
        type: NotificationType.RESERVATION_REQUEST
      };

      this.notificationService.postRest(message).subscribe(res => {
        console.log(res);
      })
  }

  sendMessageForCommentsUsingRest() {
    let message: Notification = {
      userId: this.accommodation.owner_id,
      time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      content: "New comment for accommodation " + this.accommodation.title,
      type: NotificationType.ACCOMMODATION_RATING
    };

    this.notificationService.postRest(message).subscribe(res => {
      console.log(res);
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
    this.router.navigate(['/make_request', this.accommodation.id]);
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

  rate(rating: number): void {
    this.selectedRating = rating;
  }

  hover(index: number): void {
    this.hoverIndex = index;
  }

  reset(): void {
    this.hoverIndex = 0;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.openSnackBar(message, action);
  }

  submitCommentForm() {
    const accommodationComment: CreateAccommodationCommentDTO = {
      accommodationId: this.accommodationId,
      guestId: this.loggedIn,
      content: this.add_comment_form.value.content!,
      rating: this.selectedRating
    };

    this.accommodationCommentService.add(accommodationComment).subscribe(
      (response) => {
        console.log("Accommodation comment successfully added!");
        this.openSnackBar("Success!", "CLOSE");
        this.sendMessageForCommentsUsingRest();
        this.loadAccommodationComments();
      },
      (error) => {
        console.log("Error in creating accommodation comment ", error);
        this.openSnackBar("Error!", "CLOSE");
      }
    )
  }

  loadAccommodationComments(): void {
    this.accommodationCommentService.findAllNotDeletedForAccommodation(this.accommodationId).subscribe(
      (comments: AccommodationCommentDTO[]) => {
        console.log(comments);
        this.accommodationComments = comments;
        this.calculateAccommodationRate();
        console.log("Accommodation comments loaded successfully: ", comments);
      },
      (error) => {
        console.log("Error in loading accommodation comments: ", error);
      }
    )
  }

  deleteComment(comment: AccommodationCommentDTO) {
    this.accommodationCommentService.remove(comment.id).subscribe(
      (response) => {
        console.log("Comment: ", comment);
        console.log("Comment ID: ", comment.id);
        console.log("Accommodation comment successfully deleted!", response);
        this.loadAccommodationComments();
      },
      (error) => {
        console.log("Comment: ", comment);
        console.log("Comment ID: ", comment.id);
        console.log("Error in deleting accommodation comment!", error);
      }
    )
  }

  calculateAccommodationRate() {
    let totalRatings: number = 0;
    let numberOfComments: number = this.accommodationComments.length;
    for (const comment of this.accommodationComments) {
      totalRatings += comment.rating;
    }
    this.averageRating = totalRatings / numberOfComments;
  }
}
