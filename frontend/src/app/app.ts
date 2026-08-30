import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { SeoService } from './services/seo.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { filter } from 'rxjs/operators';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  readonly maintenanceMode = environment.maintenanceMode;

  constructor(
    private seoService: SeoService,
    private router: Router,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    // Set initial SEO tags based on current route
    this.updateSeoForCurrentRoute();

    // Update SEO tags on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSeoForCurrentRoute();
      // Scroll to top
      window.scrollTo(0, 0);
    });
  }

  private updateSeoForCurrentRoute(): void {
    const path = this.router.url.split('?')[0];
    let pageKey = 'home';
    let pageTitle = 'TB Tours - Private Tours & Airport Transfers in Cape Town';

    if (path.includes('/tours')) {
      pageKey = 'tours';
      pageTitle = 'TB Tours - Tours in Cape Town & Winelands';
    } else if (path.includes('/services')) {
      pageKey = 'services';
      pageTitle = 'TB Tours - Services';
    } else if (path.includes('/destinations')) {
      pageKey = 'destinations';
      pageTitle = 'TB Tours - Destinations';
    } else if (path.includes('/about')) {
      pageKey = 'about';
      pageTitle = 'TB Tours - About Us';
    } else if (path.includes('/contact')) {
      pageKey = 'contact';
      pageTitle = 'TB Tours - Contact Us';
    }

    const config = this.seoService.getPageConfig(pageKey);
    config.url = `https://tb-tours.co.za${path}`;
    this.seoService.setMetaTags(config);
    this.seoService.setLocalSearchOptimization();

    // Track page view in Google Analytics
    this.googleAnalytics.trackPageView(path, pageTitle);
  }

  private scrolled = false;
  private mobileMenuOpen = false;

  readonly nav = [
    { label: 'Home', path: '/' },
    { label: 'Tours', path: '/tours' },
    { label: 'Services', path: '/services' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  readonly year = new Date().getFullYear();

  isScrolled(): boolean {
    return this.scrolled;
  }

  isMobileMenuOpen(): boolean {
    return this.mobileMenuOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  mobileMenuAriaLabel(): string {
    return this.mobileMenuOpen ? 'Close menu' : 'Open menu';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 860) {
      this.mobileMenuOpen = false;
    }
  }
}
