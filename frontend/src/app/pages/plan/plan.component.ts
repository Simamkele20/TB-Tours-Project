import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { TourSelectionService } from "../../services/tour-selection.service";
import { PLAN_PAGE_CONTENT } from "../../data/site-content";

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
  imports: [CommonModule, RouterModule, HeroSectionComponent],
  template: `
    <!-- HERO SECTION WITH BACKGROUND IMAGE (Like Couriers) -->
    <section class="intro-image-section">
      <div class="intro-overlay"></div>
      <div class="container">
        <div class="intro-content">
          <p class="intro-eyebrow">YOUR JOURNEY, OUR PRIORITY</p>
          <h2 class="intro-title">PLAN YOUR<br><span>CAPE TOWN STAY</span></h2>
          <p class="intro-text">{{ PLAN_PAGE_CONTENT.introduction }}</p>
        </div>
      </div>
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
            <button class="package-book-btn" (click)="onBookPackage(pkg)">BOOK NOW</button>
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
  `,
  styleUrl: "./plan.component.scss"
})
export class PlanComponent {
  private readonly router = inject(Router);
  private readonly tourSelectionService = inject(TourSelectionService);

  PLAN_PAGE_CONTENT = PLAN_PAGE_CONTENT;

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

  onBookPackage(pkg: any) {
    // Navigate to plan booking page with package info
    this.router.navigate(['/plan-booking'], {
      queryParams: {
        package: pkg.title,
        price: pkg.price,
        description: pkg.description,
        duration: pkg.duration,
        capacity: pkg.passengers
      }
    });
  }
}
