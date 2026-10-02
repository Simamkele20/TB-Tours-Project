import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { YocoService } from '../../services/yoco.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';

interface PlanPackage {
  title: string;
  price: string;
  description: string;
  duration: string;
  passengers: string;
  includes: string[];
}

interface Vehicle {
  id: string;
  name: string;
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

          <!-- Vehicle Selection -->
          <div class="form-group">
            <label for="vehicle">Select Vehicle *</label>
            <select
              id="vehicle"
              formControlName="vehicle"
              class="form-control"
            >
              <option value="" disabled selected>Choose a vehicle</option>
              <option *ngFor="let vehicle of vehicles" [value]="vehicle.id">
                {{ vehicle.name }}
              </option>
            </select>
            <span class="error" *ngIf="isFieldInvalid('vehicle')">
              Please select a vehicle
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

  packageData = signal<PlanPackage | null>(null);
  currentUser = computed(() => this.authService.currentUser());

  vehicles: Vehicle[] = [
    { id: 'mercedes-vito', name: 'Mercedes Benz Vito Van (Up to 8 passengers)' },
    { id: 'mercedes-c-class', name: 'Mercedes Benz C Class (Up to 4 passengers)' },
    { id: 'honda-ballade', name: 'Honda Ballade (Up to 4 passengers)' },
    { id: 'hyundai-elantra', name: 'Hyundai Elantra (Up to 4 passengers)' }
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadPackageData();
  }

  private loadPackageData() {
    const packageName = this.route.snapshot.queryParamMap.get('package');
    const packagePrice = this.route.snapshot.queryParamMap.get('price');
    const packageDesc = this.route.snapshot.queryParamMap.get('description') || '';
    const packageDuration = this.route.snapshot.queryParamMap.get('duration') || '';
    const packageCapacity = this.route.snapshot.queryParamMap.get('capacity') || '';

    if (packageName) {
      this.packageData.set({
        title: packageName,
        price: packagePrice || 'Contact for pricing',
        description: packageDesc,
        duration: packageDuration,
        passengers: packageCapacity,
        includes: []
      });
    }
  }

  private initializeForm() {
    this.bookingForm = this.formBuilder.group({
      preferredDate: ['', Validators.required],
      numberOfPassengers: ['1', [Validators.required, Validators.min(1)]],
      vehicle: ['', Validators.required],
      specialRequests: [''],
      accommodation: ['']
    });
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

    const bookingPayload = {
      userId: user.id,
      tourId: null,
      packageName: this.packageData()?.title,
      packagePrice: this.packageData()?.price,
      preferredDate: this.bookingForm.get('preferredDate')?.value,
      numberOfPassengers: this.bookingForm.get('numberOfPassengers')?.value,
      vehicle: this.bookingForm.get('vehicle')?.value,
      specialRequests: this.bookingForm.get('specialRequests')?.value,
      accommodation: this.bookingForm.get('accommodation')?.value,
      type: 'plan-package-booking'
    };

    // First, create the booking
    this.http.post(`${environment.apiBaseUrl}/bookings`, bookingPayload).subscribe({
      next: (response: any) => {
        const bookingId = response.id || response.bookingId;
        
        // Then proceed to checkout
        const checkoutPayload = {
          bookingId: bookingId,
          amount: this.packageData()?.price,
          currency: 'ZAR'
        };

        this.http.post(`${environment.apiBaseUrl}/checkout`, checkoutPayload).subscribe({
          next: (checkoutResponse: any) => {
            this.toastService.show('Redirecting to payment...', 'success');
            // Redirect to Yoco payment page if URL is provided
            if (checkoutResponse.paymentUrl) {
              window.location.href = checkoutResponse.paymentUrl;
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
}
