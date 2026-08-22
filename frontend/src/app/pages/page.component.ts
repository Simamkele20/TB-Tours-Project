import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { HomePageComponent } from "./home/home.component";
import { AboutPageComponent } from "./about/about.component";
import { ServicesPageComponent } from "./services/services.component";
import { ToursPageComponent } from "./tours/tours.component";
import { FleetPageComponent } from "./fleet/fleet.component";
import { ContactPageComponent } from "./contact/contact.component";

@Component({
  selector: "app-page",
  standalone: true,
  imports: [
    CommonModule,
    HomePageComponent,
    AboutPageComponent,
    ServicesPageComponent,
    ToursPageComponent,
    FleetPageComponent,
    ContactPageComponent
  ],
  template: `
    <ng-container [ngSwitch]="pageKey()">
      <app-home-page *ngSwitchCase="'home'"></app-home-page>
      <app-about-page *ngSwitchCase="'about'"></app-about-page>
      <app-services-page *ngSwitchCase="'services'"></app-services-page>
      <app-tours-page *ngSwitchCase="'tours'"></app-tours-page>
      <app-fleet-page *ngSwitchCase="'fleet'"></app-fleet-page>
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
