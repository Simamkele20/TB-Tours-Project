import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { TERMS_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-terms",
  standalone: true,
  imports: [CommonModule, HeroSectionComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false"
      [alignLeft]="true">
    </app-hero-section>

    <section class="terms-section section container">
      <div class="terms-meta">
        <p><strong>Effective Date:</strong> 11 July 2026</p>
        <p>Welcome to TB Tours. By booking our services or using our website, you agree to the following Terms & Conditions.</p>
      </div>

      <div class="terms-content">
        <div class="terms-section-item" *ngFor="let section of TERMS_CONTENT">
          <div class="terms-section-header">
            <h2>{{ section.number }}. {{ section.title }}</h2>
          </div>
          <div class="terms-section-body">
            <p *ngFor="let paragraph of section.content">{{ paragraph }}</p>
          </div>
        </div>
      </div>

      <div class="contact-footer">
        <h3>Contact Us</h3>
        <p>If you have any questions about these Terms & Conditions, please contact TB Tours using the contact information provided on our website.</p>
      </div>
    </section>
  `,
  styleUrl: "./terms.component.scss"
})
export class TermsComponent {
  TERMS_CONTENT = TERMS_CONTENT;

  heroConfig = computed(() => ({
    eyebrow: "Legal",
    title: "Terms &",
    accent: "Conditions",
    description: "Please read our terms and conditions carefully before using our services.",
    image: "images/camp-bay.jpg"
  }));
}
