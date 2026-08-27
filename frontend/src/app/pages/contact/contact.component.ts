import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { ContactFormComponent } from "../shared/contact-form.component";
import { SITE_CONTENT } from "../../data/site-content";
import { BookingApiService } from "../../booking/booking-api.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, ContactFormComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false">
    </app-hero-section>

    <section class="contact-shell section container">
      <header class="contact-header">
        <h2>Plan your journey</h2>
        <p>Tell us your dates and what you would like to see - we will take care of the rest.</p>
      </header>

      <section class="contact-cards" aria-label="Contact quick options">
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-person-badge-fill" aria-hidden="true"></i></span>
          <h3>Contact Person</h3>
          <p>Thabang</p>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-telephone-fill" aria-hidden="true"></i></span>
          <h3>Phone / WhatsApp</h3>
          <p>073 448 3958</p>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-envelope-fill" aria-hidden="true"></i></span>
          <h3>Email</h3>
          <p>info@tb-tours.co.za</p>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i></span>
          <h3>Location</h3>
          <p>Cape Town, South Africa</p>
        </article>
      </section>

      <section class="contact-section" id="contact-form">
        <aside class="contact-find-us">
          <h3>Direct Contact</h3>
          <p>Prefer a quick booking conversation? Reach out directly and we can plan your route immediately.</p>

          <div class="direct-actions">
            <a
              class="btn btn-primary"
              href="https://wa.me/27734483958?text=Hi%20TB%20Tours%2C%20I'd%20like%20to%20enquire%20about%20a%20tour%20or%20transfer."
              target="_blank"
              rel="noopener noreferrer">
              <i class="bi bi-whatsapp" aria-hidden="true"></i>WhatsApp Us
            </a>
            <a class="btn btn-dark" href="tel:+27734483958">
              <i class="bi bi-telephone-fill" aria-hidden="true"></i>Call Us
            </a>
          </div>

        </aside>

        <div class="contact-content">
          <div class="contact-intro">
            <h3>Send us a message</h3>
          </div>

          <app-contact-form [isSending]="isSending()" (formSubmitted)="onContactFormSubmit($event)"></app-contact-form>

          <div *ngIf="toastMessage()" [class]="'toast toast-' + toastType()">
            <p>{{ toastMessage() }}</p>
            <button type="button" aria-label="Close" (click)="dismissToast()">
              <i class="bi bi-x" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </section>
    </section>
  `,
  styleUrl: "./contact.component.scss"
})
export class ContactPageComponent implements OnInit {
  private readonly bookingApi = inject(BookingApiService);
  private readonly route = inject(ActivatedRoute);

  readonly heroConfig = computed(() => SITE_CONTENT["contact"].hero);

  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  isSending = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  }

  onContactFormSubmit(formData: any): void {
    if (this.isSending()) {
      return;
    }

    this.isSending.set(true);
    this.bookingApi
      .sendContactMessage(formData)
      .pipe(finalize(() => this.isSending.set(false)))
      .subscribe({
        next: () => {
          this.showToast("Message sent successfully! We'll contact you soon.", "success");
        },
        error: (err) => {
          console.error("Contact form error:", err);
          this.showToast("Failed to send message right now. Please call us on 073 448 3958.", "error");
        }
      });
  }

  private showToast(message: string, type: "success" | "error"): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set("");
      this.toastTimer = null;
    }, 4500);
  }

  dismissToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toastMessage.set("");
  }
}
