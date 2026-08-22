import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { BookingApiService, type BookingPayload } from "./booking-api.service";

@Component({
  selector: "app-booking",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./booking.component.html",
  styleUrl: "./booking.component.scss"
})
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookingApi = inject(BookingApiService);

  readonly isLoading = signal(false);
  readonly error = signal("");

  readonly form = this.fb.nonNullable.group({
    fullName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required, Validators.minLength(7)]],
    pickupLocation: ["", [Validators.required, Validators.minLength(2)]],
    dropoffLocation: ["", [Validators.required, Validators.minLength(2)]],
    travelDate: ["", [Validators.required]],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(60)]],
    serviceId: ["airport-transfer", [Validators.required]],
    notes: [""]
  });

  submitAndPay() {
    this.error.set("");

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set("Please complete all required fields.");
      return;
    }

    this.isLoading.set(true);
    this.bookingApi
      .createCheckoutSession(this.form.getRawValue() as BookingPayload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ url }) => {
          window.location.href = url;
        },
        error: (err) => {
          this.error.set(
            err?.error?.error ||
              "Payment checkout is currently unavailable. Confirm STRIPE_SECRET_KEY in backend configuration."
          );
        }
      });
  }
}
