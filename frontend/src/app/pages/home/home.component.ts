import { CommonModule } from "@angular/common";
import { Component, computed, signal, inject, ViewChild, HostListener } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { TimeAgoPipe } from "../../shared/pipes/time-ago.pipe";
import { ContactFormComponent } from "../shared/contact-form.component";
import { BookingApiService } from "../../booking/booking-api.service";
import { SITE_CONTENT, GOOGLE_REVIEWS, SITE_SERVICES } from "../../data/site-content";
import { finalize } from "rxjs";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent, TimeAgoPipe, ContactFormComponent],
  template: `
    <!-- HERO SECTION -->
    <section id="home">
      <app-hero-section
        [config]="heroConfig()"
        [showPhone]="() => true">
      </app-hero-section>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about" class="section about-section">
      <div class="container">
        <div class="about-content">
          <p class="kicker">About TB Tours</p>
          <h2>Personal, professional and local</h2>
          <p class="about-description">
            TB Tours (Pty)Ltd offers private tours, airport transfers and chauffeur services across Cape Town and the Cape
            Winelands. Journeys are arranged personally by Thabang, with an emphasis on comfort, safety and local knowledge.
          </p>
          <p class="about-description">
            The company grew out of one person's time on the road - a story of entrepreneurship, service, and genuine care for every journey.
          </p>
          <a routerLink="/story" class="read-story-link">Read Thabang's Story</a>
        </div>
        <div class="about-image">
          <img src="/images/About.jpg" alt="Cape Town scenic view" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- DESTINATIONS SECTION -->
    <section id="destinations" class="section destinations-section">
      <div class="container">
        <div class="section-header">
          <p class="kicker">Featured Experiences</p>
          <h2>The Cape, at its most memorable</h2>
        </div>

        <div class="destinations-wrapper">
          <button class="destination-nav destination-prev" (click)="previousDestinations()" aria-label="Previous destinations">
            <span>‹</span>
          </button>

          <div class="destination-grid">
            <div class="destination-card" *ngFor="let destination of displayedDestinations()">
              <div class="destination-image-wrapper">
                <img [src]="destination.image" [alt]="destination.title" loading="lazy" />
              </div>
              <div class="destination-content">
                <h3>{{ destination.title }}</h3>
                <p>{{ destination.description }}</p>
              </div>
            </div>
          </div>

          <button class="destination-nav destination-next" (click)="nextDestinations()" aria-label="Next destinations">
            <span>›</span>
          </button>
        </div>
      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section id="services" class="section services-section">
      <div class="container">
        <div class="section-header">
          <p class="kicker">Services</p>
          <h2>Travel your way</h2>
        </div>

        <div class="services-wrapper">
          <button class="service-nav service-prev" (click)="previousServices()" aria-label="Previous services">
            <span>‹</span>
          </button>

          <div class="services-grid">
            <div class="service-card" *ngFor="let service of displayedServices()">
              <div class="service-number">{{ service.number }}</div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <button class="service-cta" (click)="requestService(service.title)">{{ service.ctaLabel }}</button>
            </div>
          </div>

          <button class="service-nav service-next" (click)="nextServices()" aria-label="Next services">
            <span>›</span>
          </button>
        </div>
      </div>
    </section>

    <!-- REVIEWS SECTION -->
    <section id="reviews" class="section reviews-section">
      <div class="container">
        <div class="section-header">
          <p class="kicker">Guest Reviews</p>
          <h2>What our guests say</h2>
        </div>

        <div class="reviews-wrapper">
          <button class="review-nav review-prev" (click)="previousReviews()" aria-label="Previous reviews">
            <span>‹</span>
          </button>

          <div class="review-grid">
            <article class="review-card" *ngFor="let review of displayedReviews()">
              <p class="review-badge">Google Review</p>
              <div class="review-rating">
                <span *ngFor="let i of [1, 2, 3, 4, 5]" class="star">★</span>
              </div>
              <p class="review-text">{{ review.text }}</p>
              <div class="review-footer">
                <p class="review-author">{{ review.name }}</p>
                <p class="review-meta">{{ review.date | timeAgo }}</p>
              </div>
            </article>
          </div>

          <button class="review-nav review-next" (click)="nextReviews()" aria-label="Next reviews">
            <span>›</span>
          </button>
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="section-header">
          <p class="kicker">Get in Touch</p>
          <h2>Start your journey today</h2>
        </div>

        <div class="contact-wrapper">
          <aside class="contact-info-box">
            <h3>Direct Contact</h3>

            <div class="contact-item">
              <p class="label">Contact Person</p>
              <p class="value">Thabang</p>
            </div>
            <div class="contact-item">
              <p class="label">Phone / WhatsApp</p>
              <p class="value">073 448 3958</p>
            </div>
            <div class="contact-item">
              <p class="label">Email</p>
              <p class="value">info@tb-tours.co.za</p>
            </div>
            <div class="contact-item">
              <p class="label">Location</p>
              <p class="value">Cape Town, South Africa</p>
            </div>

            <div class="contact-actions">
              <a
                class="btn btn-primary"
                href="https://wa.me/27734483958?text=Hi%20TB%20Tours%2C%20I'd%20like%20to%20enquire%20about%20a%20tour%20or%20transfer."
                target="_blank"
                rel="noopener noreferrer">
                WhatsApp Us
              </a>
              <a class="btn btn-outline-gold" href="tel:+27734483958">
                Call Us
              </a>
            </div>
          </aside>

          <div class="contact-form-box">
            <p class="kicker">Send us a message</p>
            <h3>Get in touch</h3>
            <p class="form-intro">Connect with us to book your journey or ask any questions.</p>

            <app-contact-form #contactForm [isSending]="isSending()" [requestedService]="requestedService()" (formSubmitted)="onContactFormSubmit($event)"></app-contact-form>

            <div *ngIf="toastMessage()" [class]="'toast toast-' + toastType()">
              <p>{{ toastMessage() }}</p>
              <button type="button" aria-label="Close" (click)="dismissToast()">
                <i class="bi bi-x" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ["./home.component.scss"]
})
export class HomePageComponent {
  readonly heroConfig = computed(() => SITE_CONTENT["home"].hero);
  readonly SITE_SERVICES = SITE_SERVICES;

  private bookingApi = inject(BookingApiService);

  private reviewIndex = signal(0);
  private destinationIndex = signal(0);
  private serviceIndex = signal(0);
  readonly isMobile = signal(typeof window !== 'undefined' && window.innerWidth <= 620);
  readonly isSending = signal(false);
  readonly toastMessage = signal("");
  readonly toastType = signal<"success" | "error" | "info">("info");
  readonly requestedService = signal<string>("");

  @ViewChild("contactForm") contactForm?: ContactFormComponent;

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth <= 620);
    }
  }

  private getItemsPerPage(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 980 ? 3 : 1;
    }
    return 3;
  }

  private getDestinationsPerPage(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 980 ? 1 : 3;
    }
    return 3;
  }

  private getServicesPerPage(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 980 ? 1 : 3;
    }
    return 3;
  }

  readonly displayedReviews = computed(() => {
    const index = this.reviewIndex();
    const itemsPerPage = this.getItemsPerPage();
    return GOOGLE_REVIEWS.slice(index, index + itemsPerPage);
  });

  readonly displayedServices = computed(() => {
    const index = this.serviceIndex();
    const itemsPerPage = this.getServicesPerPage();
    return SITE_SERVICES.slice(index, index + itemsPerPage);
  });

  readonly destinationCards = [
    {
      title: "Table Mountain",
      description: "See Cape Town from above.",
      image: "/images/Image (13).jpg"
    },
    {
      title: "Camps Bay Beach",
      description: "Golden sands and mountain views.",
      image: "/images/Image (6).jpg"
    },
    {
      title: "Cape Point",
      description: "Where two oceans meet.",
      image: "/images/Image (19).jpg"
    },
    {
      title: "Boulders Beach",
      description: "Meet Cape Town's famous penguins.",
      image: "/images/Image (18).jpg"
    },
    {
      title: "Bo-Kaap",
      description: "Cape Town City",
      image: "/images/DEst.jpg"
    },
    {
      title: "Hermanus",
      description: "Whale watching and coastal beauty.",
      image: "/images/Image (10).jpg"
    },
    {
      title: "Tsitsikama",
      description: "Ancient forests and dramatic cliffs.",
      image: "/images/Image (11).jpg"
    },
    {
      title: "Cape Winelands",
      description: "Slow afternoons among vineyards and estates.",
      image: "/images/Image (3).jpg"
    },
    {
      title: "Aquila Game Reserve",
      description: "Meet the Big Five in their natural habitat.",
      image: "/images/Game Reserve.jpg"
    }
  ];

  readonly displayedDestinations = computed(() => {
    const index = this.destinationIndex();
    const itemsPerPage = this.getDestinationsPerPage();
    return this.destinationCards.slice(index, index + itemsPerPage);
  });

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isMobile.set(window.innerWidth <= 620);
      });
    }
  }

  nextReviews() {
    const itemsPerPage = this.getItemsPerPage();
    const index = this.reviewIndex();
    if (index + itemsPerPage < GOOGLE_REVIEWS.length) {
      this.reviewIndex.set(index + itemsPerPage);
    } else {
      this.reviewIndex.set(0);
    }
  }

  previousReviews() {
    const itemsPerPage = this.getItemsPerPage();
    const index = this.reviewIndex();
    if (index - itemsPerPage >= 0) {
      this.reviewIndex.set(index - itemsPerPage);
    } else {
      this.reviewIndex.set(Math.max(0, GOOGLE_REVIEWS.length - itemsPerPage));
    }
  }

  nextDestinations() {
    const itemsPerPage = this.getDestinationsPerPage();
    const index = this.destinationIndex();
    if (index + itemsPerPage < this.destinationCards.length) {
      this.destinationIndex.set(index + itemsPerPage);
    } else {
      this.destinationIndex.set(0);
    }
  }

  previousDestinations() {
    const itemsPerPage = this.getDestinationsPerPage();
    const index = this.destinationIndex();
    if (index - itemsPerPage >= 0) {
      this.destinationIndex.set(index - itemsPerPage);
    } else {
      this.destinationIndex.set(Math.max(0, this.destinationCards.length - itemsPerPage));
    }
  }

  nextServices() {
    const itemsPerPage = this.getServicesPerPage();
    const index = this.serviceIndex();
    if (index + itemsPerPage < SITE_SERVICES.length) {
      this.serviceIndex.set(index + itemsPerPage);
    } else {
      this.serviceIndex.set(0);
    }
  }

  previousServices() {
    const itemsPerPage = this.getServicesPerPage();
    const index = this.serviceIndex();
    if (index - itemsPerPage >= 0) {
      this.serviceIndex.set(index - itemsPerPage);
    } else {
      this.serviceIndex.set(Math.max(0, SITE_SERVICES.length - itemsPerPage));
    }
  }

  onContactFormSubmit(formData: any) {
    this.isSending.set(true);

    this.bookingApi.sendContactMessage(formData)
      .pipe(
        finalize(() => this.isSending.set(false))
      )
      .subscribe({
        next: (response: any) => {
          this.toastType.set("success");
          this.toastMessage.set("Your message has been sent successfully! We'll get back to you soon.");
          this.contactForm?.resetForm();
          this.requestedService.set(""); // Clear the service request

          setTimeout(() => this.dismissToast(), 5000);
        },
        error: (err: any) => {
          this.toastType.set("error");
          this.toastMessage.set("Something went wrong. Please try again or contact us directly.");
        }
      });
  }

  requestService(serviceName: string): void {
    // Set the requested service
    this.requestedService.set(serviceName);

    // Navigate to contact section
    if (typeof window !== 'undefined') {
      window.location.hash = '#contact';

      // Scroll to contact section smoothly
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  dismissToast() {
    this.toastMessage.set("");
  }
}
