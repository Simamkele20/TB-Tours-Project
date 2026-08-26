import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

export interface Card {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  meta?: string;
  ctaLabel?: string;
  passengers?: string;
  bags?: string;
  duration?: string;
}

export type CardGridLayout = "services" | "tours";

@Component({
  selector: "app-card-grid",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section container" [ngClass]="layoutClass">
      <h2>{{ title }}</h2>
      <p class="subtitle" *ngIf="subtitle">{{ subtitle }}</p>

      <div class="cards">
        <article *ngFor="let card of cards; trackBy: trackByTitle" class="card">
          <img *ngIf="card.image" class="card-image" [src]="card.image" [alt]="card.title" loading="lazy" />

          <div class="card-body">
            <span *ngIf="card.icon && (layout === 'services' || layout === 'tours')"
                  class="card-icon-badge" aria-hidden="true">
              <i [class]="'bi ' + card.icon"></i>
            </span>

            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>

            <div *ngIf="(layout === 'services' || layout === 'tours') && (card.duration || card.passengers)"
                 class="card-meta-row">
              <span *ngIf="card.duration">{{ card.duration }}</span>
              <span *ngIf="card.passengers">{{ card.passengers }}</span>
            </div>

            <small *ngIf="card.meta">{{ card.meta }}</small>

            <a *ngIf="card.ctaLabel && layout !== 'tours'" routerLink="/contact" class="card-link">
              {{ card.ctaLabel }}
            </a>
          </div>
        </article>
      </div>
    </section>
  `,
  styleUrl: "./card-grid.component.scss"
})
export class CardGridComponent {
  @Input() cards: Card[] = [];
  @Input() title = "";
  @Input() subtitle = "";
  @Input() layout: CardGridLayout = "services";

  get layoutClass(): string {
    return `${this.layout}-layout`;
  }

  trackByTitle(index: number, card: Card): string {
    return card.title;
  }
}
