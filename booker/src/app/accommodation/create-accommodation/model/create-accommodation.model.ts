import {Amenity} from "../../accommodation/model/Amenity";
import {Image} from "../../accommodation/model/Image";
import {AccommodationType} from "../../../enums/accommodation-type";
import {Availability} from "../../accommodation/model/Availability";
import {Price} from "../../accommodation/model/price.model";

export interface CreateAccommodation {
  title: string;
  description: string;
  address: string;
  amenities: Amenity[];
  images: Image[];
  type: AccommodationType;
  startDate: object;
  endDate: object;
  price: Price;
  minCapacity: number;
  maxCapacity: number;

}