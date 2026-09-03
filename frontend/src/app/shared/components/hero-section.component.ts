import { Component, Input } from "@angular/core";
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
  imports: [CommonModule],
  template: `
    <section class="hero" [class.hero-home]="showPhone()">
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
}
