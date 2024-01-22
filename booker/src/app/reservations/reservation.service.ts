import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../env/env";
import {Reservation} from "./model/Reservation";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getAllForGuest() : Observable<Reservation[]>{
    return this.http.get<Reservation[]>(environment.apiHost + 'api/reservations/guest/1');
  }

  getAllForAccommodation(id: number) : Observable<Reservation[]>{
    return this.http.get<Reservation[]>(environment.apiHost + 'api/reservations/accommodation/' + id);
  }

  cancelReservation(reservationId: number) : Observable<boolean>{
    return this.http.put<boolean>(environment.apiHost + 'api/reservations/guest/cancel/' + reservationId, {}).pipe(
      map(response => {
        console.log("servis: ", response)
        return response;
      })
    );
  }

  getAllFutureApprovedForGuest(guestId: number) : Observable<Reservation[]>{
    return this.http.get<Reservation[]>(environment.apiHost + 'api/reservations/guest/' + guestId + '/future/approved');
  }
}
