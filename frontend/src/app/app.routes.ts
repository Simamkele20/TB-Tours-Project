import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { AboutStoryPageComponent } from './pages/about/about-story.component';
import { DestinationDetailComponent } from './pages/destinations/destinations-detail.component';
import { ContactPageComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'story', component: AboutStoryPageComponent },
  { path: 'destinations/:slug', component: DestinationDetailComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', redirectTo: '' }
];
