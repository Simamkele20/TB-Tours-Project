import { Routes } from '@angular/router';
import { BookingCancelledComponent } from './booking/booking-cancelled.component';
import { BookingComponent } from './booking/booking.component';
import { BookingSuccessComponent } from './booking/booking-success.component';
import { PageComponent } from './pages/page.component';

export const routes: Routes = [
  { path: '', component: PageComponent, data: { page: 'home' } },
  { path: 'about', component: PageComponent, data: { page: 'about' } },
  { path: 'services', component: PageComponent, data: { page: 'services' } },
  { path: 'tours', component: PageComponent, data: { page: 'tours' } },
  { path: 'fleet', component: PageComponent, data: { page: 'fleet' } },
  { path: 'contact', component: PageComponent, data: { page: 'contact' } },
  { path: 'book', component: BookingComponent },
  { path: 'booking-success', component: BookingSuccessComponent },
  { path: 'booking-cancelled', component: BookingCancelledComponent },
  { path: '**', redirectTo: '' }
];
