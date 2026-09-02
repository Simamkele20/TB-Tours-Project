import { Component, computed } from "@angular/core";
import { ContentPageComponent } from "../shared/content-page.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-services-page",
  standalone: true,
  imports: [ContentPageComponent],
  template: `
    <app-content-page
      [heroConfig]="heroConfig()"
      [cards]="cards()"
      [cardTitle]="cardTitle()"
      [cardSubtitle]="cardSubtitle()"
      [cardLayout]="'services'"
      [trustVariant]="'services'"
      [introIcon]="'bi-patch-check'"
      [introText]="introText">
    </app-content-page>
  `,
  styles: []
})
export class ServicesPageComponent {
  private readonly content = computed(() => SITE_CONTENT["services"]);

  readonly heroConfig = computed(() => this.content().hero);
  readonly cards = computed(() => this.content().cards);
  readonly cardTitle = computed(() => this.content().sectionTitle);
  readonly cardSubtitle = computed(() => this.content().sectionSubtitle);
  readonly introText = "Airport transfers, chauffeur services and custom day tours arranged around your schedule.";


}
