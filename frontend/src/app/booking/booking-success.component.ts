import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { BookingApiService } from "./booking-api.service";

@Component({
  selector: "app-booking-success",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="state container">
      <h1>Payment successful</h1>
      @if (isLoading()) {
        <p>Finalizing your booking and sending confirmations...</p>
      } @else {
        <p [class.warning]="isWarning()">{{ message() }}</p>
      }
      <a class="btn btn-primary" routerLink="/">Back to home</a>
    </section>
  `,
  styles: `
    .state { padding: 4rem 1rem; text-align: center; }
    h1 { margin-bottom: 0.6rem; text-transform: uppercase; }
    p { margin: 0 0 1rem; }
    .warning { color: #7a4a00; }
  `
})
export class BookingSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingApi = inject(BookingApiService);

  readonly isLoading = signal(true);
  readonly isWarning = signal(false);
  readonly message = signal("Your booking has been confirmed. We will contact you with trip details shortly.");

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get("session_id") || "";
    if (!sessionId) {
      this.isLoading.set(false);
      this.isWarning.set(true);
      this.message.set("Payment succeeded, but we could not verify the session for email confirmations.");
      return;
    }

    this.bookingApi.confirmPaidBooking(sessionId).subscribe({
      next: (response) => {
        const emailStatus = response.email?.status;
        if (emailStatus === "sent") {
          this.isWarning.set(false);
          this.message.set("Payment confirmed. Booking details were sent to the business and a confirmation email was sent to you.");
        } else if (emailStatus === "not_configured") {
          this.isWarning.set(true);
          this.message.set("Payment confirmed and booking saved. Email notifications are not configured yet.");
        } else if (emailStatus === "failed") {
          this.isWarning.set(true);
          this.message.set("Payment confirmed and booking saved, but email delivery failed. The team will follow up shortly.");
        } else {
          this.isWarning.set(false);
          this.message.set(response.message || "Payment confirmed. Your booking is now being processed.");
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isWarning.set(true);
        this.message.set("Payment succeeded, but confirmation processing is delayed. Please contact us if you do not receive confirmation shortly.");
      }
    });
  }
}
