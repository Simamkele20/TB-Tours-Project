import { Routes } from '@angular/router';
import { PageComponent } from './pages/page.component';

export const routes: Routes = [
  { path: '', component: PageComponent, data: { page: 'home' } },
  { path: 'destinations', component: PageComponent, data: { page: 'destinations' } },
  { path: 'about', component: PageComponent, data: { page: 'about' } },
  { path: 'about/thabangs-story', component: PageComponent, data: { page: 'about-story' } },
  { path: 'services', component: PageComponent, data: { page: 'services' } },
  { path: 'tours', component: PageComponent, data: { page: 'tours' } },
  { path: 'contact', component: PageComponent, data: { page: 'contact' } },
  { path: '**', redirectTo: '' }
];
