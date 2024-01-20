import {Availability} from "../../accommodation/model/Availability";
import {Price} from "../../accommodation/model/price.model";

export interface AccommodationUpdatedAvailabilityDTO {
  id?: number;
  availabilities: Availability[];
  prices: Price[]
  deadline: number;
}
