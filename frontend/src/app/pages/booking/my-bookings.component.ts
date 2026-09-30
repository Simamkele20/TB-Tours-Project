import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Tour {
  id: number;
  title: string;
  duration: string;
  image: string;
  price: number;
}

interface Booking {
  id: number;
  userId: number;
  tourId: number;
  bookingReference: string;
  tourDate: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  transactionId?: string;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
  specialRequests: string;
  accommodationPreferences: string;
  passengerDetails: any[];
  notes?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  confirmationEmailSent: boolean;
  reminderEmailSent: boolean;
  createdAt: string;
  updatedAt: string;
  Tour: Tour;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bookings-container">
      <header class="bookings-header">
        <h1>My Bookings</h1>
        <p class="subtitle">View and manage your tour bookings</p>
      </header>

      <!-- ERROR MESSAGE -->
      <div *ngIf="errorMessage" style="background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); padding: 1rem; margin: 1rem 2rem; border-radius: 4px; color: #ef5350;">
        <strong>ERROR:</strong> {{ errorMessage }}
      </div>

      <div class="bookings-content">
        <!-- Bookings List -->
        <div class="bookings-list">
          <div class="booking-card" *ngFor="let booking of bookings">
            <div class="booking-image">
              <img [src]="booking.Tour?.image" [alt]="booking.Tour?.title" />
            </div>

            <div class="booking-details">
              <h3>{{ booking.Tour?.title }}</h3>

              <div class="booking-info">
                <div class="info-item">
                  <label>Booking Reference:</label>
                  <span class="reference">{{ booking.bookingReference }}</span>
                </div>
                <div class="info-item">
                  <label>Tour Date:</label>
                  <span>{{ formatDate(booking.tourDate) }}</span>
                </div>
                <div class="info-item">
                  <label>Passengers:</label>
                  <span>{{ booking.numberOfPassengers }}</span>
                </div>
                <div class="info-item">
                  <label>Duration:</label>
                  <span>{{ booking.Tour?.duration }}</span>
                </div>
              </div>

              <div class="booking-status">
                <span class="badge status" [ngClass]="booking.status">
                  {{ booking.status }}
                </span>
                <span class="badge payment" [ngClass]="booking.paymentStatus">
                  {{ booking.paymentStatus }}
                </span>
              </div>

              <div class="booking-price">
                <span class="label">Total Price:</span>
                <span class="price">R{{ booking.totalPrice | number: '1.0-2' }}</span>
              </div>
            </div>
          </div>

