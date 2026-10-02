import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
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
  imports: [CommonModule, RouterModule],
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
          <div class="package-card" *ngFor="let pkg of packages()">
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
export class PlanComponent implements OnInit {
  private readonly router = inject(Router);

  PLAN_PAGE_CONTENT = PLAN_PAGE_CONTENT;
  packages = signal<any[]>([]);
  heroConfig = computed(() => PLAN_PAGE_CONTENT.hero);

  ngOnInit() {
    this.loadPlanPackages();
  }

  private loadPlanPackages() {
    // Hardcoded plan packages - no API calls needed
    const staticPackages = [
      {
        id: 1,
        title: "2-DAY CAPE TOWN GETAWAY",
        price: "R3,200 PER VEHICLE",
        description: "A quick escape to explore Cape Town's highlights",
        duration: "2 Days",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Vehicle rental",
          "Guided tour of Table Mountain",
          "Lunch on Day 1"
        ],
        suggestedItinerary: [
          "Day 1: Table Mountain & City Bowl",
          "Day 2: Cape Point & Coastal Drive"
        ]
      },
      {
        id: 2,
        title: "3-DAY CAPE TOWN EXPERIENCE",
        price: "R5,500 PER VEHICLE",
        description: "Discover Cape Town's best attractions",
        duration: "3 Days",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Vehicle rental",
          "Guided tours",
          "All meals included"
        ],
        suggestedItinerary: [
          "Day 1: Table Mountain & City Bowl",
          "Day 2: Cape Point & Hermanus",
          "Day 3: Winelands Tour"
        ]
      },
      {
        id: 3,
        title: "5-DAY CAPE TOWN EXPLORER",
        price: "R9,500 PER VEHICLE",
        description: "In-depth exploration of Cape Town and surroundings",
        duration: "5 Days",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Vehicle rental",
          "Guided tours",
          "Accommodation",
          "All meals"
        ],
        suggestedItinerary: [
          "Day 1: Table Mountain & City Bowl",
          "Day 2: Cape Point & Constantia Nek",
          "Day 3: Winelands Experience",
          "Day 4: Hermanus & De Kelders",
          "Day 5: Penguins & Simonstown"
        ]
      },
      {
        id: 4,
        title: "7-DAY CAPE TOWN DISCOVERY",
        price: "R13,500 PER VEHICLE",
        description: "The ultimate Cape Town experience",
        duration: "7 Days",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Vehicle rental",
          "Guided tours",
          "Accommodation",
          "All meals",
          "Activity pass"
        ],
        suggestedItinerary: [
          "Day 1: Arrival & Table Mountain",
          "Day 2: Cape Point & Coastal Drive",
          "Day 3: Winelands Full Day",
          "Day 4: Hermanus Whale Watching",
          "Day 5: Franschhoek & Paarl",
          "Day 6: Boulders Beach & Simonstown",
          "Day 7: Free day or departure"
        ]
      },
      {
        id: 5,
        title: "COUPLES CAPE TOWN ESCAPE",
        price: "R4,500 PER VEHICLE",
        description: "Romantic getaway for two",
        duration: "2 Days",
        passengers: "UP TO 2 PASSENGERS",
        includes: [
          "Private driver",
          "Vehicle rental",
          "Romantic dinner",
          "Sunset cruise",
          "Champagne"
        ],
        suggestedItinerary: [
          "Day 1: Sunset at Table Mountain",
          "Day 2: Romantic Lunch & Wine Tasting"
        ]
      },
      {
        id: 6,
        title: "FAMILY CAPE TOWN PACKAGE",
        price: "R6,500 PER VEHICLE",
        description: "Fun activities for the whole family",
        duration: "3 Days",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Vehicle rental",
          "Family-friendly activities",
          "Picnic lunch",
          "Entertainment"
        ],
        suggestedItinerary: [
          "Day 1: Two Oceans Aquarium & Boulders Beach",
          "Day 2: Table Mountain & Picnic",
          "Day 3: Ostrich Farm & Wine Estate"
        ]
      },
      {
        id: 7,
        title: "BUSINESS TRAVEL PACKAGE",
        price: "R2,500/DAY PER VEHICLE",
        description: "Professional transport for business travelers",
        duration: "Custom",
        passengers: "UP TO 4 PASSENGERS",
        includes: [
          "Professional driver",
          "Wi-Fi equipped vehicle",
          "Airport transfers",
          "Meeting coordination",
          "Flexible scheduling"
        ],
        suggestedItinerary: [
          "Customized based on meetings",
          "Airport pickup & drop-off",
          "City navigation support"
        ]
      },
      {
        id: 8,
        title: "GROUP CAPE TOWN TRAVEL",
        price: "R5,500 PER VEHICLE",
        description: "Perfect for groups and corporate events",
        duration: "3-7 Days",
        passengers: "UP TO 12 PASSENGERS",
        includes: [
          "Multiple vehicles available",
          "Professional drivers",
          "Group coordination",
          "Custom itineraries",
          "Team-building activities"
        ],
        suggestedItinerary: [
          "Day 1: Team Bonding Activities",
          "Day 2: Adventure Activities",
          "Day 3: Cultural & Wine Experience",
          "Days 4-7: Customizable based on group"
        ]
      }
    ];

    this.packages.set(staticPackages);
  }

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
    // Navigate to plan booking page with tourId
    this.router.navigate(['/plan-booking'], {
      queryParams: {
        tourId: pkg.id
      }
    });
  }
}
