import { Component, computed } from "@angular/core";
import { ContentPageComponent } from "../shared/content-page.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-tours-page",
  standalone: true,
  imports: [ContentPageComponent],
  template: `
    <app-content-page
      [heroConfig]="heroConfig()"
      [cards]="cards()"
      [cardTitle]="cardTitle()"
      [cardSubtitle]="cardSubtitle()"
      [cardLayout]="'tours'"
      [trustVariant]="'tours'"
      [introIcon]="'bi-patch-check'"
      [introText]="introText">
    </app-content-page>
  `,
  styles: []
})
export class ToursPageComponent {
  private readonly content = computed(() => SITE_CONTENT["tours"]);

  readonly heroConfig = computed(() => this.content().hero);
  readonly cards = computed(() => this.content().cards);
  readonly cardTitle = computed(() => this.content().sectionTitle);
  readonly cardSubtitle = computed(() => this.content().sectionSubtitle);
  readonly introText = "Private tours across the Peninsula, city and Winelands with flexible timing and local insight.";


}
