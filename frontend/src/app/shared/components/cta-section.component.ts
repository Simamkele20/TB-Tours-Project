import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

export type CTAVariant = "tours" | "fleet" | "default";

@Component({
  selector: "app-cta-section",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section [class]="'section container cta-block ' + variantClass">
      <ng-container *ngIf="variant === 'tours'">
        <div class="tours-cta-left">
          <i class="bi bi-telephone-fill" aria-hidden="true"></i>
          <div>
            <p class="mini">Ready to explore?</p>
            <h3>Let's make your journey unforgettable.</h3>
          </div>
        </div>
        <div class="tours-cta-contact">
          <p><i class="bi bi-telephone-fill" aria-hidden="true"></i>073 448 3958</p>
          <p><i class="bi bi-envelope-fill" aria-hidden="true"></i>traveling.buddies@tb-tours.com</p>
        </div>
        <div class="tours-cta-action">
          <a routerLink="/book" class="btn btn-primary">
            <i class="bi bi-car-front-fill" aria-hidden="true"></i>Book your tour today
          </a>
          <p>Custom tours available on request.</p>
        </div>
      </ng-container>

      <ng-container *ngIf="variant === 'fleet'">
        <div class="fleet-cta-left">
          <i class="bi bi-telephone-fill" aria-hidden="true"></i>
          <div>
            <p class="mini">Ready to ride?</p>
            <h3>Book your ride with TB Tours today!</h3>
          </div>
        </div>
        <div class="fleet-cta-contact">
          <p><i class="bi bi-telephone-fill" aria-hidden="true"></i>073 448 3958</p>
          <p><i class="bi bi-envelope-fill" aria-hidden="true"></i>traveling.buddies@tb-tours.com</p>
        </div>
        <a routerLink="/book" class="btn btn-dark">
          <i class="bi bi-car-front-fill" aria-hidden="true"></i>Book now
        </a>
      </ng-container>

      <ng-container *ngIf="variant === 'default'">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ text }}</p>
        </div>
        <a routerLink="/book" class="btn btn-dark">
          <i class="bi bi-car-front-fill" aria-hidden="true"></i>Book your ride today
        </a>
      </ng-container>
    </section>
  `,
  styleUrl: "./cta-section.component.scss"
})
export class CtaSectionComponent {
  @Input() variant: CTAVariant = "default";
  @Input() title = "";
  @Input() text = "";

  get variantClass(): string {
    return this.variant !== "default" ? `${this.variant}-cta` : "";
  }
}
