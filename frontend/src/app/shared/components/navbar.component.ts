import { Component, signal, AfterViewInit, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <div class="navbar-brand" (click)="navigateTo(''); closeMobileMenu()" style="cursor: pointer;">
          <span class="brand-logo">TB</span>
          <span class="brand-text">Tours</span>
        </div>

        <!-- Mobile Toggle -->
        <button class="navbar-toggle" (click)="toggleMenu()" [class.active]="mobileMenuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation Menu -->
        <ul class="navbar-menu" [class.open]="mobileMenuOpen()">
          <li><a [routerLink]="['']" (click)="closeMobileMenu()" class="nav-link" [class.active]="currentPage() === 'home'">Home</a></li>
          <li><a [routerLink]="['/story']" (click)="closeMobileMenu()" class="nav-link" [class.active]="currentPage() === 'about'">About</a></li>
          <li><a [routerLink]="['/contact']" (click)="closeMobileMenu()" class="nav-link" [class.active]="currentPage() === 'contact'">Contact</a></li>
        </ul>

        <!-- CTA Button -->
        <button class="navbar-cta" (click)="navigateTo('/contact'); closeMobileMenu()">Book Now</button>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  mobileMenuOpen = signal(false);
  currentPage = signal('home');

  private sections = ['home', 'about', 'destinations', 'services', 'contact'];
  private ngZone = inject(NgZone);
  private router = inject(Router);

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // Initial detection
    this.updateActiveSection();

    // Add scroll listener - keep it simple first
    let scrollTimeout: any = null;

    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateActiveSection();
      }, 50);
    }, { passive: true });

    // Also listen for hash changes
    window.addEventListener('hashchange', () => {
      this.updateActiveSection();
    });
  }

  private updateActiveSection(): void {
    if (typeof window === 'undefined') return;

    // Get current scroll position (center of viewport)
    const scrollPos = window.scrollY + window.innerHeight / 2;

    let activeSection = 'home';
    let closestDistance = Infinity;

    // Find which section is closest to the center of the viewport
    for (const sectionId of this.sections) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const elementCenter = window.scrollY + rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - scrollPos);

      if (distance < closestDistance) {
        closestDistance = distance;
        activeSection = sectionId;
      }
    }

    // Only update if changed
    if (this.currentPage() !== activeSection) {
      this.currentPage.set(activeSection);
    }
  }

  toggleMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  navigateTo(path: string): void {
    this.currentPage.set(path === '' ? 'home' : path.substring(1));
    this.router.navigate([path]);
  }
}
