import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { YocoService } from '../../services/yoco.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';

interface Tour {
  id: number;
  title: string;
  price: string;
  pricePerPerson: string;
  description: string;
  shortDescription: string;
  duration: string;
  maxPassengers: number;
  included: string[];
  image: string;
  tourType: string;
}

interface PlanPackage {
  id?: number;
  title: string;
  price: string;
  description: string;
  duration: string;
  passengers: string;
  includes: string[];
}

@Component({
  selector: 'app-plan-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="booking-container">
      <div class="booking-header">
        <h1>Complete Your Booking</h1>
      </div>

      <div class="booking-content" *ngIf="packageData() as pkg">
        <!-- Login Required Message -->
        <div class="login-required-message" *ngIf="!currentUser()">
          <div class="message-box">
            <h3>Login Required</h3>
            <p>Please log in to complete your booking. Your details will be automatically filled from your account.</p>
            <a routerLink="/auth/login" class="login-btn">Go to Login</a>
          </div>
        </div>

        <!-- Booking Form Only for Logged-in Users -->
        <ng-container *ngIf="currentUser() as user">
          <!-- Package Summary -->
          <div class="package-summary">
            <div class="package-info">
              <h2>{{ pkg.title }}</h2>
              <p class="duration">{{ pkg.duration }}</p>
              <p class="description">{{ pkg.description }}</p>

              <div class="price-section">
                <div class="price-item">
                  <label>Price:</label>
                  <span class="price">{{ pkg.price }}</span>
                </div>
                <div class="price-item">
                  <label>Capacity:</label>
                  <span class="capacity">{{ pkg.passengers }}</span>
                </div>
                <div class="price-item" *ngIf="bookingForm.get('numberOfPassengers')?.value > getPackageCapacity(pkg.passengers)">
                  <label>Extra passenger rate (beyond capacity):</label>
                  <span class="price">R700 per person</span>
                </div>
                <div class="estimated-total" *ngIf="bookingForm.get('numberOfPassengers')?.value > getPackageCapacity(pkg.passengers)">
                  <label>Estimated total for {{ bookingForm.get('numberOfPassengers')?.value }} {{ bookingForm.get('numberOfPassengers')?.value === 1 ? 'person' : 'people' }}:</label>
                  <span class="total">R{{ estimatedTotal() | number: '1.0-0' }}</span>
                </div>
              </div>

              <div class="includes-section">
                <h4>INCLUDES:</h4>
                <ul>
                  <li *ngFor="let item of pkg.includes">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="booking-form">
            <h3>Booking Details</h3>

            <!-- User Info Display (Pre-filled) -->
            <div class="user-info-section">
              <div class="info-item">
                <label>Full Name</label>
                <p class="info-value">{{ user.firstName }} {{ user.lastName }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p class="info-value">{{ user.email }}</p>
              </div>
              <div class="info-item">
                <label>Phone</label>
                <p class="info-value">{{ user.phone || 'Not provided' }}</p>
              </div>
            </div>

          <!-- Preferred Date -->
          <div class="form-group">
            <label for="preferredDate">Preferred Travel Date *</label>
            <input
              id="preferredDate"
              type="date"
              formControlName="preferredDate"
              [min]="todayDate"
              class="form-control"
            />
            <span class="error" *ngIf="isFieldInvalid('preferredDate')">
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
              placeholder="Any special requirements or preferences?"
              class="form-control"
            ></textarea>
          </div>

          <!-- Accommodation Preferences -->
          <div class="form-group">
            <label for="accommodation">Accommodation Preferences</label>
            <textarea
              id="accommodation"
              formControlName="accommodation"
              placeholder="Where are you staying? Any hotel/location preferences?"
              class="form-control"
            ></textarea>
          </div>

          <!-- Payment Section -->
          <div class="payment-section">
            <h3>Payment</h3>
            <p class="payment-info">You will be redirected to Yoco to complete your secure payment.</p>
            <button
              type="submit"
              class="payment-btn"
              [disabled]="!bookingForm.valid || isSubmitting()"
            >
              {{ isSubmitting() ? 'Processing...' : 'Proceed to Payment' }}
            </button>
          </div>
        </form>
        </ng-container>
      </div>
    </div>
  `,
  styleUrl: './plan-booking.component.scss'
})
export class PlanBookingComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly yocoService = inject(YocoService);
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);

  bookingForm!: FormGroup;
  todayDate = new Date().toISOString().split('T')[0];
  isSubmitting = signal(false);
  estimatedTotal = signal(0);

  packageData = signal<PlanPackage | null>(null);
  currentUser = computed(() => this.authService.currentUser());

  // Static plan packages
  private staticPackages = [
    {
      id: 1,
      title: "2-DAY CAPE TOWN GETAWAY",
      price: "4500",
      description: "A quick escape to explore Cape Town's highlights",
      duration: "2 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 2,
      title: "3-DAY CAPE TOWN EXPERIENCE",
      price: "6500",
      description: "Discover Cape Town's best attractions",
      duration: "3 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 3,
      title: "5-DAY CAPE TOWN EXPLORER",
      price: "10500",
      description: "In-depth exploration of Cape Town and surroundings",
      duration: "5 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 4,
      title: "7-DAY CAPE TOWN DISCOVERY",
      price: "15500",
      description: "The ultimate Cape Town experience",
      duration: "7 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 5,
      title: "COUPLES CAPE TOWN ESCAPE",
      price: "4500",
      description: "Romantic getaway for two",
      duration: "2 Days",
      passengers: "UP TO 2 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 6,
      title: "FAMILY CAPE TOWN PACKAGE",
      price: "6500",
      description: "Fun activities for the whole family",
      duration: "3 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 7,
      title: "BUSINESS TRAVEL PACKAGE",
      price: "3000",
      description: "Professional transport for business travelers",
      duration: "Custom",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    },
    {
      id: 8,
      title: "GROUP CAPE TOWN TRAVEL",
      price: "8500",
      description: "Perfect for groups and corporate events",
      duration: "3-7 Days",
      passengers: "UP TO 12 PASSENGERS",
      includes: [
        "Airport Transfers",
        "Professional driver",
        "Comfortable/Luxury vehicle",
        "Private tour"
      ]
    }
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadPackageData();
  }

  private loadPackageData() {
    const tourId = this.route.snapshot.queryParamMap.get('tourId');

    if (!tourId) {
      this.toastService.show('Package information not found', 'error');
      this.router.navigate(['/plan']);
      return;
    }

    // Get package from static data
    const tour = this.staticPackages.find(pkg => pkg.id === parseInt(tourId));

    if (!tour) {
      this.toastService.show('Package not found', 'error');
      this.router.navigate(['/plan']);
      return;
    }

    this.packageData.set({
      id: tour.id,
      title: tour.title,
      price: tour.price ? `R${tour.price} PER VEHICLE` : 'Contact for pricing',
      description: tour.description,
      duration: tour.duration,
      passengers: tour.passengers,
      includes: tour.includes || []
    });

    // Update estimated total whenever passenger count changes
    this.bookingForm.get('numberOfPassengers')?.valueChanges.subscribe(() => {
      this.updateEstimatedTotal();
    });

    // Initial estimated total calculation
    this.updateEstimatedTotal();
  }

  private initializeForm() {
    this.bookingForm = this.formBuilder.group({
      preferredDate: ['', Validators.required],
      numberOfPassengers: ['1', [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      accommodation: ['']
    });
  }

  private updateEstimatedTotal() {
    const pkg = this.packageData();
    if (!pkg) return;

    const basePrice = this.parsePrice(pkg.price);
    const numberOfPassengers = this.bookingForm.get('numberOfPassengers')?.value || 1;
    const capacity = this.getPackageCapacity(pkg.passengers);
    const total = this.calculateTotalWithExtra(basePrice, numberOfPassengers, capacity);

    this.estimatedTotal.set(total);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (!this.bookingForm.valid) {
      this.toastService.show('Please fill in all required fields', 'error');
      return;
    }

    const user = this.currentUser();
    if (!user) {
      this.toastService.show('Please log in to complete booking', 'error');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting.set(true);
    const tourId = this.packageData()?.id;

    if (!tourId) {
      this.toastService.show('Package information missing', 'error');
      this.isSubmitting.set(false);
      return;
    }

    // Calculate total with extra passenger charges
    const numberOfPassengers = this.bookingForm.get('numberOfPassengers')?.value;
    const basePrice = this.parsePrice(this.packageData()?.price || '0');
    const capacity = this.getPackageCapacity(this.packageData()?.passengers || '');
    const totalAmount = this.calculateTotalWithExtra(basePrice, numberOfPassengers, capacity);

    // Map form data to /bookings endpoint format
    const bookingPayload = {
      tourId: tourId,
      tourDate: this.bookingForm.get('preferredDate')?.value,
      numberOfPassengers: numberOfPassengers,
      specialRequests: this.bookingForm.get('specialRequests')?.value,
      accommodationPreferences: {
        accommodation: this.bookingForm.get('accommodation')?.value
      },
      passengerDetails: []
    };

    // Create booking using standard /bookings endpoint
    this.http.post(`${environment.apiBaseUrl}/bookings`, bookingPayload).subscribe({
      next: (response: any) => {
        const bookingId = response.data?.bookingId || response.data?.booking?.id;

        // Then proceed to Yoco checkout
        const checkoutPayload = {
          bookingId: bookingId,
          email: user.email,
          amount: totalAmount,
          firstName: user.firstName,
          lastName: user.lastName
        };

        this.http.post(`${environment.apiBaseUrl}/payments/yoco/checkout`, checkoutPayload).subscribe({
          next: (checkoutResponse: any) => {
            this.toastService.show('Redirecting to payment...', 'success');
            // Redirect to Yoco payment page if URL is provided
            if (checkoutResponse.data?.redirectUrl) {
              window.location.href = checkoutResponse.data.redirectUrl;
            } else {
              setTimeout(() => {
                this.router.navigate(['/plan']);
              }, 2000);
            }
          },
          error: (error) => {
            console.error('Checkout error:', error);
            this.toastService.show('Error initiating payment. Please try again.', 'error');
            this.isSubmitting.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.toastService.show('Error creating booking. Please try again.', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  private parsePrice(price: string | undefined): number {
    if (!price) return 0;
    const cleanPrice = String(price).replace(/[^\d.]/g, '');
    return parseFloat(cleanPrice) || 0;
  }

  getPackageCapacity(passengersText: string): number {
    // Extract capacity from text like "UP TO 4 PASSENGERS"
    const match = passengersText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 4; // Default to 4 if unable to parse
  }

  private calculateTotalWithExtra(basePrice: number, numberOfPassengers: number, capacity: number): number {
    // R700 per additional passenger beyond capacity
    const EXTRA_PASSENGER_RATE = 700;

    if (numberOfPassengers <= capacity) {
      return basePrice;
    }

    const extraPassengers = numberOfPassengers - capacity;
    const totalWithExtra = basePrice + (extraPassengers * EXTRA_PASSENGER_RATE);

    console.log(`[PLAN BOOKING] Base: R${basePrice}, Passengers: ${numberOfPassengers}, Capacity: ${capacity}, Extra: ${extraPassengers} × R${EXTRA_PASSENGER_RATE} = R${totalWithExtra}`);

    return totalWithExtra;
  }
}

