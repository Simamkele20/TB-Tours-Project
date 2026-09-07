import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { DESTINATIONS_DETAIL, type DestinationDetail } from "../../data/site-content";

@Component({
  selector: "app-destination-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent],
  template: `
    <ng-container *ngIf="destination(); else notFound">
      <app-hero-section
        *ngIf="heroConfig()"
        [config]="heroConfig()!"
        [showPhone]="() => false">
      </app-hero-section>

      <section class="destination-detail-container">
        <!-- Introduction Section -->
        <section class="section container destination-intro">
          <div class="intro-content">
            <p class="kicker">{{ destination()!.duration }} • {{ destination()!.tourType }}</p>
            <p class="description">{{ destination()!.description }}</p>
          </div>
        </section>

        <!-- Itinerary Section -->
        <section class="section container destination-itinerary">
          <h2>Itinerary</h2>
          <div class="itinerary-timeline">
            <div *ngFor="let stop of destination()!.itinerary" class="itinerary-stop">
              <div class="stop-time">{{ stop.time }}</div>
              <div class="stop-divider"></div>
              <div class="stop-content">
                <h3>{{ stop.title }}</h3>
                <p *ngIf="stop.description">{{ stop.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Highlights Section -->
        <section class="section container destination-highlights">
          <h2>Tour Highlights</h2>
          <div class="highlights-grid">
            <div *ngFor="let highlight of destination()!.highlights" class="highlight-item">
              <i class="bi bi-check-circle-fill"></i>
              <p>{{ highlight }}</p>
            </div>
          </div>
        </section>

        <!-- Included/Excluded Section -->
        <section class="section container destination-inclusions">
          <div class="inclusions-grid">
            <div class="inclusion-column">
              <h3>Included</h3>
              <ul>
                <li *ngFor="let item of destination()!.included">
                  <span class="check-icon">✓</span>
                  {{ item }}
                </li>
              </ul>
            </div>
            <div class="inclusion-column">
              <h3>Excluded</h3>
              <ul>
                <li *ngFor="let item of destination()!.excluded">
                  <span class="dash-icon">–</span>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Additional Info Section -->
        <section *ngIf="destination()!.bestTime || destination()!.customizeInfo || destination()!.pleaseNote" class="section container destination-additional">
          <div *ngIf="destination()!.bestTime" class="additional-block">
            <h3>Best Time to Visit</h3>
            <p>{{ destination()!.bestTime }}</p>
          </div>

          <div *ngIf="destination()!.customizeInfo" class="additional-block">
            <h3>Customise Your Tour</h3>
            <p>{{ destination()!.customizeInfo }}</p>
          </div>

          <div *ngIf="destination()!.pleaseNote" class="additional-block note-block">
            <p class="note-label">Please Note</p>
            <p>{{ destination()!.pleaseNote }}</p>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="section container destination-cta">
          <div class="cta-content">
            <h2>Ready for this adventure?</h2>
            <p>Request a quote and let us customize your journey</p>
            <button
              class="btn btn-primary"
              (click)="onRequestQuote()">
              REQUEST A QUOTE
            </button>
          </div>
        </section>
      </section>
    </ng-container>

    <ng-template #notFound>
      <section class="section container not-found">
        <h2>Destination Not Found</h2>
        <p>The destination you're looking for doesn't exist or has been moved.</p>
        <a [routerLink]="['/destinations']" class="btn btn-primary">Back to Destinations</a>
      </section>
    </ng-template>
  `,
  styleUrl: "./destinations-detail.component.scss"
})
export class DestinationDetailComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly slug = signal<string | null>(null);

  readonly destination = computed(() => {
    const currentSlug = this.slug();
    if (!currentSlug) return null;
    return DESTINATIONS_DETAIL[currentSlug] || null;
  });

  readonly heroConfig = computed(() => {
    const dest = this.destination();
    if (!dest) return null;
    return dest.hero;
  });

  constructor() {
    // Subscribe to route params to update slug
    this.activatedRoute.params.subscribe(params => {
      this.slug.set(params['slug'] || null);
    });
  }

  onRequestQuote(): void {
    const destination = this.destination();
    if (destination) {
      this.router.navigate([''], {
        queryParams: { destination: destination.title },
        fragment: 'contact'
      });
    }
  }
}
