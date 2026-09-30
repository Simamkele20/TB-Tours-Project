import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { BOOKING_POLICY_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-booking-policy",
  standalone: true,
  imports: [CommonModule, HeroSectionComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false"
      [alignLeft]="true">
    </app-hero-section>

    <section class="policy-section section container">
      <div class="policy-meta">
        <p>TB Tours – Booking & Company Policy</p>
        <p>Our policies ensure a smooth, transparent, and professional booking experience. Please review the information below before making your booking.</p>
      </div>

      <div class="policy-content">
        <div class="policy-section-item" *ngFor="let section of BOOKING_POLICY_CONTENT">
          <div class="policy-section-header">
            <h2>{{ section.number }}. {{ section.title }}</h2>
          </div>
          <div class="policy-section-body">
            <p *ngFor="let paragraph of section.content">{{ paragraph }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: "./booking-policy.component.scss"
})
export class BookingPolicyComponent {
  BOOKING_POLICY_CONTENT = BOOKING_POLICY_CONTENT;

  heroConfig = computed(() => ({
    eyebrow: "Our Policies",
    title: "Booking &",
    accent: "Company Policy",
    description: "Transparent policies for a seamless booking experience with TB Tours.",
    image: "images/camp-bay.jpg"
  }));
}
