import {UserType} from "../../enums/user-type.enum";
import {ProfilePicture} from "../model/ProfilePicture";

export interface CreateUserDTO {
  name: string;
  surname: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role?: UserType;
  profilePicture?: ProfilePicture;
  activationLink: string;
}
