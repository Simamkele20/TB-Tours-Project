import { Component, computed, inject } from "@angular/core";
import { PageLayoutComponent, type PageLayoutConfig } from "../../shared/components/page-layout.component";
import { PageDataService } from "../../services/page-data.service";

/**
 * Tours page smart component
 * Responsibility: Load page data and pass to presentation component
 */
@Component({
  selector: "app-tours-page",
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout [config]="pageConfig()"></app-page-layout>
  `,
  styles: []
})
export class ToursPageComponent {
  private readonly pageDataService = inject(PageDataService);

  readonly pageConfig = computed(() => this.pageDataService.getPageConfig("tours"));
}
