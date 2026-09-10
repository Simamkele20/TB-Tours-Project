import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Tour {
  id: number;
  title: string;
  description: string;
  price: number;
  pricePerPerson: number | null;
  duration: string;
  maxPassengers: number;
  image: string;
  highlights: string[];
  included: string[];
}

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="booking-container">
      <div class="booking-header">
        <h1>Complete Your Booking</h1>
      </div>

      <div class="booking-content" *ngIf="tour">
        <!-- Tour Summary -->
        <div class="tour-summary">
          <img [src]="tour.image" [alt]="tour.title" class="tour-image" />
          <div class="tour-info">
            <h2>{{ tour.title }}</h2>
            <p class="duration">{{ tour.duration }}</p>
            <p class="description">{{ tour.description | slice: 0: 200 }}...</p>

            <div class="price-section">
              <div class="price-item" *ngIf="tour.pricePerPerson">
                <label>Price per person:</label>
                <span class="price">R{{ tour.pricePerPerson | number: '1.0-2' }}</span>
              </div>
              <div class="price-item" *ngIf="!tour.pricePerPerson">
                <label>Price per booking:</label>
                <span class="price">R{{ tour.price | number: '1.0-2' }}</span>
              </div>
              <div class="estimated-total">
                <label>Estimated total:</label>
                <span class="total">R{{ estimatedTotal | number: '1.0-2' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Form -->
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="booking-form">
          <h3>Booking Details</h3>

          <!-- Tour Date -->
          <div class="form-group">
            <label for="tourDate">Tour Date *</label>
            <input
              id="tourDate"
              type="date"
              formControlName="tourDate"
              [min]="todayDate"
              class="form-control"
            />
            <span class="error" *ngIf="isFieldInvalid('tourDate')">
              Please select a future date
            </span>
          </div>

          <!-- Number of Passengers -->
          <div class="form-group">
            <label for="numberOfPassengers">Number of Passengers *</label>
            <input
              id="numberOfPassengers"
              type="number"
              formControlName="numberOfPassengers"
              min="1"
              [max]="tour.maxPassengers"
              class="form-control"
            />
            <span class="error" *ngIf="isFieldInvalid('numberOfPassengers')">
              Please enter 1-{{ tour.maxPassengers }} passengers
            </span>
          </div>

          <!-- Special Requests -->
          <div class="form-group">
            <label for="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              formControlName="specialRequests"
              placeholder="Any special requirements? (e.g., dietary preferences, mobility needs)"
              class="form-control"
              rows="3"
            ></textarea>
          </div>

          <!-- Accommodation Preferences -->
          <div class="form-group">
            <label for="accommodationPreferences">Accommodation Preferences</label>
            <textarea
              id="accommodationPreferences"
              formControlName="accommodationPreferences"
              placeholder="Any accommodation preferences? (e.g., hotel location, amenities)"
              class="form-control"
              rows="3"
            ></textarea>
          </div>

          <!-- Passenger Details (if multi-passenger) -->
          <div class="form-section" *ngIf="bookingForm.get('numberOfPassengers')?.value > 1">
            <h3>Passenger Information</h3>
            <p class="info-text">Please provide details for each passenger:</p>

            <div class="passengers-list">
              <div
                class="passenger-card"
                *ngFor="let i of getPassengerIndices()"
              >
                <h4>Passenger {{ i + 1 }}</h4>
                <div class="form-group">
                  <label [for]="'passenger-' + i + '-name'">Full Name *</label>
                  <input
                    [id]="'passenger-' + i + '-name'"
                    type="text"
                    [value]="getPassengerName(i)"
                    (change)="setPassengerName(i, $event)"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-group">
                  <label [for]="'passenger-' + i + '-email'">Email *</label>
                  <input
                    [id]="'passenger-' + i + '-email'"
                    type="email"
                    [value]="getPassengerEmail(i)"
                    (change)="setPassengerEmail(i, $event)"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-group">
                  <label [for]="'passenger-' + i + '-phone'">Phone *</label>
                  <input
                    [id]="'passenger-' + i + '-phone'"
                    type="tel"
                    [value]="getPassengerPhone(i)"
                    (change)="setPassengerPhone(i, $event)"
                    class="form-control"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="payment-section">
            <h3>Payment</h3>
            <p class="payment-info">You will be redirected to Paystack to complete your secure payment.</p>
            <button
              type="submit"
              class="btn-submit"
              [disabled]="isSubmitting"
            >
              {{ isSubmitting ? 'Redirecting to Paystack...' : 'Pay & Confirm Booking' }}
            </button>
          </div>

          <p class="terms">
            By booking, you agree to our terms and conditions and confirm you have read our cancellation policy.
          </p>
        </form>

        <!-- CTA Section -->
        <div class="cta-section">
          <h2>Ready for this adventure?</h2>
          <p>Complete your booking and secure your spot today</p>
          <button
            type="button"
            class="cta-button"
            (click)="scrollToBookingButton()"
          >
            BOOK NOW
          </button>
        </div>
      </div>

      <div class="loading" *ngIf="!tour">
        <p>Loading tour details...</p>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
      min-height: 100vh;
      background: #0a1530;
      color: #fff;
      padding-top: 120px;
    }

    .booking-header {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      padding: 3rem 2rem;
      border-bottom: 2px solid #f2b112;
      text-align: center;
    }

    .booking-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #f2b112;
      font-weight: 700;
    }

    .booking-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .tour-summary {
      background: rgba(10, 21, 48, 0.5);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      backdrop-filter: blur(4px);
      height: fit-content;
      position: sticky;
      top: 140px;
    }

    .tour-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .tour-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #f2b112;
    }

    .duration {
      color: #b3c1d8;
      font-size: 0.9rem;
      margin: 0;
    }

    .description {
      color: #b3c1d8;
      font-size: 0.95rem;
      margin: 1rem 0;
      line-height: 1.5;
    }

    .price-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: #b3c1d8;
      font-size: 0.95rem;
    }

    .price {
      color: #f2b112;
      font-weight: 600;
    }

    .estimated-total {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .total {
      color: #f2b112;
      font-size: 1.2rem;
    }

    .booking-form {
      background: rgba(10, 21, 48, 0.5);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 2rem;
      backdrop-filter: blur(4px);
    }

    .booking-form h3 {
      margin: 0 0 1.5rem 0;
      color: #f2b112;
      font-size: 1.2rem;
      border-bottom: 2px solid rgba(242, 177, 18, 0.3);
      padding-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: #f2b112;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(10, 21, 48, 0.8);
      border: 1px solid rgba(242, 177, 18, 0.3);
      border-radius: 4px;
      color: #fff;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #f2b112;
      box-shadow: 0 0 8px rgba(242, 177, 18, 0.2);
    }

    textarea.form-control {
      resize: vertical;
    }

    .error {
      display: block;
      color: #ef5350;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-section {
      background: rgba(242, 177, 18, 0.05);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
    }

    .form-section h3 {
      margin: 0 0 0.5rem 0;
      color: #f2b112;
    }

    .info-text {
      color: #b3c1d8;
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .passengers-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .passenger-card {
      background: rgba(10, 21, 48, 0.3);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 6px;
      padding: 1rem;
    }

    .passenger-card h4 {
      margin: 0 0 1rem 0;
      color: #f2b112;
      font-size: 1rem;
    }

    .passenger-card .form-group {
      margin-bottom: 1rem;
    }

    .payment-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
    }

    .payment-section h3 {
      margin: 0 0 1.5rem 0;
      color: #f2b112;
      font-size: 1.2rem;
    }

    .payment-info {
      color: #b3c1d8;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(242, 177, 18, 0.1);
      border-left: 3px solid #f2b112;
      border-radius: 4px;
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: #f2b112;
      color: #0a1530;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background: #ffc94d;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .terms {
      color: #7a8a9e;
      font-size: 0.85rem;
      margin-top: 1rem;
      text-align: center;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #b3c1d8;
    }

    .cta-section {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 3rem 2rem;
      text-align: center;
      margin-top: 3rem;
      grid-column: 1 / -1;
    }

    .cta-section h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 2rem;
      font-weight: 400;
      color: #f2b112;
      margin: 0 0 1rem 0;
    }

    .cta-section p {
      color: #b3c1d8;
      font-size: 1.05rem;
      margin: 0 0 2rem 0;
    }

    .cta-button {
      background: linear-gradient(135deg, #f2b112, #ffc94d);
      color: #0f1419;
      border: none;
      padding: 1rem 3rem;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      background: linear-gradient(135deg, #ffc94d, #f2b112);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(242, 177, 18, 0.3);
    }

    @media (max-width: 1024px) {
      .booking-content {
        grid-template-columns: 1fr;
      }

      .tour-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .booking-container {
        padding-top: 100px;
      }

      .booking-header h1 {
        font-size: 1.5rem;
      }

      .booking-content {
        padding: 1rem;
        gap: 1rem;
      }

      .booking-form {
        padding: 1.5rem;
      }

      .passengers-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingPageComponent implements OnInit {
  bookingForm!: FormGroup;
  tour: Tour | null = null;
  estimatedTotal = 0;
  isSubmitting = false;
  todayDate = '';

  private paystackPublicKey = environment.paystackPublicKey;
  private bookingId: number | null = null;
  private paystackReference: string | null = null;
  private paystackAuthUrl: string | null = null;
  private passengerDetails: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const tourId = this.route.snapshot.paramMap.get('tourId');
    this.initializeForm();
    this.setTodayDate();
    if (tourId) {
      this.loadTour(parseInt(tourId));
    }
  }

  initializeForm() {
    this.bookingForm = this.fb.group({
      tourDate: ['', Validators.required],
      numberOfPassengers: [1, [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      accommodationPreferences: ['']
    });

    this.bookingForm.get('numberOfPassengers')?.valueChanges.subscribe(() => {
      this.updateEstimatedTotal();
    });
  }

  setTodayDate() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  loadTour(tourId: number) {
    const url = `${environment.apiBaseUrl}/tours/${tourId}`;
    this.http.get<{ data: Tour }>(url)
      .subscribe({
        next: (response) => {
          this.tour = response.data;
          this.cdr.detectChanges();
          this.updateEstimatedTotal();
        },
        error: (error) => {
          this.router.navigate(['/']);
        }
      });
  }

  updateEstimatedTotal() {
    if (!this.tour) {
      return;
    }
    const passengers = this.bookingForm.get('numberOfPassengers')?.value || 1;
    this.estimatedTotal = this.tour.pricePerPerson
      ? this.tour.pricePerPerson * passengers
      : this.tour.price;
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (!this.bookingForm.valid || !this.tour) {
      return;
    }

    this.isSubmitting = true;

    const bookingData = {
      tourId: this.tour.id,
      tourDate: this.bookingForm.get('tourDate')?.value,
      numberOfPassengers: this.bookingForm.get('numberOfPassengers')?.value,
      specialRequests: this.bookingForm.get('specialRequests')?.value,
      accommodationPreferences: this.bookingForm.get('accommodationPreferences')?.value,
      passengerDetails: this.passengerDetails
    };

    this.http.post<any>(`${environment.apiBaseUrl}/bookings`, bookingData)
      .subscribe({
        next: (response) => {
          this.bookingId = response.data.booking.id;
          this.paystackReference = response.data.paystackReference;
          this.paystackAuthUrl = response.data.paystackAuthorizationUrl;
          this.initializePaystackPayment();
        },
        error: (error) => {
          this.isSubmitting = false;
          alert('Failed to create booking. Please try again.');
        }
      });
  }

  initializePaystackPayment() {
    if (!this.paystackAuthUrl) {
      this.isSubmitting = false;
      return;
    }

    // Redirect to Paystack payment page
    window.location.href = this.paystackAuthUrl;
  }

  async handlePaymentSubmit() {
    // This method is no longer needed with Paystack as payment is handled via redirect
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPassengerIndices(): number[] {
    const count = this.bookingForm.get('numberOfPassengers')?.value || 1;
    return Array.from({ length: count - 1 }, (_, i) => i);
  }

  getPassengerName(index: number): string {
    return this.passengerDetails[index]?.name || '';
  }

  setPassengerName(index: number, event: any) {
    if (!this.passengerDetails[index]) {
      this.passengerDetails[index] = {};
    }
    this.passengerDetails[index].name = event.target.value;
  }

  getPassengerEmail(index: number): string {
    return this.passengerDetails[index]?.email || '';
  }

  setPassengerEmail(index: number, event: any) {
    if (!this.passengerDetails[index]) {
      this.passengerDetails[index] = {};
    }
    this.passengerDetails[index].email = event.target.value;
  }

  getPassengerPhone(index: number): string {
    return this.passengerDetails[index]?.phone || '';
  }

  setPassengerPhone(index: number, event: any) {
    if (!this.passengerDetails[index]) {
      this.passengerDetails[index] = {};
    }
    this.passengerDetails[index].phone = event.target.value;
  }

  scrollToBookingButton() {
    const button = document.querySelector('.btn-submit') as HTMLElement;
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      button.focus();
    }
  }
}
