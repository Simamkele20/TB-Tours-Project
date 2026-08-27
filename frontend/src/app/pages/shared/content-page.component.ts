import { Component, Input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { CardGridComponent } from "../../shared/components/card-grid.component";
import { TrustStripComponent, type TrustItem } from "../../shared/components/trust-strip.component";
import { type Card, type CardGridLayout } from "../../shared/components/card-grid.component";
import { type HeroConfig } from "../../shared/components/hero-section.component";

@Component({
  selector: "app-content-page",
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, CardGridComponent, TrustStripComponent],
  template: `
    <app-hero-section
      [config]="heroConfig"
      [showPhone]="() => false">
    </app-hero-section>

    <app-card-grid
      *ngIf="cards && cards.length"
      [cards]="cards"
      [title]="cardTitle"
      [subtitle]="cardSubtitle"
      [layout]="cardLayout">
    </app-card-grid>

    <app-trust-strip
      *ngIf="trustItems && trustItems.length"
      [items]="trustItems"
      [variant]="trustVariant"
      [showIntro]="false"
      [introIcon]="introIcon"
      [introText]="introText">
    </app-trust-strip>
  `,
  styles: []
})
export class ContentPageComponent {
  @Input() heroConfig!: HeroConfig;
  @Input() cards: Card[] = [];
  @Input() cardTitle = "";
  @Input() cardSubtitle = "";
  @Input() cardLayout: CardGridLayout = "services";
  @Input() trustItems: TrustItem[] = [];
  @Input() trustVariant: "services" | "tours" | "default" = "default";
  @Input() introIcon = "bi-patch-check";
  @Input() introText = "";
}
