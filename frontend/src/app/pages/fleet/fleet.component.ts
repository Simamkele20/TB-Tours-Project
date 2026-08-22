import { Component, computed } from "@angular/core";
import { ContentPageComponent } from "../shared/content-page.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-fleet-page",
  standalone: true,
  imports: [ContentPageComponent],
  template: `
    <app-content-page
      [heroConfig]="heroConfig()"
      [cards]="cards()"
      [cardTitle]="cardTitle()"
      [cardSubtitle]="cardSubtitle()"
      [cardLayout]="'fleet'"
      [trustItems]="trustItems"
      [trustVariant]="'fleet'"
      [introIcon]="'bi-patch-check'"
      [introText]="introText"
      [ctaVariant]="'fleet'">
    </app-content-page>
  `,
  styles: []
})
export class FleetPageComponent {
  private readonly content = computed(() => SITE_CONTENT["fleet"]);

  readonly heroConfig = computed(() => this.content().hero);
  readonly cards = computed(() => this.content().cards);
  readonly cardTitle = computed(() => this.content().sectionTitle);
  readonly cardSubtitle = computed(() => this.content().sectionSubtitle);
  readonly introText = "We are committed to providing top-quality service, comfort and peace of mind.";

  readonly trustItems = [
    {
      icon: "bi-shield-check",
      title: "Safety first",
      description: "All our vehicles are fully licensed, insured and regularly maintained."
    },
    {
      icon: "bi-stars",
      title: "Comfort guaranteed",
      description: "Clean, modern vehicles with air-conditioning and ample space."
    },
    {
      icon: "bi-clock-history",
      title: "On time, every time",
      description: "We value your time and are committed to punctuality."
    },
    {
      icon: "bi-people-fill",
      title: "Professional drivers",
      description: "Experienced, friendly and knowledgeable drivers at your service."
    }
  ];
}