          <div class="no-bookings" *ngIf="bookings.length === 0">
            <p>No bookings found.</p>
            <p>
              <a routerLink="/">Browse tours to create a new booking</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      min-height: 100vh;
      background: #0a1530;
      color: #fff;
      padding-top: 120px;
    }

    .bookings-header {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      padding: 3rem 2rem;
      border-bottom: 2px solid #f2b112;
      text-align: center;
    }

    .bookings-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #f2b112;
      font-weight: 700;
    }

    .subtitle {
      margin: 0.5rem 0 0;
      color: #b3c1d8;
      font-size: 1rem;
    }

    .bookings-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }



    .bookings-list {
      display: grid;
      gap: 1.5rem;
    }

    .booking-card {
      display: grid;
      grid-template-columns: 200px 1fr 1fr;
      gap: 1.5rem;
      align-items: center;
      background: rgba(10, 21, 48, 0.5);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
    }

    .booking-card:hover {
      border-color: #f2b112;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.1);
    }

    .booking-image {
      width: 100%;
      height: 150px;
      border-radius: 6px;
      overflow: hidden;
    }

    .booking-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .booking-details h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      color: #f2b112;
    }

    .booking-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      color: #7a8a9e;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .info-item span {
      color: #b3c1d8;
      font-weight: 500;
    }

    .reference {
      color: #f2b112;
      font-family: monospace;
      font-weight: 600;
    }

    .booking-status {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge.status {
      background: rgba(33, 150, 243, 0.2);
      color: #42a5f5;
      border: 1px solid rgba(33, 150, 243, 0.4);
    }

    .badge.status.pending {
      background: rgba(255, 152, 0, 0.2);
      color: #ffb74d;
      border-color: rgba(255, 152, 0, 0.4);
    }

    .badge.status.confirmed {
      background: rgba(76, 175, 80, 0.2);
      color: #81c784;
      border-color: rgba(76, 175, 80, 0.4);
    }

    .badge.status.completed {
      background: rgba(76, 175, 80, 0.2);
      color: #81c784;
      border-color: rgba(76, 175, 80, 0.4);
    }

    .badge.status.cancelled {
      background: rgba(244, 67, 54, 0.2);
      color: #ef5350;
      border-color: rgba(244, 67, 54, 0.4);
    }

    .badge.payment {
      background: rgba(242, 177, 18, 0.2);
      color: #f2b112;
      border: 1px solid rgba(242, 177, 18, 0.4);
    }

    .badge.payment.unpaid {
      background: rgba(255, 152, 0, 0.2);
      color: #ffb74d;
      border-color: rgba(255, 152, 0, 0.4);
    }

    .badge.payment.paid {
      background: rgba(76, 175, 80, 0.2);
      color: #81c784;
      border-color: rgba(76, 175, 80, 0.4);
    }

    .booking-price {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
      font-size: 1rem;
    }

    .booking-price .label {
      color: #7a8a9e;
      font-weight: 600;
    }

    .price {
      color: #f2b112;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .booking-actions {
      display: flex;
      gap: 0.75rem;
      flex-direction: column;
    }

    .btn-primary,
    .btn-danger {
      padding: 0.75rem 1.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: #f2b112;
      color: #0a1530;
    }

    .btn-primary:hover {
      background: #ffc94d;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.3);
    }

    .btn-danger {
      background: rgba(244, 67, 54, 0.2);
      color: #ef5350;
      border: 1px solid rgba(244, 67, 54, 0.4);
    }

    .btn-danger:hover {
      background: rgba(244, 67, 54, 0.3);
      border-color: #ef5350;
    }

    .no-bookings {
      text-align: center;
      padding: 3rem 2rem;
      color: #7a8a9e;
    }

    .no-bookings p {
      margin: 1rem 0;
    }

    .no-bookings a {
      color: #f2b112;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .no-bookings a:hover {
      color: #ffc94d;
    }

    @media (max-width: 1024px) {
      .booking-card {
        grid-template-columns: 150px 1fr;
      }
    }

    @media (max-width: 768px) {
      .bookings-container {
        padding-top: 100px;
      }

      .bookings-header h1 {
        font-size: 1.5rem;
      }

      .bookings-content {
        padding: 1rem;
      }

      .booking-card {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .booking-image {
        height: 200px;
      }

      .booking-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  private apiBaseUrl = environment.apiBaseUrl;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    console.log('[MY-BOOKINGS] Component constructed, apiBaseUrl:', this.apiBaseUrl);
  }

  ngOnInit() {
    console.log('[MY-BOOKINGS] ngOnInit called');
    this.loadBookings();
  }

  loadBookings() {
    const url = `${this.apiBaseUrl}/bookings`;
    console.log('[MY-BOOKINGS] loadBookings() - Making request to:', url);

    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<{ message: string; data: Booking[] }>(url).subscribe({
      next: (response) => {
        console.log('[MY-BOOKINGS] ✅ Response received, booking count:', response?.data?.length);
        console.log('[MY-BOOKINGS] Full response:', response);

        // Ensure we have an array
        this.bookings = Array.isArray(response?.data) ? response.data : [];
        console.log('[MY-BOOKINGS] Bookings assigned, total:', this.bookings.length);

        // Log individual bookings for debugging
        this.bookings.forEach((b, i) => {
          console.log(`[MY-BOOKINGS] Booking ${i}:`, b.id, b.Tour?.title, b.status, b.paymentStatus);
        });

        this.isLoading = false;

        // Force change detection
        this.cdr.detectChanges();
        console.log('[MY-BOOKINGS] Change detection triggered');
      },
      error: (error) => {
        console.error('[MY-BOOKINGS] ❌ API error:', error);
        this.errorMessage = `Failed to load bookings: ${error?.status} ${error?.statusText}`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }



  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
