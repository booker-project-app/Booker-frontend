import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {Guest} from "./model/guest.model";
import {UpdateUserDTO} from "../dto/UpdateUserDTO";

@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.css']
})
export class GuestViewComponent implements OnInit{
  hide_new: boolean = true;
  hide_confirm : boolean = true;
  guest!: Guest;
  updateUser: UpdateUserDTO = {
    _id: 1
  };
  title: string = "";
  content: string = "";
  newPassword: string = '';
  confirmPassword: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  loggedIn:number = 0;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    const loggedId = Number(localStorage.getItem("loggedId"));
    this.loggedIn = loggedId;
    this.service.getGuestById(loggedId).subscribe({
      next: (result: Guest) => {
        this.guest = result;
        this.updateUser = {
          _id: this.loggedIn,
          name: result.name,
          surname: result.surname,
          email: result.email,
          address: result.address,
          phone: result.phone,
          password: result.password,
          profilePicture: result.profilePicture
        };
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    console.log(files);

    this.service.uploadFile(this.loggedIn, files).subscribe(
      (response:any) => {
        console.log('Files uploaded successfully', response);
        //location.reload();
      },
      (error) => {
        //location.reload();
      }
    );
  }

  saveChanges(): void {
    this.service.updateGuest(this.loggedIn, this.updateUser).subscribe((response) => {
      console.log('Updated user data!', response);
    });
  }

  applyChanges() {
    if (this.newPassword === this.confirmPassword) {
      this.saveChanges();
    } else {
      this.openDialog("Password error", "Passwords must be the same!");
      console.log('Passwords must be the same!');
    }
  }

  deleteAccount() {
    this.service.deleteGuest(this.loggedIn).subscribe(
      response => {
        if (!response.body) {
          this.openDialog("Deletion failed", "You can not delete your account " +
            "at the moment because you have active reservations in the future!\nSorry :(");
        } else {
          this.openDialog("Deletion successful", "Deleted account! ");
        }
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }

  openDialog(title: String, content: String) {
    // @ts-ignore
    this.title = title;
    // @ts-ignore
    this.content = content;
    const dialogOverlayById = document.getElementById('dialog-overlay');
    if (dialogOverlayById) {
      dialogOverlayById.style.display = "flex";
    }
  }

  closeDialog(){
    const dialogOverlayById = document.getElementById('dialog-overlay');
    if (dialogOverlayById) {
      dialogOverlayById.style.display = "none";
    }
  }
}
