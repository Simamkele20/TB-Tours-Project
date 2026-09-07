import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { SeoService } from './services/seo.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { DESTINATIONS_DETAIL } from './data/site-content';
import { filter } from 'rxjs/operators';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  readonly maintenanceMode = environment.maintenanceMode;

  private seoService = inject(SeoService);
  private router = inject(Router);
  private googleAnalytics = inject(GoogleAnalyticsService);

  ngOnInit(): void {
    // Set initial SEO tags based on current route
    this.updateSeoForCurrentRoute();

    // Update SEO tags on route change, but don't scroll automatically
    // Let anchor navigation work naturally
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSeoForCurrentRoute();
    });
  }

  private updateSeoForCurrentRoute(): void {
    const path = this.router.url.split('?')[0];
    let pageKey = 'home';
    let pageTitle = 'TB Tours - Private Tours & Airport Transfers in Cape Town';
    let description = 'Discover premium private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands.';
    let pageImage: string | undefined;

    // Check for destination detail page
    const destMatch = path.match(/^\/destinations\/([a-z0-9-]+)/);
    if (destMatch) {
      const slug = destMatch[1];
      const destination = DESTINATIONS_DETAIL[slug];
      if (destination) {
        pageKey = slug;
        pageTitle = `${destination.title} | TB Tours - Cape Town`;
        description = destination.description;
        if (destination.hero?.image) {
          pageImage = `https://tb-tours.co.za/${destination.hero.image}`;
        }
      }
    } else if (path.includes('/about')) {
      pageKey = 'about';
      pageTitle = 'TB Tours - About Us';
    } else if (path.includes('/contact')) {
      pageKey = 'contact';
      pageTitle = 'TB Tours - Contact Us';
    }

    const config = this.seoService.getPageConfig(pageKey) || {
      title: pageTitle,
      description: description,
      image: pageImage,
      url: `https://tb-tours.co.za${path}`,
      keywords: 'cape town tours, private tours, airport transfers, cape winelands, safari'
    };

    if (!config.url) {
      config.url = `https://tb-tours.co.za${path}`;
    }
    if (!config.description) {
      config.description = description;
    }
    if (pageImage && !config.image) {
      config.image = pageImage;
    }

    this.seoService.setMetaTags(config);
    this.seoService.setLocalSearchOptimization();

    // Track page view in Google Analytics
    this.googleAnalytics.trackPageView(path, pageTitle);
  }

  private scrolled = false;
  private mobileMenuOpen = false;

  readonly nav = [
    { label: 'Home', path: '/' },
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

  scrollToHome(): void {
    window.location.hash = '#home';
    this.mobileMenuOpen = false;
  }
}
