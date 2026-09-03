import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { AboutStoryPageComponent } from './pages/about/about-story.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'story', component: AboutStoryPageComponent },
  { path: '**', redirectTo: '' }
];
