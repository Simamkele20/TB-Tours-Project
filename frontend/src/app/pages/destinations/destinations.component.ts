import { Component, computed } from "@angular/core";
import { ContentPageComponent } from "../shared/content-page.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-destinations-page",
  standalone: true,
  imports: [ContentPageComponent],
  template: `
    <app-content-page
      [heroConfig]="heroConfig()"
      [cards]="cards()"
      [cardTitle]="cardTitle()"
      [cardSubtitle]="cardSubtitle()"
      [cardLayout]="'tours'"
      [trustItems]="trustItems"
      [trustVariant]="'tours'">
    </app-content-page>
  `,
  styles: []
})
export class DestinationsPageComponent {
  private readonly content = computed(() => SITE_CONTENT["destinations"]);

  readonly heroConfig = computed(() => this.content().hero);
  readonly cards = computed(() => this.content().cards);
  readonly cardTitle = computed(() => this.content().sectionTitle);
  readonly cardSubtitle = computed(() => this.content().sectionSubtitle);

  readonly trustItems = [
    {
      icon: "bi-geo-alt-fill",
      title: "Cape Peninsula",
      description: "Dramatic coastline, mountain passes and iconic lookouts."
    },
    {
      icon: "bi-buildings-fill",
      title: "Cape Town City",
      description: "History, culture and local food in one compact route."
    },
    {
      icon: "bi-flower1",
      title: "Winelands",
      description: "Relaxed estates across Stellenbosch and Franschhoek."
    },
    {
      icon: "bi-stars",
      title: "Tailored Stops",
      description: "Your day shaped around your pace and interests."
    }
  ];
}
