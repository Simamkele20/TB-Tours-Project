import { Component, Input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroSectionComponent } from "./hero-section.component";
import { CardGridComponent } from "./card-grid.component";
import { TrustStripComponent } from "./trust-strip.component";
import { CtaSectionComponent } from "./cta-section.component";
import type { HeroConfig } from "./hero-section.component";
import type { Card, CardGridLayout } from "./card-grid.component";
import type { TrustItem } from "./trust-strip.component";

export interface PageLayoutConfig {
  // Hero section
  hero?: HeroConfig;

  // Card grid section
  cards?: Card[];
  cardTitle?: string;
  cardSubtitle?: string;
  cardLayout?: CardGridLayout;

  // Trust strip section
  trustItems?: TrustItem[];
  trustVariant?: "services" | "tours" | "default";
  trustShowIntro?: boolean;
  trustIntroIcon?: string;
  trustIntroText?: string;

  // CTA section
  ctaTitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaLabel?: string;
}

/**
 * Master page layout component using smart/presentation pattern.
 * All pages use this single component for consistent, maintainable structure.
 *
 * Benefits:
 * - Single source of truth for page layout
 * - Easy to update design across all pages
 * - Eliminates duplicate template markup
 * - Maintains semantic HTML and accessibility
 */
@Component({
  selector: "app-page-layout",
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    CardGridComponent,
    TrustStripComponent,
    CtaSectionComponent
  ],
  template: `
    <!-- Hero Section -->
    <app-hero-section
      *ngIf="config?.hero"
      [config]="config.hero"
      [showPhone]="() => false">
    </app-hero-section>

    <!-- Card Grid Section -->
    <app-card-grid
      *ngIf="hasCards()"
      [cards]="config?.cards || []"
      [title]="config?.cardTitle || ''"
      [subtitle]="config?.cardSubtitle || ''"
      [layout]="config?.cardLayout || 'services'">
    </app-card-grid>

    <!-- Trust Strip Section -->
    <app-trust-strip
      *ngIf="hasTrustItems()"
      [items]="config?.trustItems || []"
      [variant]="config?.trustVariant || 'default'"
      [showIntro]="config?.trustShowIntro !== false"
      [introIcon]="config?.trustIntroIcon || 'bi-patch-check'"
      [introText]="config?.trustIntroText || ''">
    </app-trust-strip>

    <!-- CTA Section -->
    <app-cta-section
      *ngIf="hasCTA()"
      [title]="config?.ctaTitle || ''"
      [text]="config?.ctaText || ''"
      [buttonLabel]="config?.ctaLabel || 'Get Started'"
      [buttonLink]="config?.ctaLink || '/contact'">
    </app-cta-section>
  `,
  styles: []
})
export class PageLayoutComponent {
  @Input() config: PageLayoutConfig | null = null;

  hasCards = computed(() => this.config?.cards && this.config.cards.length > 0);
  hasTrustItems = computed(() => this.config?.trustItems && this.config.trustItems.length > 0);
  hasCTA = computed(() => this.config?.ctaTitle && this.config.ctaText);
}
