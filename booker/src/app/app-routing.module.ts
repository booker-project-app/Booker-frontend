import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./layout/home/home.component";
import {AccommodationListingComponent} from "./accommodation/accommodation-listing/accommodation-listing.component";
import {LoginComponent} from "./layout/login/login.component";
import {AccommodationComponent} from "./accommodation/accommodation/accommodation.component";
import {RegisterComponent} from "./layout/register/register.component";
import {GuestViewComponent} from "./user/guest-view/guest-view.component";
import {CreateAccommodationComponent} from "./accommodation/create-accommodation/create-accommodation.component";
import {OwnerViewComponent} from "./user/owner-view/owner-view.component";
import {AdminViewComponent} from "./user/admin-view/admin-view.component";
import {ActivationViewComponent} from "./layout/activation-view/activation-view.component";
import {UpdateAvailabilityComponent} from "./accommodation/update-availability/update-availability.component";
import {
  OwnerAccommodationListingComponent
} from "./accommodation/owner-accommodation-listing/owner-accommodation-listing.component";
import {UpdateAccommodationComponent} from "./accommodation/update-accommodation/update-accommodation.component";
import {ApproveAccommodationComponent} from "./accommodation/approve-accommodation/approve-accommodation.component";
import {OwnerProfileComponent} from "./user/owner-profile/owner-profile.component";
import {GuestRequestsComponent} from "./requests/guest-requests/guest-requests.component";
import {OwnerRequestsComponent} from "./requests/owner-requests/owner-requests.component";
import {
  FavouriteAccommodationsComponent
} from "./accommodation/favourite-accommodations/favourite-accommodations.component";
import {DateIntervalReportComponent} from "./reports/date-interval-report/date-interval-report.component";
import {AccommodationReportComponent} from "./reports/accommodation-report/accommodation-report.component";
import {GuestReservationsComponent} from "./reservations/guest-reservations/guest-reservations.component";
import {OwnerReservationsComponent} from "./reservations/owner-reservations/owner-reservations.component";
import {GuestProfilesComponent} from "./user/guest-profiles/guest-profiles.component";
import {NotificationsComponent} from "./notifications/notifications/notifications.component";
import {
  OwnerCommentsAndRatingsComponent
} from "./comments-and-ratings/owner-comments-and-ratings/owner-comments-and-ratings.component";
import {
  AccommodationCommentsAndRatingsComponent
} from "./comments-and-ratings/accommodation-comments-and-ratings/accommodation-comments-and-ratings.component";
import {ReportedUsersComponent} from "./reported-users-admin/reported-users/reported-users.component";
import {
  MakeReservationRequestComponent
} from "./accommodation/make-reservation-request/make-reservation-request.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'accommodation/:id', component: AccommodationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
  {path: 'guests', component: GuestViewComponent},
  {path: 'owners', component: OwnerViewComponent},
  {path: 'admins', component: AdminViewComponent},
  {path: 'search/:startDate/:endDate/:location/:people', component: AccommodationListingComponent},
  {path: 'search/:startDate/:endDate/:location/:people/filter', component: AccommodationListingComponent},
  {path: 'create_accommodation', component: CreateAccommodationComponent},
  {path: 'activate_profile/:activationLink', component: ActivationViewComponent},
  {path: 'update_availability', component: UpdateAvailabilityComponent},
  {path: 'accommodation/:id/update', component: UpdateAccommodationComponent},
  {path: 'approve', component: ApproveAccommodationComponent},
  {path: 'accommodations/owner', component: OwnerAccommodationListingComponent},
  {path: 'owner/:id', component: OwnerProfileComponent},
  {path: 'requests/guest', component: GuestRequestsComponent},
  {path: 'requests/owner', component: OwnerRequestsComponent},
  {path: 'favourites', component: FavouriteAccommodationsComponent},
  {path: 'report/accommodation', component: AccommodationReportComponent},
  {path: 'report/date', component: DateIntervalReportComponent},
  {path: 'reservations/guest', component: GuestReservationsComponent},
  {path: 'reservations/owner', component: OwnerReservationsComponent},
  {path: 'owner/guests', component: GuestProfilesComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'comments_and_ratings/owner', component: OwnerCommentsAndRatingsComponent},
  {path: 'comments_and_ratings/accommodation', component: AccommodationCommentsAndRatingsComponent},
  {path: 'reported', component: ReportedUsersComponent},
  {path: 'make_request/:id', component: MakeReservationRequestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
