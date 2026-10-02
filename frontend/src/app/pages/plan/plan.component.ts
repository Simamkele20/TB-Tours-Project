import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { ContactFormComponent } from "../shared/contact-form.component";
import { BookingApiService } from "../../booking/booking-api.service";
import { TourSelectionService } from "../../services/tour-selection.service";
import { PLAN_PAGE_CONTENT } from "../../data/site-content";
import { finalize } from "rxjs";

interface TourPackage {
  title: string;
  price: string;
  description: string;
  duration: string;
  passengers: string;
  includes: string[];
  suggestedItinerary: string[];
  exclusions?: string;
}

@Component({
  selector: "app-plan",
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent, ContactFormComponent],
  template: `
    <!-- HERO SECTION -->
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false"
      [isDestination]="false"
      [isCouriers]="false">
    </app-hero-section>

    <!-- INTRODUCTION SECTION -->
    <section class="section intro-section">
      <div class="container">
        <div class="intro-content">
          <p class="intro-text">{{ PLAN_PAGE_CONTENT.introduction }}</p>
        </div>
      </div>
    </section>

    <!-- IMAGE SECTION -->
    <section class="section image-section">
      <img src="/images/francesca-tirico-9G9vxsMzi18-unsplash.jpg" alt="Plan Your Cape Town Stay" class="section-image" />
    </section>

    <!-- PACKAGES SECTION -->
    <section class="section packages-section">
      <div class="container">
        <h2 class="section-title">CURATED TRAVEL PACKAGES</h2>
        <div class="packages-grid">
          <div class="package-card" *ngFor="let pkg of PLAN_PAGE_CONTENT.packages">
            <div class="package-header">
              <h3>{{ pkg.title }}</h3>
              <p class="package-price">{{ pkg.price }}</p>
              <p class="package-description">{{ pkg.description }}</p>
            </div>
            <div class="package-details">
              <div class="detail-group">
                <p class="detail-label">Duration:</p>
                <p class="detail-value">{{ pkg.duration }}</p>
              </div>
              <div class="detail-group">
                <p class="detail-label">Capacity:</p>
                <p class="detail-value">{{ pkg.passengers }}</p>
              </div>
            </div>
            <div class="package-includes">
              <p class="includes-title">INCLUDES:</p>
              <ul class="includes-list">
                <li *ngFor="let item of pkg.includes">{{ item }}</li>
              </ul>
            </div>
            <div class="package-itinerary">
              <p class="itinerary-title">SUGGESTED EXPERIENCE:</p>
              <ul class="itinerary-list">
                <li *ngFor="let day of pkg.suggestedItinerary">{{ day }}</li>
              </ul>
            </div>
            <p class="package-note" *ngIf="pkg.exclusions">{{ pkg.exclusions }}</p>
            <button class="package-pay-btn" (click)="onPayPackage(pkg)">GET A QUOTE</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOM QUOTE SECTION -->
    <section class="section custom-section">
      <div class="container">
        <div class="custom-content">
          <h2>BUILD YOUR OWN CAPE TOWN STAY</h2>
          <p class="custom-label">CUSTOM QUOTE</p>
          <p class="custom-description">{{ PLAN_PAGE_CONTENT.customInfo }}</p>
          <div class="custom-requirements">
            <div class="requirement" *ngFor="let req of PLAN_PAGE_CONTENT.customRequirements">
              <span class="bullet">•</span> {{ req }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ADD-ONS SECTION -->
    <section class="section addons-section">
      <div class="container">
        <h2 class="section-title">POPULAR ADD-ONS</h2>
        <p class="addons-intro">{{ PLAN_PAGE_CONTENT.addonsInfo }}</p>
        <div class="addons-grid">
          <div class="addon-item" *ngFor="let addon of PLAN_PAGE_CONTENT.addons">
            <span class="addon-bullet">•</span> {{ addon }}
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US SECTION -->
    <section class="section why-section">
      <div class="container">
        <h2 class="section-title">WHAT MAKES TB TOURS DIFFERENT?</h2>
        <div class="why-grid">
          <div class="why-card" *ngFor="let item of PLAN_PAGE_CONTENT.whyChoose">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- IMPORTANT INFO SECTION -->
    <section class="section info-section">
      <div class="container">
        <h2 class="section-title">IMPORTANT INFORMATION</h2>
        <ul class="info-list">
          <li *ngFor="let info of PLAN_PAGE_CONTENT.importantInfo">
            {{ info }}
          </li>
        </ul>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section class="section contact-cta-section">
      <div class="container">
        <div class="contact-content">
          <h2>READY TO PLAN YOUR CAPE TOWN STAY?</h2>
          <p>{{ PLAN_PAGE_CONTENT.contactCTA }}</p>
        </div>

        <div class="plan-form-wrapper">
          <app-contact-form
            [isSending]="isSending()"
            [requestedService]="'Plan Your Stay'"
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
  styleUrl: "./plan.component.scss"
})
export class PlanComponent {
  private readonly bookingApi = inject(BookingApiService);
  private readonly router = inject(Router);
  private readonly tourSelectionService = inject(TourSelectionService);

  PLAN_PAGE_CONTENT = PLAN_PAGE_CONTENT;

  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  isSending = signal(false);

  heroConfig = computed(() => PLAN_PAGE_CONTENT.hero);

  onPayPackage(pkg: any) {
    // Navigate to contact page for quote
    this.router.navigate(['/contact'], { 
      queryParams: { 
        package: pkg.title,
        price: pkg.price 
      }
    });
  }

  onBookingFormSubmit(formData: any) {
    this.isSending.set(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      type: "plan-booking"
    };

    this.bookingApi.sendContactMessage(payload)
      .pipe(finalize(() => this.isSending.set(false)))
      .subscribe({
        next: () => {
          this.toastMessage.set("Thank you! We've received your request. We'll contact you soon to plan your Cape Town stay.");
          this.toastType.set("success");
          setTimeout(() => this.dismissToast(), 5000);
        },
        error: () => {
          this.toastMessage.set("Sorry, something went wrong. Please try again or contact us directly.");
          this.toastType.set("error");
          setTimeout(() => this.dismissToast(), 5000);
        }
      });
  }

  dismissToast() {
    this.toastMessage.set("");
  }
}
