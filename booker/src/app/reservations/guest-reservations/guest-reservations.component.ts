import {Component, OnInit} from '@angular/core';
import {Reservation} from "../model/Reservation";
import {ReservationService} from "../reservation.service";
import {Router} from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-reservations',
  templateUrl: './guest-reservations.component.html',
  styleUrls: ['./guest-reservations.component.css']
})
export class GuestReservationsComponent implements OnInit{
  reservations: Reservation[] = [];

  constructor(private service: ReservationService,
              private router: Router) {
  }

  ngOnInit(): void {
    const loggedId = Number(localStorage.getItem("loggedId"));
    this.service.getAllForGuest().subscribe({
      next: (data: Reservation[]) => {
        console.log(data);
        this.reservations = data
      },
      error: (_) => {
        console.log("Greska!")
      }
    })
  }
}
