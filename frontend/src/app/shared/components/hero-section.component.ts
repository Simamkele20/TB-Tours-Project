import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface HeroConfig {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image?: string;
  showPhone?: boolean;
  bookButtonLabel?: string;
  hideButton?: boolean;
}

@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero" [class.hero-home]="showPhone()" [class.hero-destination]="isDestination" [class.hero-couriers]="isCouriers" [class.hero-left]="alignLeft" [style.backgroundImage]="getBackgroundImage()">
      <div class="container hero-content">
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>
          {{ config.title }}
          <br *ngIf="showPhone()" />
          <span>{{ config.accent }}</span>
        </h1>
        <p class="hero-subtitle" *ngIf="showPhone()">Discover Cape Town</p>
        <p class="description">{{ config.description }}</p>

        <div class="hero-actions" *ngIf="showPhone()">
          <a href="#contact" class="btn btn-outline-gold">
            Plan Your Journey
          </a>
          <a href="#destinations" class="btn btn-outline-light">
            Explore Destinations
          </a>
          <a routerLink="/couriers" class="btn btn-outline-gold">
            Courier Service
          </a>
        </div>

        <p class="hero-trust" *ngIf="showPhone()">Private · Professional · Personal</p>

        <a *ngIf="!showPhone() && !!config?.bookButtonLabel" href="#contact" class="btn btn-primary">
          {{ config.bookButtonLabel }}
        </a>
      </div>
    </section>
  `,
  styleUrl: "./hero-section.component.scss"
})
export class HeroSectionComponent {
  @Input() config!: HeroConfig;
  @Input() showPhone: () => boolean = () => false;
  @Input() isDestination: boolean = false;
  @Input() alignLeft: boolean = false;
  @Input() isCouriers: boolean = false;

  getBackgroundImage(): string {
    // Only apply background image for destination pages (not home)
    if (!this.showPhone() && this.isDestination && this.config?.image) {
      return `linear-gradient(rgba(15, 20, 25, 0.7), rgba(15, 20, 25, 0.7)), url('${this.config.image}')`;
    }
    // For home page, let CSS handle it
    return '';
  }
}
