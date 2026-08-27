import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

export type TrustStripVariant = "services" | "tours" | "default";

@Component({
  selector: "app-trust-strip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="'strip ' + variantClass">
      <div class="container strip-grid" [ngClass]="gridClass">
        <article *ngIf="showIntro" class="strip-item strip-intro">
          <h3>
            <i [class]="'bi ' + introIcon" aria-hidden="true"></i>
            Why Travel With <span>TB Tours (Pty)Ltd?</span>
          </h3>
          <p>{{ introText }}</p>
        </article>

        <article *ngFor="let item of items; trackBy: trackByTitle" [class]="itemClass">
          <i [class]="'bi ' + item.icon" aria-hidden="true"></i>
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </section>
  `,
  styleUrl: "./trust-strip.component.scss"
})
export class TrustStripComponent {
  @Input() items: TrustItem[] = [];
  @Input() variant: TrustStripVariant = "default";
  @Input() showIntro = true;
  @Input() introIcon = "bi-patch-check";
  @Input() introText = "We are committed to providing top-quality service, comfort and peace of mind.";

  get variantClass(): string {
    return this.variant !== "default" ? `${this.variant}-trust-strip` : "";
  }

  get gridClass(): string {
    return this.variant === "services" ? "services-strip-grid" : this.variant === "tours" ? "tours-strip-grid" : "";
  }

  get itemClass(): string {
    return `strip-item ${this.variant}-strip-item`;
  }

  trackByTitle(index: number, item: TrustItem): string {
    return item.title;
  }
}
