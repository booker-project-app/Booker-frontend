import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Owner} from "../owner-view/model/owner.model";
import {UserService} from "../user.service";
import {AccommodationService} from "../../accommodation/accommodation.service";
import {AccommodationViewDto} from "../../accommodation/accommodation/model/accommodation-view";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {OwnerCommentService} from "../owner-comment.service";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {CreateOwnerCommentDTO} from "../dto/CreateOwnerCommentDTO";
import {CreateOwnerRatingDTO} from "../dto/CreateOwnerRatingDTO";
import {OwnerRatingService} from "../owner-rating.service";
import {OwnerCommentDTO} from "../dto/OwnerCommentDTO";
import {UserDTO} from "../dto/UserDTO";
import {OwnerRatingDTO} from "../dto/OwnerRatingDTO";
import {DatePipe} from "@angular/common";
import {ReportUserService} from "../report-user.service";
import {Notification} from "../../notifications/model/Notification";
import {format} from "date-fns";
import {NotificationType} from "../../enums/notification-type";
import {NotificationService} from "../../notifications/notification.service";

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}


@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css'],
})


export class OwnerProfileComponent implements OnInit{
  loggedIn: number = Number(localStorage.getItem('loggedId'));
  owner! : Owner;
  accommodationId : number = 0;
  ownerId : number = 0;
  submitted: boolean = false;
  notification!: DisplayMessage;
  returnUrl!: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedRating: number = 0;
  stars = Array(5).fill(0);
  hoverIndex: number = 0;
  ownerComments: OwnerCommentDTO[] = [];
  ownerRatings: OwnerRatingDTO[] = [];
  userDTO!: UserDTO;
  guestId!: number;
  guestName!: string;
  averageRating: number = 0;


  add_comment_form = new FormGroup({
    content: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.min(1), Validators.max(5)]),
  });

  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();







  constructor(private AccommodationService: AccommodationService,
              private service : UserService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private ownerCommentService: OwnerCommentService,
              private snackBar : SnackBarComponent,
              private ownerRatingService: OwnerRatingService,
              private reportUserService: ReportUserService,
              private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.ownerId = +params['id'];
      this.service.getOwnerById(this.ownerId).subscribe({
        next: (result: Owner) =>{
          this.owner = result;
          this.loadOwnerComments();
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    });

  }

  sendMessageUsingRest() {
    let message: Notification = {
      userId: this.ownerId,
      time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      content: "You got a new rating!",
      type: NotificationType.OWNER_RATING
    };

    this.notificationService.postRest(message).subscribe(res => {
      console.log(res);
    })
  }

  report():void{

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

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
  }

  submitForm() {
    const ownerComment: CreateOwnerCommentDTO = {
      ownerId: this.ownerId,
      guestId: Number(localStorage.getItem('loggedId')),
      content: this.add_comment_form.value.content!,
      rating: this.selectedRating
    };

    this.ownerCommentService.add(ownerComment).subscribe(
      (response) => {
        console.log("Owner comment successfully added!", response);
        this.openSnackBar("Sucess!", "Close");
        this.sendMessageUsingRest();
        this.loadOwnerComments();
      },
      (error) => {
        console.error("Error in creating owner comment: ", error);
        this.openSnackBar("Error!", "Close");
      }
    )
  }

  submitRating() {
    const ownerRating: CreateOwnerRatingDTO = {
      ownerId: this.ownerId,
      guestId: Number(localStorage.getItem('loggedId')),
      rate: this.selectedRating,
    };

    this.ownerRatingService.addRating(ownerRating).subscribe(
      (response) => {
        console.log("Owner rating successfully added!");
        this.snackBar.openSnackBar("Owner rating successfully added!", "CLOSE");
      },
      (error) => {
        console.log("Error in creating owner rating!");
        this.snackBar.openSnackBar("Error in creating owner rating!", "CLOSE");
      }
    )

  }
  loadOwnerComments(): void {
    this.ownerCommentService.findAllNotDeletedForOwner(this.ownerId).subscribe(
      (comments: OwnerCommentDTO[]) => {
        console.log(comments);
        this.ownerComments = comments;
        this.calculateOwnerRate();
        console.log("Owner comments loaded successfully: ", this.ownerComments);
      },
      (error) => {
        console.log("Error in loading owner comments!", error);
      }
    )
  }

  loadOwnerRatings(): void {
    this.ownerRatingService.getAllForOwner(this.ownerId).subscribe(
      (ratings: OwnerRatingDTO[]) => {
        console.log(ratings);
        this.ownerRatings = ratings;
        console.log("Owner ratings successfully loaded: ", ratings);
      },
      (error) => {
        console.log("Error in loading owner ratings!", error);
      }
    )
  }

  deleteComment(comment: OwnerCommentDTO) {
    this.ownerCommentService.remove(comment.id).subscribe(
      (response) => {
        console.log("Comment: ", comment);
        console.log("Comment ID: ", comment.id);
        console.log("Owner comment successfully deleted!", response);
        this.loadOwnerComments();
      },
      (error) => {
        console.log("Comment: ", comment)
        console.log("Comment ID: ", comment.id);
        console.log("Error in deleting owner comment!", error);
      }
    );
  }

  calculateOwnerRate() {
    let totalRatings: number = 0;
    let numberOfComments: number = this.ownerComments.length;
    for (const comment of this.ownerComments) {
      totalRatings += comment.rating;
    }
    this.averageRating = totalRatings / numberOfComments;
  }

  openPopup(): void {
    this.reportUserService.openPopupForm(this.ownerId).subscribe((result) => {
      console.log('Popup closed with result: ', result);
    });
  }

}
