import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UpdateUserDTO} from "../dto/UpdateUserDTO";
import {Owner} from "./model/owner.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-owner-view',
  templateUrl: './owner-view.component.html',
  styleUrls: ['./owner-view.component.css']
})
export class OwnerViewComponent implements OnInit{
  hide_new: boolean = true;
  hide_confirm : boolean = true;
  owner!: Owner;
  updateUser: UpdateUserDTO = {
    _id: 6
  };
  title: string = "";
  content: string = "";
  newPassword: string = '';
  confirmPassword: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private service: UserService) { }

  ngOnInit(): void {
      this.service.getOwnerById(6).subscribe({
          next: (result: Owner) => {
              this.owner = result;
              this.updateUser = {
                  _id: 6,
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // @ts-ignore
      this.updateUser.profilePicture.path = e.target.result;
    };
    reader.readAsDataURL(file);
    // @ts-ignore
    console.log(this.updateUser.profilePicture.path);
  }

  saveChanges(): void {
    this.service.updateOwner(6, this.updateUser).subscribe((response) => {
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
    this.service.deleteOwner(6).subscribe(
      response => {
        if (!response) {
          this.openDialog("Deletion failed", "You can not delete your account " +
            "at the moment because you have active reservations for your accommodation in the future!\nSorry :(");
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
      dialogOverlayById.style.opacity = String(1);
    }
  }

  closeDialog(){
    const dialogOverlayById = document.getElementById('dialog-overlay');
    if (dialogOverlayById) {
      dialogOverlayById.style.opacity = String(0);
    }
  }

}
