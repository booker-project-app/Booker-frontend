import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {
    AccommodationUpdatedAvailabilityDTO
} from "../accommodation/update-availability/model/AccommodationUpdatedAvailabilityDTO";
import {PriceType} from "../enums/price-type.enum";

@Injectable()
export class AccommodationServiceMock {
    constructor() {
    }

    updateAvailability(): Observable<AccommodationUpdatedAvailabilityDTO> {
        const updatedAvailabilityDTO: AccommodationUpdatedAvailabilityDTO = {
            id: 1,
            availabilities: [{
                startDate: new Date("2024-12-15"),
                endDate: new Date("2024-12-31")
            }],
            prices: [{
                id: 1,
                cost: 150.0,
                fromDate: '2024-12-15',
                toDate: '2024-12-31',
                type: PriceType.PER_GUEST
            }],
            deadline: 3
        }
        return new Observable<AccommodationUpdatedAvailabilityDTO>((observer) => {
            observer.next(updatedAvailabilityDTO);
            observer.complete();
        })
    }

}
