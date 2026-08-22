import { Component, computed, inject } from "@angular/core";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [HeroSectionComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => true">
    </app-hero-section>
  `,
  styles: []
})
export class HomePageComponent {
  readonly heroConfig = computed(() => SITE_CONTENT["home"].hero);
}
