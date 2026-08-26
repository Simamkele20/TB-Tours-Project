import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

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
  imports: [RouterLink, CommonModule],
  template: `
    <section class="hero" [class.hero-home]="showPhone()" [style.background-image]="backgroundImage">
      <video
        *ngIf="showPhone()"
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        [attr.poster]="posterImage"
        aria-hidden="true">
        <source [src]="heroVideoSrc" type="video/mp4" />
      </video>

      <div class="container hero-content">
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>
          {{ config.title }}
          <span>{{ config.accent }}</span>
        </h1>
        <p class="hero-subtitle" *ngIf="showPhone()">Discover Cape Town</p>
        <p class="description">{{ config.description }}</p>

        <div class="hero-actions" *ngIf="showPhone()">
          <a routerLink="/contact" class="btn btn-outline-gold">
            Plan Your Journey
          </a>
          <a routerLink="/tours" class="btn btn-outline-light">
            Explore Our Tours
          </a>
        </div>

        <p class="hero-trust" *ngIf="showPhone()">Private · Professional · Personal</p>

        <a *ngIf="!showPhone() && !!config?.bookButtonLabel" routerLink="/contact" class="btn btn-primary">
          <i class="bi bi-envelope-fill" aria-hidden="true"></i>{{ config.bookButtonLabel }}
        </a>
      </div>
    </section>
  `,
  styleUrl: "./hero-section.component.scss"
})
export class HeroSectionComponent {
  @Input() config!: HeroConfig;
  @Input() showPhone: () => boolean = () => false;

  readonly heroVideoSrc = "https://tbtourscapetown.lovable.app/__l5e/assets-v1/4f82e84a-6f6a-4966-9a6e-37f3a0e4398f/hero-drive.mp4";

  get backgroundImage(): string {
    const image = this.config?.image || "images/home-hero-mercedes-road.jpg";
    return `linear-gradient(90deg, rgba(6, 8, 12, 0.62), rgba(6, 8, 12, 0.22)), url(${image})`;
  }

  get posterImage(): string {
    return this.config?.image || "images/home-hero-mercedes-road.jpg";
  }
}
