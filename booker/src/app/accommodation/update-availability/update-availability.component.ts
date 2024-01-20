import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccommodationService} from "../accommodation.service";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";
import {Price} from "../accommodation/model/price.model";
import {PriceType} from "../../enums/price-type.enum";
import {UpdateAvailabilityDTO} from "./model/UpdateAvailabilityDTO";

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-update-availability',
  templateUrl: './update-availability.component.html',
  styleUrls: ['./update-availability.component.css']
})
export class UpdateAvailabilityComponent implements OnInit{
  todayDate:Date = new Date();
  submitted = false;
  formGroupAvailability = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  })

  formGroupPrice = new FormGroup({
    priceStartDate: new FormControl('', [Validators.required]),
    priceEndDate: new FormControl('', [Validators.required]),
    amount: new FormControl(100.0, [Validators.required, Validators.min(0)]),
    price_type: new FormControl(PriceType.PER_GUEST, [Validators.required])
  })

  formGroupDeadline = new FormGroup({
    deadline: new FormControl(0, [Validators.required, Validators.min(1)]),
  })

  constructor(public snackBar: SnackBarComponent,
              private accommodationService: AccommodationService) {
  }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.openSnackBar(message, action);
  }

  submitForm() {
    this.submitted = true;
    const price: Price = {
      cost: this.formGroupPrice.value.amount!,
      fromDate: this.formGroupPrice.value.priceStartDate!,
      toDate: this.formGroupPrice.value.priceEndDate!,
      type: (this.formGroupPrice.value.price_type === "PER_ACCOMMODATION") ? PriceType.PER_ACCOMMODATION : PriceType.PER_GUEST,
    };

    const updateAvailability: UpdateAvailabilityDTO = {
      startDate: this.formGroupAvailability.value.startDate!,
      endDate: this.formGroupAvailability.value.endDate!,
      price: price,
      deadline: this.formGroupDeadline.value.deadline!
    }

    const accommodationId = Number(localStorage.getItem("accommodationId"));

    this.accommodationService.updateAvailability(accommodationId, updateAvailability).subscribe(
      (response) => {
        console.log("Successfully updated: ", response);
        this.resetForm();
        //this.uploadPhotos(response.id!);
        this.openSnackBar("Success!", "Close");

      },
      (error) => {
        console.error("Error in updating availability: ", error);
        alert("Validation failed");
        this.openSnackBar("Error updating availability", "Close");
      }
    )



  }

  areFormGroupsValid(): boolean {

    return (
        this.formGroupAvailability.valid &&
        this.formGroupPrice.valid &&
        this.formGroupDeadline.valid
    );
  }

  resetForm() {
    // Reset the form to its initial state
    this.formGroupAvailability.reset();
    this.formGroupPrice.reset({
      amount: 100.0,
      price_type: PriceType.PER_GUEST,
    });
    this.formGroupDeadline.reset({
      deadline: 0,
    });
  }


}
