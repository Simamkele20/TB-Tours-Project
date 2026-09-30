import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { YocoService } from '../../services/yoco.service';
import { ToastService } from '../../services/toast.service';
import { TourSelectionService } from '../../services/tour-selection.service';

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
          <div class="tour-info">
            <h2>{{ tour.title }}</h2>
            <p class="duration">{{ tour.duration }}</p>
            <p class="description">{{ tour.description | slice: 0: 200 }}...</p>

            <div class="price-section">
              <div class="price-item">
                <label>Price per person (1-3 people):</label>
                <span class="price">R{{ (tour.pricePerPerson || tour.price) | number: '1.0-2' }}</span>
              </div>
              <div class="price-item" *ngIf="bookingForm.get('numberOfPassengers')?.value > 3">
                <label>Extra person rate (4+ people):</label>
                <span class="price">R{{ getExtraPersonRate(tour.pricePerPerson || tour.price) | number: '1.0-2' }}</span>
              </div>
              <div class="estimated-total" *ngIf="bookingForm.get('numberOfPassengers')?.value > 3">
                <label>Estimated total for {{ bookingForm.get('numberOfPassengers')?.value }} {{ bookingForm.get('numberOfPassengers')?.value === 1 ? 'person' : 'people' }}:</label>
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
              class="form-control"
            />
            <span class="error" *ngIf="isFieldInvalid('numberOfPassengers')">
              Please enter at least 1 passenger
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

          <!-- Payment Section -->
          <div class="payment-section">
            <h3>Payment</h3>
            <p class="payment-info">You will be redirected to Yoco to complete your secure payment.</p>
            <button
              type="submit"
              class="btn-submit"
              [disabled]="isSubmitting"
            >
              {{ isSubmitting ? 'Redirecting to payment...' : 'Pay & Confirm Booking' }}
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
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
      font-size: 1rem;
    }

    .estimated-total label {
      color: #ccc;
      font-weight: 500;
    }

    .total {
      color: #f2b112;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .booking-form {
      background: rgba(10, 21, 48, 0.5);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 2rem;
      backdrop-filter: blur(4px);
      position: relative;
      z-index: 1;
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
      position: relative;
      z-index: 2;
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

    input[type="date"].form-control {
      position: relative;
      z-index: 10;
    }

    input[type="date"].form-control::-webkit-calendar-picker-indicator {
      filter: invert(1) brightness(1.2);
      cursor: pointer;
      z-index: 20;
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

  private yocoRedirectUrl: string | null = null;
  private bookingId: number | null = null;
  private passengerDetails: any[] = [];

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private yocoService = inject(YocoService);
  private toastService = inject(ToastService);
  protected authService = inject(AuthService);
  private tourSelectionService = inject(TourSelectionService);

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
    // First, check if tour was selected from service card (hardcoded data)
    const selectedTour = this.tourSelectionService.getSelectedTour();
    
    if (selectedTour && selectedTour.id === tourId) {
      console.log('[BOOKING PAGE] Using selected tour from service:', selectedTour.title);
      // Use the hardcoded tour data from selection service
      this.tour = {
        id: selectedTour.id,
        title: selectedTour.title,
        description: selectedTour.description,
        price: selectedTour.price,
        pricePerPerson: selectedTour.price,
        duration: '1-2 hours',
        maxPassengers: 6,
        image: '/images/camp-bay.jpg',
        highlights: selectedTour.highlights || ['Experience Cape Town'],
        included: selectedTour.included || ['Transport', 'Guide']
      };
      this.cdr.detectChanges();
      this.updateEstimatedTotal();
    } else {
      // Fall back to API if no selected tour or ID mismatch
      console.log('[BOOKING PAGE] Loading tour from API for ID:', tourId);
      const url = `${environment.apiBaseUrl}/tours/${tourId}`;
      this.http.get<{ data: Tour }>(url)
        .subscribe({
          next: (response) => {
            console.log('[BOOKING PAGE] ✓ Tour loaded from API:', response.data.title);
            this.tour = response.data;
            this.cdr.detectChanges();
            this.updateEstimatedTotal();
          },
          error: (error) => {
            console.error('[BOOKING PAGE] Failed to load tour:', error);
            // Create a default tour if API fails (for development)
            this.tour = {
              id: tourId,
              title: 'Tour ' + tourId,
              description: 'Tour booking form',
              price: 1000,
              pricePerPerson: 500,
              duration: 'Full Day',
              maxPassengers: 4,
              image: '/images/camp-bay.jpg',
              highlights: ['Experience Cape Town'],
              included: ['Transport', 'Guide'],
            };
            this.cdr.detectChanges();
            this.updateEstimatedTotal();
          }
        });
    }
  }

  updateEstimatedTotal() {
    if (!this.tour) {
      return;
    }
    const passengers = this.bookingForm.get('numberOfPassengers')?.value || 1;
    const basePrice = parseFloat((this.tour.pricePerPerson || this.tour.price).toString());
    
    console.log(`[BOOKING] Calculating total - passengers: ${passengers}, basePrice: ${basePrice}`);
    
    // Tiered pricing:
    // 1-3 people: flat rate (base price)
    // 4+ people: base price + (extra person price × extra people beyond 3)
    if (passengers <= 3) {
      this.estimatedTotal = basePrice;
    } else {
      // For 4+ people: base price + (extra person rate × number of extra people)
      const extraPersonRate = this.getExtraPersonRate(basePrice);
      const extraPeople = passengers - 3;
      this.estimatedTotal = basePrice + (extraPersonRate * extraPeople);
      console.log(`[BOOKING] 4+ calculation: ${basePrice} + (${extraPeople} × ${extraPersonRate}) = ${this.estimatedTotal}`);
    }
    
    this.cdr.detectChanges();
  }

  getExtraPersonRate(tourPrice: number): number {
    // Define extra person rates for 4+ people
    const price = parseFloat(tourPrice.toString());
    const extraPersonRates: { [key: number]: number } = {
      650: 350,      // 650 service: extra person R350
      2000: 600,     // 2000 service: extra person R600
      2500: 800,     // 2500 service: extra person R800
      3500: 800      // 3500 service: extra person R800
    };
    
    // Try exact match first
    if (extraPersonRates[price]) {
      return extraPersonRates[price];
    }
    
    // Try rounded match
    const rounded = Math.round(price);
    if (extraPersonRates[rounded]) {
      return extraPersonRates[rounded];
    }
    
    // Fallback to 50% of base price
    console.log(`[BOOKING] Using fallback rate for price: ${price}`);
    return Math.round(price * 0.5);
  }

  onSubmit() {
    if (!this.bookingForm.valid || !this.tour) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.toastService.error('Please log in to create a booking');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting = true;
    this.toastService.info('Creating your booking...');
    console.log('📋 Creating booking...');

    const bookingData = {
      tourId: this.tour.id,
      tourDate: this.bookingForm.get('tourDate')?.value,
      numberOfPassengers: this.bookingForm.get('numberOfPassengers')?.value,
      specialRequests: this.bookingForm.get('specialRequests')?.value,
      accommodationPreferences: this.bookingForm.get('accommodationPreferences')?.value,
      passengerDetails: this.passengerDetails
    };

    console.log('📨 Sending booking data:', bookingData);

    this.http.post<any>(`${environment.apiBaseUrl}/bookings`, bookingData)
      .subscribe({
        next: (response) => {
          console.log('✅ Booking created successfully:', response);

          // Get booking data
          const booking = response.data?.booking;
          if (!booking || !booking.id) {
            this.isSubmitting = false;
            this.toastService.error('Error: Booking ID not received from server');
            console.error('❌ Missing booking ID in response:', response);
            return;
          }

          this.bookingId = booking.id;
          this.toastService.success('Booking created! Redirecting to payment...');

          // Get user details from auth service
          const userEmail = this.authService.currentUser()?.email || booking.email;
          const firstName = this.authService.currentUser()?.firstName || booking.firstName || 'Customer';
          const lastName = this.authService.currentUser()?.lastName || booking.lastName || '';

          // Proceed to Yoco payment
          console.log('🔄 Initiating Yoco payment for booking:', booking.id);
          this.initiateYocoPayment(booking.id, userEmail, this.estimatedTotal, firstName, lastName);
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMsg = error?.error?.error || error?.message || 'Failed to create booking';
          console.error('❌ Booking creation error:', error);
          this.toastService.error(`Booking Error: ${errorMsg}`);
        }
      });
  }

  /**
   * Initiate Yoco payment for the booking
   */
  initiateYocoPayment(bookingId: number, email: string, amount: number, firstName: string, lastName: string) {
    // Validate required fields
    if (!email || !firstName || !lastName || !amount) {
      this.isSubmitting = false;
      this.toastService.error('Missing required payment information');
      console.error('❌ Missing payment fields:', { email, firstName, lastName, amount });
      return;
    }

    this.toastService.info('Preparing payment session...');
    console.log('🔄 Calling Yoco checkout endpoint with data:', {
      bookingId: `${bookingId} (${typeof bookingId})`,
      email,
      amount: `${amount} (${typeof amount})`,
      firstName,
      lastName
    });

    this.yocoService.createCheckout({
      bookingId: Number(bookingId),
      email,
      amount: Number(amount),
      firstName,
      lastName
    }).subscribe({
      next: (response) => {
        console.log('✅ Yoco checkout created:', response);

        if (response.success && response.data?.redirectUrl) {
          this.yocoRedirectUrl = response.data.redirectUrl;
          console.log('🔄 Redirecting to Yoco checkout:', this.yocoRedirectUrl);
          this.toastService.info('Redirecting to payment page...');
          this.redirectToYocoCheckout();
        } else {
          this.isSubmitting = false;
          this.toastService.error('Could not create payment session');
          console.error('❌ Invalid checkout response:', response);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        // Extract error message from various response formats
        let errorMsg = 'Failed to create payment session';

        if (error?.error?.details) {
          errorMsg = error.error.details;
        } else if (error?.error?.error) {
          errorMsg = error.error.error;
        } else if (error?.error?.errors && Array.isArray(error.error.errors)) {
          errorMsg = error.error.errors.map((e: any) => e.msg).join(', ');
        } else if (error?.message) {
          errorMsg = error.message;
        }

        console.error('❌ Yoco checkout error:', error);
        console.error('❌ Full error details:', error.error);
        console.error('❌ Status code:', error.status);
        this.toastService.error(`Payment Error: ${errorMsg}`);
      }
    });
  }

  /**
   * Redirect to Yoco checkout page
   */
  redirectToYocoCheckout() {
    if (!this.yocoRedirectUrl) {
      this.isSubmitting = false;
      this.toastService.error('No redirect URL provided');
      return;
    }

    console.log('💳 Redirecting to Yoco hosted checkout');
    // Redirect to Yoco's hosted payment page
    window.location.href = this.yocoRedirectUrl;
  }

  /**
   * Reset the booking form for new submission
   */
  resetBookingForm() {
    this.bookingForm.reset({
      tourDate: '',
      numberOfPassengers: 1,
      specialRequests: '',
      accommodationPreferences: ''
    });
    this.passengerDetails = [];
    this.isSubmitting = false;
    this.bookingId = null;
    this.yocoRedirectUrl = null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }



  scrollToBookingButton() {
    const button = document.querySelector('.btn-submit') as HTMLElement;
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      button.focus();
    }
  }
}
