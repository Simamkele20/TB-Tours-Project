import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { AboutStoryPageComponent } from './pages/about/about-story.component';
import { DestinationDetailComponent } from './pages/destinations/destinations-detail.component';
import { ContactPageComponent } from './pages/contact/contact.component';
import { ToursPageComponent } from './pages/tours/tours.component';
import { CouriersComponent } from './pages/couriers/couriers.component';
import { PlanComponent } from './pages/plan/plan.component';
import { PlanBookingComponent } from './pages/booking/plan-booking.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminManagementComponent } from './pages/admin/admin-management.component';
import { BookingPageComponent } from './pages/booking/booking-page.component';
import { MyBookingsComponent } from './pages/booking/my-bookings.component';
import { PaymentCallbackComponent } from './pages/booking/payment-callback.component';
import { canActivateAuth } from './guards/auth.guard';
import { canActivateAdmin } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'story', component: AboutStoryPageComponent },
  { path: 'plan', component: PlanComponent },
  { path: 'plan-booking', component: PlanBookingComponent },
  { path: 'tours', component: ToursPageComponent },
  { path: 'couriers', component: CouriersComponent },
  { path: 'destinations/:slug', component: DestinationDetailComponent },
  { path: 'contact', component: ContactPageComponent },
  // Auth routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  // Booking routes (protected)
  { path: 'booking/:tourId', component: BookingPageComponent, canActivate: [canActivateAuth] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [canActivateAuth] },
  { path: 'payment-callback', component: PaymentCallbackComponent, canActivate: [canActivateAuth] },
  // Admin routes (protected)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [canActivateAdmin] },
  { path: 'admin/management', component: AdminManagementComponent, canActivate: [canActivateAdmin] },
  { path: 'admin/tours', component: AdminManagementComponent, canActivate: [canActivateAdmin] }, // Legacy route
  { path: '**', redirectTo: '' }
];
