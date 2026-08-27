import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

export interface HeroConfig {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
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
      <div class="container hero-content">
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>
          {{ config.title }}
          <span>{{ config.accent }}</span>
        </h1>
        <p class="description">{{ config.description }}</p>

        <div class="hero-actions" *ngIf="showPhone()">
          <a href="tel:+27734483958" class="btn btn-primary btn-phone">
            <i class="bi bi-telephone-fill" aria-hidden="true"></i>073 448 3958
          </a>
          <a routerLink="/book" class="btn btn-outline-gold">
            <i class="bi bi-car-front-fill" aria-hidden="true"></i>{{ config.bookButtonLabel || 'Book your ride' }}
          </a>
        </div>

        <a *ngIf="!showPhone() && !(config?.hideButton)" routerLink="/book" class="btn btn-primary">
          <i class="bi bi-calendar-check" aria-hidden="true"></i>{{ config.bookButtonLabel || 'Book now' }}
        </a>
      </div>
    </section>
  `,
  styleUrl: "./hero-section.component.scss"
})
export class HeroSectionComponent {
  @Input() config!: HeroConfig;
  @Input() showPhone: () => boolean = () => false;

  readonly backgroundImage = "linear-gradient(90deg, rgba(6, 8, 12, 0.62), rgba(6, 8, 12, 0.22)), url(images/home-hero-mercedes-road.jpg)";
}
