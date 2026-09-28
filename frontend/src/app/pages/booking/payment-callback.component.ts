import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface PaymentResult {
  success: boolean;
  data?: {
    reference: string;
    amount: number;
    status: string;
    paidAt: string;
  };
  error?: string;
  message?: string;
}

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-content" [ngSwitch]="paymentStatus">

        <!-- Loading State -->
        <div *ngSwitchCase="'loading'" class="callback-card">
          <div class="spinner"></div>
          <h2>Processing Your Payment</h2>
          <p>Please wait while we confirm your payment...</p>
        </div>

        <!-- Success State -->
        <div *ngSwitchCase="'success'" class="callback-card success">
          <div class="icon-success">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed</p>

          <div class="payment-details" *ngIf="paymentData">
            <div class="detail-row">
              <span class="label">Reference:</span>
              <span class="value">{{ paymentData.reference }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Amount:</span>
              <span class="value">R{{ paymentData.amount | number: '1.0-2' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value status-badge success">{{ paymentData.status }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">{{ paymentData.paidAt | date: 'medium' }}</span>
            </div>
          </div>

          <div class="actions">
            <button class="btn-primary" (click)="goToMyBookings()">
              View My Bookings
            </button>
            <button class="btn-secondary" (click)="goHome()">
              Return to Home
            </button>
          </div>

          <p class="confirmation-note">
            A confirmation email has been sent to your email address with booking details.
          </p>
        </div>

        <!-- Failed State -->
        <div *ngSwitchCase="'failed'" class="callback-card failed">
          <div class="icon-failed">✗</div>
          <h2>Payment Failed</h2>
          <p>{{ errorMessage }}</p>

          <div class="error-details" *ngIf="paymentReference">
            <p class="detail">Reference: {{ paymentReference }}</p>
          </div>

          <div class="actions">
            <button class="btn-primary" (click)="retryPayment()">
              Try Again
            </button>
            <button class="btn-secondary" (click)="goToMyBookings()">
              View Bookings
            </button>
            <button class="btn-secondary" (click)="goHome()">
              Return to Home
            </button>
          </div>

          <p class="support-note">
            If you continue experiencing issues, please contact our support team at
            <a href="mailto:support@tb-tours.co.za">support@tb-tours.co.za</a>
          </p>
        </div>

        <!-- Cancelled State -->
        <div *ngSwitchCase="'cancelled'" class="callback-card cancelled">
          <div class="icon-cancelled">⊘</div>
          <h2>Payment Cancelled</h2>
          <p>You have cancelled the payment process</p>

          <div class="actions">
            <button class="btn-primary" (click)="retryPayment()">
              Continue Payment
            </button>
            <button class="btn-secondary" (click)="goToMyBookings()">
              View Bookings
            </button>
            <button class="btn-secondary" (click)="goHome()">
              Return to Home
            </button>
          </div>

          <p class="info-note">
            Your booking is still pending. Complete the payment to confirm your booking.
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      padding-top: 120px;
      color: #fff;
    }

    .callback-content {
      width: 100%;
      max-width: 500px;
    }

    .callback-card {
      background: rgba(10, 21, 48, 0.7);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      backdrop-filter: blur(4px);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 2rem;
      border: 4px solid rgba(242, 177, 18, 0.2);
      border-top-color: #f2b112;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .icon-success,
    .icon-failed,
    .icon-cancelled {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .icon-success {
      color: #4caf50;
    }

    .icon-failed {
      color: #f44336;
    }

    .icon-cancelled {
      color: #ff9800;
    }

    h2 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }

    p {
      color: #b3c1d8;
      margin: 0.5rem 0;
    }

    .payment-details,
    .error-details {
      background: rgba(242, 177, 18, 0.05);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(242, 177, 18, 0.1);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #b3c1d8;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .value {
      color: #f2b112;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      text-transform: capitalize;
    }

    .status-badge.success {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .detail {
      color: #b3c1d8;
      font-size: 0.9rem;
      padding: 0.5rem 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 2rem 0;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-primary {
      background: #f2b112;
      color: #0a1530;
    }

    .btn-primary:hover {
      background: #ffc94d;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: #f2b112;
      border: 1px solid #f2b112;
    }

    .btn-secondary:hover {
      background: rgba(242, 177, 18, 0.1);
      box-shadow: 0 2px 8px rgba(242, 177, 18, 0.2);
    }

    .confirmation-note,
    .support-note,
    .info-note {
      color: #7a8a9e;
      font-size: 0.85rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(242, 177, 18, 0.05);
      border-left: 3px solid #f2b112;
      border-radius: 4px;
      text-align: left;
    }

    .support-note a {
      color: #f2b112;
      text-decoration: none;
    }

    .support-note a:hover {
      text-decoration: underline;
    }

    .callback-card.success {
      border-color: rgba(76, 175, 80, 0.3);
    }

    .callback-card.failed {
      border-color: rgba(244, 67, 54, 0.3);
    }

    .callback-card.cancelled {
      border-color: rgba(255, 152, 0, 0.3);
    }

    @media (max-width: 768px) {
      .callback-container {
        padding: 1rem;
        padding-top: 100px;
      }

      .callback-card {
        padding: 2rem 1.5rem;
      }

      h2 {
        font-size: 1.3rem;
      }

      .actions {
        gap: 0.75rem;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  paymentStatus: 'loading' | 'success' | 'failed' | 'cancelled' = 'loading';
  paymentData: any = null;
  paymentReference: string | null = null;
  errorMessage = 'Your payment could not be processed. Please try again.';
  bookingId: number | null = null;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = `${environment.apiUrl}`;

  ngOnInit() {
    // Get reference from query params
    this.route.queryParams.subscribe(params => {
      let reference = params['reference'];
      const trxref = params['trxref'];
      const status = params['status'];

      // Handle Paystack response: use trxref if reference is invalid or contains template
      if (!reference || reference.includes('{TRANSACTION_REF}')) {
        reference = trxref;
      }

      if (status === 'cancelled') {
        this.paymentStatus = 'cancelled';
        this.cdr.detectChanges();
      } else if (reference) {
        this.verifyPayment(reference);
      } else {
        this.paymentStatus = 'failed';
        this.errorMessage = 'No payment reference provided';
        this.cdr.detectChanges();
      }
    });
  }

  verifyPayment(reference: string) {
    console.log('🔍 Verifying payment with reference:', reference);

    this.http.get<PaymentResult>(`${this.apiUrl}/payments/verify/${reference}`)
      .subscribe({
        next: (response) => {
          console.log('✅ Payment verification response:', response);

          if (response.success && response.data) {
            this.paymentData = response.data;
            this.paymentStatus = 'success';
            console.log('✅ Payment successful');
          } else {
            this.paymentStatus = 'failed';
            this.errorMessage = response.error || 'Payment verification failed';
            this.paymentReference = reference;
            console.log('❌ Payment verification failed:', response.error);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Payment verification error:', error);
          this.paymentStatus = 'failed';
          this.errorMessage = error?.error?.error || 'Failed to verify payment. Please try again.';
          this.paymentReference = reference;
          this.cdr.detectChanges();
        }
      });
  }

  retryPayment() {
    // Redirect to bookings page where user can retry
    this.router.navigate(['/my-bookings']);
  }

  goToMyBookings() {
    this.router.navigate(['/my-bookings']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
