import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { HomePageComponent } from "./home/home.component";
import { AboutPageComponent } from "./about/about.component";
import { ContactPageComponent } from "./contact/contact.component";
import { DestinationsPageComponent } from "./destinations/destinations.component";
import { AboutStoryPageComponent } from "./about/about-story.component";

@Component({
  selector: "app-page",
  standalone: true,
  imports: [
    CommonModule,
    HomePageComponent,
    AboutPageComponent,
    ContactPageComponent,
    DestinationsPageComponent,
    AboutStoryPageComponent
  ],
  template: `
    <ng-container [ngSwitch]="pageKey()">
      <app-home-page *ngSwitchCase="'home'"></app-home-page>
      <app-about-page *ngSwitchCase="'about'"></app-about-page>
      <app-about-story-page *ngSwitchCase="'about-story'"></app-about-story-page>
      <app-destinations-page *ngSwitchCase="'destinations'"></app-destinations-page>
      <app-contact-page *ngSwitchCase="'contact'"></app-contact-page>
      <app-home-page *ngSwitchDefault></app-home-page>
    </ng-container>
  `,
  styles: []
})
export class PageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  readonly pageKey = computed(() => ((this.routeData()["page"] as string) || "home"));
}
