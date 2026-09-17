import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { FAQS_PAGE_CONTENT } from "../../data/site-content";

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: "app-faqs",
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent],
  template: `
    <!-- HERO SECTION -->
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false"
      [isDestination]="false"
      [isCouriers]="false">
    </app-hero-section>

    <!-- FAQS SECTION -->
    <section class="section faqs-section">
      <div class="container">
        <h2 class="section-title">FREQUENTLY ASKED QUESTIONS</h2>
        <div class="faqs-container">
          <div class="faq-item" *ngFor="let faq of FAQS_PAGE_CONTENT.faqs; let i = index">
            <button
              class="faq-question"
              (click)="toggleFaq(i)"
              [class.active]="activeFaqIndex() === i"
              [attr.aria-expanded]="activeFaqIndex() === i"
              [attr.aria-controls]="'faq-answer-' + i">
              <span class="question-text">{{ faq.question }}</span>
              <span class="toggle-icon">
                <i [class.bi-chevron-down]="activeFaqIndex() !== i" [class.bi-chevron-up]="activeFaqIndex() === i" class="bi" aria-hidden="true"></i>
              </span>
            </button>
            <div
              class="faq-answer"
              [id]="'faq-answer-' + i"
              [class.show]="activeFaqIndex() === i"
              [@expandCollapse]="activeFaqIndex() === i ? 'expanded' : 'collapsed'">
              <div class="answer-content">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CLOSING SECTION -->
    <section class="section closing-section">
      <div class="container">
        <p class="closing-text">{{ FAQS_PAGE_CONTENT.closing }}</p>
        <div class="contact-prompt">
          <p>Can't find what you're looking for?</p>
          <a routerLink="/contact" class="contact-link">Contact TB Tours</a>
        </div>
      </div>
    </section>
  `,
  styleUrl: "./faqs.component.scss"
})
export class FaqsComponent {
  FAQS_PAGE_CONTENT = FAQS_PAGE_CONTENT;
  activeFaqIndex = signal<number | null>(null);

  heroConfig = computed(() => FAQS_PAGE_CONTENT.hero);

  toggleFaq(index: number): void {
    if (this.activeFaqIndex() === index) {
      this.activeFaqIndex.set(null);
    } else {
      this.activeFaqIndex.set(index);
    }
  }
}
