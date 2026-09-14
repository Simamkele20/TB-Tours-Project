import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { AboutStoryPageComponent } from './pages/about/about-story.component';
import { DestinationDetailComponent } from './pages/destinations/destinations-detail.component';
import { ContactPageComponent } from './pages/contact/contact.component';
import { CouriersComponent } from './pages/couriers/couriers.component';
import { TermsComponent } from './pages/terms/terms.component';
import { BookingPolicyComponent } from './pages/booking-policy/booking-policy.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'story', component: AboutStoryPageComponent },
  { path: 'destinations/:slug', component: DestinationDetailComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'couriers', component: CouriersComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'booking-policy', component: BookingPolicyComponent },
  { path: '**', redirectTo: '' }
];
