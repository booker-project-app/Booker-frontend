import {Component, ElementRef, OnInit} from '@angular/core';
import {AccommodationListingDto} from "../accommodation/model/accommodation-listing.model";
import {AccommodationService} from "../accommodation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Filter} from "../accommodation/model/Filter";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-accommodation-listing',
  templateUrl: './accommodation-listing.component.html',
  styleUrls: ['./accommodation-listing.component.css']
})
export class AccommodationListingComponent implements OnInit {
  accommodations: AccommodationListingDto[] = [];
  clickedAcc: string = ''
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  people: number = 0;
  submitted: boolean = false;
  form = new FormGroup({
    people: new FormControl('', [Validators.required,
      Validators.min(1)]),
    location: new FormControl('', [Validators.required, Validators.minLength(1)]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required])
  });
  hotel: boolean = false;
  room: boolean = false;
  studio: boolean = false;
  villa: boolean = false;
  //amenities
  amenities: string[] = [];
  selectedAmenities: { [key: string]: boolean } = {};
  minPrice?: number;
  maxPrice?: number;

  constructor(private service: AccommodationService, private route: ActivatedRoute,
              private elemRef : ElementRef, private router: Router,
              private formBuilder: FormBuilder) {
  }

  onCheckboxChange(amenity: string) {
    console.log("amenity change: " + amenity);
    let isSelected = this.selectedAmenities[amenity];
    this.selectedAmenities[amenity] = isSelected;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.startDate = this.formatDateToString(new Date(params['startDate']));
      this.endDate = this.formatDateToString(new Date(params['endDate']));
      this.location = String(params['location']);
      this.people = +params['people'];
      console.log("parametri: " + this.formatDateToString(new Date(this.startDate)) + ", " + this.formatDateToString(new Date(this.endDate)) + ", " + this.location + ", " + this.people)
      this.service.searchAccommodations(this.formatDateToString(new Date(this.startDate)), this.formatDateToString(new Date(this.endDate)), this.location, this.people).subscribe({
        next: (data: AccommodationListingDto[]) => {
          this.accommodations = data
          console.log(data)
        },
        error: (_) => {
          console.log("Greska!")
        }
      })
    })
    //initialize amenities
    this.service.getAmenityNames().subscribe({
      next: (data: string[]) => {
        this.amenities = data
        for(let amenityName in data) {
          console.log(data[amenityName]);
          this.selectedAmenities[data[amenityName]] = false;
        }
      },
      error: (_) => {
        console.log("Greska!")
      }
    })
    //initialize form controls
    this.form = this.formBuilder.group({
      people: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required, Validators.minLength(1)]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]]
    });
  }

  onAccommodationClick(accommodation: AccommodationListingDto) {
    this.clickedAcc = accommodation.title + " " + accommodation.id;
  }

  formatDateToString(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it is zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;

  }

  search(where_input: HTMLInputElement, from_date: HTMLInputElement, to_date: HTMLInputElement, people_input: HTMLInputElement) {
    if (this.form.valid
    && (new Date(this.startDate) > new Date() && new Date(this.endDate) > new Date() && new Date(this.endDate) > new Date(this.startDate))) {
      let location = where_input.value;
      let start_date = this.formatDateToString(new Date(from_date.value));
      let end_date =this.formatDateToString(new Date(to_date.value));
      if(!from_date.value || !to_date.value) {
        alert("Please fill all required fields (location, dates and number of guests)")
      } else {
        let people_search = Number(people_input.value);
        let filters: Filter[] = [];
        for (let key in this.amenities) {
          console.log('amenity: ' + this.amenities[key]);
          let isSelected = this.selectedAmenities[this.amenities[key]];
          console.log(isSelected);
          if (isSelected) {
            filters.push({
              "name": this.amenities[key],
              "value": {
                "checked": true
              }
            });
          }
        }

        let accTypes: boolean[] = [this.hotel, this.room, this.villa, this.studio];
        let accTypeNames: string[] = ['hotel', 'room', 'villa', 'studio'];
        for (let type in accTypes) {
          if (accTypes[type]) {
            filters.push({
              "name": accTypeNames[type],
              "value": {
                "checked": true
              }
            });
          }
        }

        if (this.minPrice) {
          filters.push({
            "name": "minPrice",
            "value": {
              "price": this.minPrice
            }
          });
        }
        if (this.maxPrice) {
          filters.push({
            "name": "maxPrice",
            "value": {
              "price": this.maxPrice
            }
          });
        }
        if (filters.length != 0) {
          this.service.searchAndFilterAccommodations(start_date, end_date, location, people_search, filters).subscribe({
            next: (data: AccommodationListingDto[]) => {
              this.accommodations = data
            },
            error: (_) => {
              console.log("Greska!")
            }
          })
        } else {
          //if there are no filtering params, then we are searching
          this.route.params.subscribe((params) => {
            console.log("parametri: " + start_date + ", " + end_date + ", " + location + ", " + people_search)
            this.router.navigate(['/search', start_date, end_date, location, people_search]);
          })
        }
      }
    } else {
      if(this.people < 1) {
        alert("Number of guests can not be less than 0!")
      } else if(new Date(this.startDate) < new Date() || new Date(this.endDate) < new Date()) {
        alert("You can not search past dates")
      } else if(new Date(this.endDate) <= new Date(this.startDate)) {
        alert("Trip can not end before it starts!")
      } else{
          alert("Please fill all required fields (location, dates and number of guests)")
      }
    }
    //this.router.navigate(['/search', start_date.value, end_date.value, location.value, Number(people.value), '/filter']);
  }
}
