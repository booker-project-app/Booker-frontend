import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Admin} from "./model/admin.model";
import {UserService} from "../user.service";
import {UpdateUserDTO} from "../dto/UpdateUserDTO";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit{
  hide_new: boolean = true;
  hide_confirm : boolean = true;
  admin!: Admin;
  updateUser: UpdateUserDTO = {
    _id: 5
  };
  title: string = "";
  content: string = "";
  newPassword: string = '';
  confirmPassword: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  loggedIn: number = 0;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.loggedIn = Number(localStorage.getItem("loggedId"));
    this.service.getAdmin(this.loggedIn).subscribe({
      next: (result: Admin) => {
        this.admin = result;
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
    this.service.updateAdmin(this.loggedIn, this.updateUser).subscribe((response) => {
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
