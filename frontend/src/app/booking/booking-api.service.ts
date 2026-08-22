import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";

export interface BookingPayload {
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  travelDate: string;
  passengers: number;
  serviceId: string;
  notes: string;
}

export interface BookingEmailStatus {
  status: "sent" | "failed" | "not_configured";
  error?: string;
  hint?: string;
  details?: string;
}

export interface PaymentConfirmationResponse {
  message: string;
  booking?: unknown;
  email?: BookingEmailStatus;
  alreadyConfirmed?: boolean;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

@Injectable({ providedIn: "root" })
export class BookingApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  createCheckoutSession(payload: BookingPayload) {
    return this.http.post<{ url: string }>(`${this.apiUrl}/payments/checkout-session`, payload);
  }

  confirmPaidBooking(sessionId: string) {
    return this.http.post<PaymentConfirmationResponse>(`${this.apiUrl}/bookings/confirm-payment`, { sessionId });
  }

  sendContactMessage(payload: ContactPayload) {
    return this.http.post<{ message: string; contact: { id: string; status: string } }>(`${this.apiUrl}/contact`, payload);
  }
}
