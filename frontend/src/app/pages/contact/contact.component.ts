import { Component, computed, inject, signal, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { ContactFormComponent } from "../shared/contact-form.component";
import { PageDataService } from "../../services/page-data.service";
import { BookingApiService } from "../../booking/booking-api.service";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
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
      <section class="contact-section" id="contact-form">
        <aside class="contact-find-us">
          <h3>DIRECT CONTACT</h3>

          <div class="contact-info">
            <div class="contact-item">
              <p class="label">CONTACT PERSON</p>
              <p class="value">Thabang</p>
            </div>
            <div class="contact-item">
              <p class="label">PHONE / WHATSAPP</p>
              <p class="value">073 448 3958</p>
            </div>
            <div class="contact-item">
              <p class="label">EMAIL</p>
              <p class="value">info@tb-tours.co.za</p>
            </div>
            <div class="contact-item">
              <p class="label">LOCATION</p>
              <p class="value">Cape Town, South Africa</p>
            </div>
          </div>

          <div class="direct-actions">
            <a
              class="btn btn-primary"
              href="https://wa.me/27734483958?text=Hi%20TB%20Tours%2C%20I'd%20like%20to%20enquire%20about%20a%20tour%20or%20transfer."
              target="_blank"
              rel="noopener noreferrer">
              WHATSAPP US
            </a>
            <a class="btn btn-dark" href="tel:+27734483958">
              CALL US
            </a>
          </div>

        </aside>

        <div class="contact-content">
          <p class="kicker">ENQUIRY</p>
          <div class="contact-intro">
            <h3>Send us a message</h3>
            <p>Booking form to be connected. For now, please WhatsApp or email us directly.</p>
          </div>

          <app-contact-form #contactForm [isSending]="isSending()" (formSubmitted)="onContactFormSubmit($event)"></app-contact-form>

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
  private readonly pageDataService = inject(PageDataService);
  private readonly bookingApi = inject(BookingApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly googleAnalytics = inject(GoogleAnalyticsService);
  @ViewChild('contactForm') contactForm?: ContactFormComponent;

  readonly heroConfig = computed(() => {
    const config = this.pageDataService.getPageConfig("contact");
    return config?.hero || { eyebrow: '', title: '', accent: '', description: '' };
  });

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
          this.contactForm?.resetForm();
          this.showToast("Message sent successfully! We'll contact you soon.", "success");
          // Track booking inquiry in Google Analytics
          this.googleAnalytics.trackBookingInquiry({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          });
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
