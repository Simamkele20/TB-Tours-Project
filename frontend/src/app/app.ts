import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  readonly nav = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Tours', path: '/tours' },
    { label: 'Fleet', path: '/fleet' },
    { label: 'Contact', path: '/contact' },
  ];

  readonly year = new Date().getFullYear();

  isHome(): boolean {
    return this.router.url === '/';
  }

  isStatePage(): boolean {
    return this.router.url.startsWith('/booking-success') || this.router.url.startsWith('/booking-cancelled');
  }

  isAboutPage(): boolean {
    return this.router.url === '/about';
  }
}
