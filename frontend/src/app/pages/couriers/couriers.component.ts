import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { ContactFormComponent } from "../shared/contact-form.component";
import { BookingApiService } from "../../booking/booking-api.service";
import { COURIERS_PAGE_CONTENT, COURIERS_VEHICLES } from "../../data/site-content";
import { finalize } from "rxjs";

@Component({
  selector: "app-couriers",
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent, ContactFormComponent],
  template: `
    <!-- HERO SECTION -->
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false"
      [isDestination]="false"
      [isCouriers]="true">
    </app-hero-section>

    <!-- TAGLINE SECTION -->
    <section class="section tagline-section">
      <div class="container">
        <p class="tagline-text">{{ COURIERS_PAGE_CONTENT.tagline }}</p>
      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section class="section services-section">
      <div class="container">
        <h2 class="section-title">OUR COURIER SERVICES</h2>
        <div class="services-grid">
          <div class="service-card" *ngFor="let service of COURIERS_PAGE_CONTENT.services">
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING SECTION -->
    <section class="section pricing-section">
      <div class="container">
        <h2 class="section-title">OUR PRICING</h2>
        <p class="pricing-intro">Local deliveries from <strong>R60</strong></p>
        <div class="pricing-table">
          <div class="pricing-row" *ngFor="let tier of COURIERS_PAGE_CONTENT.pricing">
            <div class="pricing-distance">{{ tier.distance }}</div>
            <div class="pricing-price">{{ tier.price }}</div>
          </div>
        </div>
        <p class="pricing-note">Prices may vary depending on distance, parcel size, weight and delivery requirements.</p>
      </div>
    </section>

    <!-- WHY CHOOSE US SECTION -->
    <section class="section why-section">
      <div class="container">
        <h2 class="section-title">WHY CHOOSE TB TOURS COURIER?</h2>
        <ul class="benefits-list">
          <li *ngFor="let benefit of COURIERS_PAGE_CONTENT.whyChoose">
            <span class="checkmark">✓</span> {{ benefit }}
          </li>
        </ul>
      </div>
    </section>

    <!-- VEHICLES SECTION -->
    <section class="section vehicles-section">
      <div class="container">
        <h2 class="section-title">DELIVERY SERVICES</h2>
        <div class="vehicles-grid">
          <div class="vehicle-card" *ngFor="let vehicle of COURIERS_VEHICLES">
            <img [src]="vehicle.image" [alt]="vehicle.name" loading="lazy" />
            <h3>{{ vehicle.name }}</h3>
            <p class="vehicle-capacity">{{ vehicle.capacity }}</p>
            <p class="vehicle-specs">{{ vehicle.specs }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section class="section how-it-works-section">
      <div class="container">
        <h2 class="section-title">HOW IT WORKS</h2>
        <div class="steps-grid">
          <div class="step" *ngFor="let step of COURIERS_PAGE_CONTENT.steps">
            <div class="step-number">{{ step.number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BOOKING FORM SECTION -->
    <section class="section booking-section">
      <div class="container">
        <h2 class="section-title">BOOK A DELIVERY</h2>
        <p class="booking-intro">Need a parcel delivered? Contact TB Tours today for a quote.</p>

        <div class="courier-form-wrapper">
          <app-contact-form
            [isSending]="isSending()"
            [requestedService]="'Courier Service'"
            (formSubmitted)="onBookingFormSubmit($event)">
          </app-contact-form>
        </div>

        <div *ngIf="toastMessage()" [class]="'toast toast-' + toastType()">
          <p>{{ toastMessage() }}</p>
          <button type="button" aria-label="Close" (click)="dismissToast()">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>
  `,
  styleUrl: "./couriers.component.scss"
})
export class CouriersComponent {
  private readonly bookingApi = inject(BookingApiService);
  private readonly router = inject(Router);

  COURIERS_PAGE_CONTENT = COURIERS_PAGE_CONTENT;
  COURIERS_VEHICLES = COURIERS_VEHICLES;

  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  isSending = signal(false);

  heroConfig = computed(() => COURIERS_PAGE_CONTENT.hero);

  onBookingFormSubmit(formData: any) {
    this.isSending.set(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      type: "courier-booking"
    };

    this.bookingApi.sendContactMessage(payload)
      .pipe(finalize(() => this.isSending.set(false)))
      .subscribe({
        next: (response) => {
          this.toastMessage.set("✓ Booking request sent! We'll contact you shortly.");
          this.toastType.set("success");
          setTimeout(() => this.dismissToast(), 5000);
        },
        error: (error) => {
          console.error("Booking error:", error);
          this.toastMessage.set("Error sending booking request. Please try again.");
          this.toastType.set("error");
        }
      });
  }

  dismissToast() {
    this.toastMessage.set("");
  }
}
