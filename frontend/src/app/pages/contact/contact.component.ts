import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { ContactFormComponent } from "../shared/contact-form.component";
import { SITE_CONTENT } from "../../data/site-content";
import { BookingApiService } from "../../booking/booking-api.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent, ContactFormComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false">
    </app-hero-section>

    <section class="contact-shell section container">
      <header class="contact-header">
        <h2>Get in touch</h2>
        <p>We'd love to hear from you. Reach out to us using any of the options below.</p>
      </header>

      <section class="contact-cards" aria-label="Contact quick options">
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-telephone-fill" aria-hidden="true"></i></span>
          <h3>Call us</h3>
          <p>073 448 3958</p>
          <small>Available 24/7</small>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-envelope-fill" aria-hidden="true"></i></span>
          <h3>Email us</h3>
          <p>traveling.buddies@tb-tours.com</p>
          <small>We reply within 24 hours</small>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i></span>
          <h3>Location</h3>
          <p>Cape Town, Western Cape</p>
          <small>South Africa</small>
        </article>
        <article class="contact-card">
          <span class="icon-wrap"><i class="bi bi-whatsapp" aria-hidden="true"></i></span>
          <h3>Whatsapp</h3>
          <p>073 448 3958</p>
          <small>Quick responses</small>
        </article>
      </section>

      <section class="contact-section">
        <div class="contact-content">
          <div class="contact-intro">
            <h3>Send us a message</h3>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>

          <app-contact-form [isSending]="isSending()" (formSubmitted)="onContactFormSubmit($event)"></app-contact-form>

          <div *ngIf="toastMessage()" [class]="'toast toast-' + toastType()">
            <p>{{ toastMessage() }}</p>
            <button type="button" aria-label="Close" (click)="dismissToast()">
              <i class="bi bi-x" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <aside class="contact-find-us">
          <h3>Find us</h3>
          <p>We are located in the heart of Cape Town, ready to take you wherever you need to go.</p>
          <div class="map-wrap">
            <iframe
              title="TB Tours map"
              src="https://www.google.com/maps?q=Cape%20Town%2C%20Western%20Cape&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

          <div class="hours">
            <i class="bi bi-clock" aria-hidden="true"></i>
            <div>
              <h4>Business hours</h4>
              <p>Monday - Sunday</p>
              <small>24 Hours a Day / 7 Days a Week</small>
            </div>
          </div>
        </aside>
      </section>

      <article class="contact-bottom-cta">
        <div class="contact-bottom-left">
          <i class="bi bi-telephone-fill" aria-hidden="true"></i>
          <div>
            <p class="mini">Ready to book your ride?</p>
            <h3>We're just one call away!</h3>
            <p>Safe, reliable and comfortable transport whenever you need it.</p>
          </div>
        </div>
        <a routerLink="/book" class="btn btn-primary">
          Book your ride now <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </a>
      </article>
    </section>
  `,
  styleUrl: "./contact.component.scss"
})
export class ContactPageComponent {
  private readonly bookingApi = inject(BookingApiService);

  readonly heroConfig = computed(() => SITE_CONTENT["contact"].hero);

  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  isSending = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

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
