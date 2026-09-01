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
      [cardLayout]="'destinations'"
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

  readonly trustItems = [];
}
