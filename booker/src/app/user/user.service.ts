import {Injectable} from '@angular/core';
import {UserType} from "../enums/user-type.enum";
import {User} from "./model/user.model";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, switchMap, throwError} from "rxjs";
import {Guest} from "./guest-view/model/guest.model";
import {environment} from "../../env/env";
import {UpdateUserDTO} from "./dto/UpdateUserDTO";
import {Owner} from "./owner-view/model/owner.model";
import {Admin} from "./admin-view/model/admin.model";
import {ApiService, ConfigService} from "../service";
import {Router} from "@angular/router";
import {UserDTO} from "./dto/UserDTO";
import {CreateUserDTO} from "./dto/CreateUserDTO";


const USERS = [
  {
    _id: 1,
    name: 'Marko',
    surname: 'Markovic',
    email: 'email1',
    address: 'addressa',
    phone: '12345678890',
    password: '123',
    type: UserType.GUEST,
  },
  {
    _id: 2,
    name: 'Petar',
    surname: 'Petrovic',
    email: 'email2',
    address: 'adresa 23',
    phone: '1234670',
    password: '12345',
    type: UserType.OWNER,
  }
]

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersList: User[] = [];
  loginRole: string = '';
  loggedInUser: User | undefined;


  constructor(private http: HttpClient,
              private apiService: ApiService,
              private config: ConfigService,
              private router: Router) { }

  private access_token = null;
  currentUser!:any;

  login(loginDTO:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    // const body = `username=${user.username}&password=${user.password}`;
    const body = {
      'email': loginDTO.email,
      'password': loginDTO.password
    };
    return this.apiService.post(this.config.login_url, JSON.stringify(body), loginHeaders)
      .pipe(
        switchMap((response: any) => {
          console.log('Login success');
          const token = response.body; // Use 'text' property for text responses

          this.access_token = token.token; // Assuming 'access_token' is the correct property name

          localStorage.setItem('jwt', this.access_token!);
          localStorage.setItem('loggedId', token.userId);

          return this.findById(token.userId).pipe(
            map((user: User) => {
                this.loggedInUser = user;

                if (this.loggedInUser && this.loggedInUser.role) {
                    if (this.loggedInUser.role === UserType.GUEST) {
                        this.loginRole = 'guests';
                    } else if (this.loggedInUser.role === UserType.OWNER) {
                        this.loginRole = 'owners';
                    } else if (this.loggedInUser.role === UserType.ADMIN) {
                        this.loginRole = 'admins';
                    }
                }

                // Sačuvaj ulogu korisnika u localStorage
                localStorage.setItem('loggedRole', this.loginRole);

                return this.loggedInUser; // Povrati podatke o ulogovanom korisniku
            })
        );
          }),
        catchError((error: any) => {
          console.error('Error during login:', error);
          console.log('Error Response Body:', error.error); // Log the response body for further inspection
          throw error; // Rethrow the error to propagate it further
        })
      );
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post(this.config.login_url, credentials);
  // }



  signup(createUserDTO:any): Observable<CreateUserDTO> {
    const signupHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.apiService.post(this.config.signup_url, createUserDTO, signupHeaders)
        .pipe(map((response: HttpResponse<any>) => response.body as CreateUserDTO));
  }

  activateProfile(activationLink:string) {

    return this.apiService.put(this.config.user_url + `/activate_profile/${activationLink}`, null)
      .pipe(map(() => {
        console.log('Sign up success');
      }));
  }

  getMyInfo() {
    return this.apiService.get(this.config.whoami_url)
      .pipe(map(user => {
        this.currentUser = user;
        return user;
      }));
  }

  getAll() {
    return this.apiService.get(this.config.users_url);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("jwt");
    localStorage.removeItem("loggedId");
    localStorage.removeItem("loggedRole");
    this.access_token = null;
    this.router.navigate(['/login']);
  }

  tokenIsPresent() {
    return this.access_token != undefined && this.access_token != null;
  }

  getToken() {
    return this.access_token;
  }

  findById(id: number): any{
    return this.http.get<User>(environment.apiHost + 'api/users/' + id);
  }

  getGuests(): Observable<Guest>{
    return this.http.get<Guest>(environment.apiHost + 'api/guests/all');
  }

  getGuestById(id: number): Observable<Guest>{
    return this.http.get<Guest>(environment.apiHost + 'api/guests/' + id);
  }

  getOwners(): Observable<Owner[]>{
    return this.http.get<Owner[]>(environment.apiHost + 'api/owners/all');
  }

  getOwnerById(id: number): Observable<Owner>{
    return this.http.get<Owner>(environment.apiHost + 'api/owners/' + id);
  }

  getAdmin(id: number): Observable<Admin>{
    return this.http.get<Admin>(environment.apiHost + 'api/admin/' + id);
  }

  add(user: User) : void {
    this.usersList.push(user);
  }

  updateGuest(id: number, updateUser: any) {
    return this.apiService.put(this.config.guests_url + `/${id}`, JSON.stringify(updateUser));
  }

  updateOwner(id: number, updateUser: any){
    return this.apiService.put(this.config.owners_url + `/${id}`, JSON.stringify(updateUser));
  }

  updateAdmin(id: number, updateUser: any) {
    return this.apiService.put(this.config.admin_url + `/${id}`, JSON.stringify(updateUser));
  }

  deleteGuest(id: number) {
    return this.apiService.put(this.config.guests_url + '/delete' + `/${id}`, {}).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Error: ', error);
        throw error;
      })
    );
  }

  deleteOwner(id: number) {
    return this.apiService.put(this.config.owners_url + '/delete' + `/${id}`, {}).pipe(
      map(response => {
        if (!response){

        }
        return response;
      }),
      catchError(error => {
        console.error('Error: ', error);
        throw error;
      })
    );
  }


  getCancelled(guestId: number) {
    return this.http.get<number>(environment.apiHost + 'api/guests/' + guestId + '/cancelled');
  }

  getGuestsForOwner(ownerId: number) {
    return this.http.get<Guest[]>(environment.apiHost + 'api/owners/' + ownerId + '/guests');
  }
}

