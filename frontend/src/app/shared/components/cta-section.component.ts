import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

export type CTAVariant = "tours" | "default";

@Component({
  selector: "app-cta-section",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section [class]="'section container cta-block ' + variantClass">
      <p class="cta-kicker">Book your journey</p>
      <h2>{{ title }}</h2>
      <p class="cta-text">{{ text }}</p>

      <div class="cta-actions">
        <a routerLink="/contact" class="btn btn-primary">{{ actionLabel }}</a>
        <a href="tel:+27734483958" class="btn btn-outline-gold">Call Thabang · 073 448 3958</a>
      </div>

      <a class="cta-email" href="mailto:info@tb-tours.co.za">info@tb-tours.co.za</a>
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

  get actionLabel(): string {
    return this.variant === "tours" ? "Enquire About a Tour" : "Plan Your Journey";
  }
}
