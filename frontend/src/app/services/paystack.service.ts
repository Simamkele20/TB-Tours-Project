import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentInitRequest {
  bookingId: number;
  email: string;
  amount: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface PaymentInitResponse {
  success: boolean;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  error?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  data?: {
    reference: string;
    amount: number;
    status: string;
    paidAt: string;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaystackService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private paymentStatus = new BehaviorSubject<string>('idle');
  paymentStatus$ = this.paymentStatus.asObservable();
  private isTestMode = environment.paystackPublicKey.startsWith('pk_test_');

  constructor(private http: HttpClient) {
    this.loadPaystackScript();
    this.warnIfTestMode();
  }

  /**
   * Warn in console if running in test mode
   */
  private warnIfTestMode() {
    if (this.isTestMode) {
      console.warn(
        '⚠️  PAYSTACK TEST MODE - Using test keys only. No real charges will be made.'
      );
      console.info(
        '📝 Test Card: 4084084084084081 | Expiry: Any future date | CVV: Any 3 digits'
      );
    }
  }

  /**
   * Load Paystack script dynamically
   */
  private loadPaystackScript() {
    if (!document.getElementById('paystack-script')) {
      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Initialize a payment on the backend
   */
  initializePayment(data: PaymentInitRequest): Observable<PaymentInitResponse> {
    console.log('🔄 Initializing payment...', data);
    return new Observable(observer => {
      this.http.post<PaymentInitResponse>(`${this.apiUrl}/initialize`, data)
        .subscribe({
          next: (response) => {
            console.log('✅ Payment initialization response:', response);
            if (response.success && response.data?.authorization_url) {
              console.log('✅ Authorization URL received:', response.data.authorization_url);
              observer.next(response);
              observer.complete();
            } else {
              console.error('❌ Invalid response format:', response);
              observer.error(new Error('Invalid payment response'));
            }
          },
          error: (error) => {
            console.error('❌ Payment initialization error:', error);
            observer.error(error);
          }
        });
    });
  }

  /**
   * Verify a payment after completion
   */
  verifyPayment(reference: string): Observable<PaymentVerifyResponse> {
    return this.http.get<PaymentVerifyResponse>(`${this.apiUrl}/verify/${reference}`);
  }

  /**
   * Handle Paystack payment flow
   * Opens Paystack modal and handles the payment process
   */
  handlePayment(
    authorizationUrl: string,
    onClose?: () => void,
    onSuccess?: () => void
  ): void {
    // Redirect to Paystack authorization page
    window.location.href = authorizationUrl;

    // Fallback: Open in a new window if needed
    // window.open(authorizationUrl, 'Paystack', 'width=512,height=512');
  }

  /**
   * Request refund for a transaction
   */
  requestRefund(reference: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/refund`, {
      reference,
      amount
    });
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(status: string): void {
    this.paymentStatus.next(status);
  }

  /**
   * Get payment status
   */
  getPaymentStatus(): string {
    return this.paymentStatus.value;
  }

  /**
   * Extract reference from URL (after redirect from Paystack)
   */
  extractReferenceFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('reference');
  }

  /**
   * Format amount to ZAR with proper formatting
   */
  formatAmount(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Check if in test mode
   */
  isInTestMode(): boolean {
    return this.isTestMode;
  }
}
