import { Component, computed, inject } from "@angular/core";
import { PageLayoutComponent, type PageLayoutConfig } from "../../shared/components/page-layout.component";
import { PageDataService } from "../../services/page-data.service";

/**
 * Destinations page smart component
 * Responsibility: Load page data and pass to presentation component
 */
@Component({
  selector: "app-destinations-page",
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout [config]="pageConfig()"></app-page-layout>
  `,
  styles: []
})
export class DestinationsPageComponent {
  private readonly pageDataService = inject(PageDataService);

  readonly pageConfig = computed(() => this.pageDataService.getPageConfig("destinations"));
}
