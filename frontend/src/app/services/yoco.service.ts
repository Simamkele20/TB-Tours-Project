import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface YocoCheckoutRequest {
  bookingId: number;
  email: string;
  amount: number;
  firstName: string;
  lastName: string;
}

export interface YocoCheckoutResponse {
  success: boolean;
  data?: {
    checkoutId: string;
    redirectUrl: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

export interface YocoPaymentStatusResponse {
  success: boolean;
  data?: {
    checkoutId: string;
    amount: number;
    status: 'succeeded' | 'failed' | 'pending';
    email: string;
    completedAt: string;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class YocoService {
  private apiUrl = `${environment.apiBaseUrl}/payments`;
  private paymentStatus = new BehaviorSubject<string>('idle');
  paymentStatus$ = this.paymentStatus.asObservable();

  private isTestMode = true; // Yoco keys start with pk_test_ or pk_live_

  constructor(private http: HttpClient) {
    this.warnIfTestMode();
  }

  /**
   * Warn in console if running in test mode
   */
  private warnIfTestMode() {
    console.info(
      '💳 YOCO PAYMENT GATEWAY - Ready to accept payments'
    );
    console.info(
      '🧪 Test Mode: Use test card 4111 1111 1111 1111 | Expiry: Any future date | CVC: Any 3 digits'
    );
  }

  /**
   * Create a Yoco checkout session
   */
  createCheckout(data: YocoCheckoutRequest): Observable<YocoCheckoutResponse> {
    console.log('🔄 Creating Yoco checkout session...');
    console.log('📦 Full request data:', JSON.stringify(data, null, 2));
    console.log('📊 Data types:', {
      bookingId: { value: data.bookingId, type: typeof data.bookingId },
      email: { value: data.email, type: typeof data.email },
      amount: { value: data.amount, type: typeof data.amount },
      firstName: { value: data.firstName, type: typeof data.firstName },
      lastName: { value: data.lastName, type: typeof data.lastName }
    });

    this.paymentStatus.next('processing');

    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/yoco/checkout`, data)
        .subscribe({
          next: (response) => {
            console.log('✅ Yoco checkout response:', response);
            if (response.success && response.data?.redirectUrl) {
              console.log('✅ Checkout URL received:', response.data.redirectUrl);
              observer.next(response);
              observer.complete();
            } else {
              console.error('❌ Invalid checkout response:', response);
              this.paymentStatus.next('error');
              observer.error(new Error(response.error || 'Failed to create checkout'));
            }
          },
          error: (error) => {
            console.error('❌ Checkout creation error:', error);
            console.error('❌ Error response:', error.error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error statusText:', error.statusText);
            this.paymentStatus.next('error');
            observer.error(error);
          }
        });
    });
  }

  /**
   * Verify payment status using checkout ID
   */
  verifyPayment(checkoutId: string): Observable<YocoPaymentStatusResponse> {
    console.log('🔍 Verifying payment for checkout:', checkoutId);
    this.paymentStatus.next('verifying');

    return new Observable(observer => {
      this.http.get<YocoPaymentStatusResponse>(`${this.apiUrl}/yoco/checkout/${checkoutId}`)
        .subscribe({
          next: (response) => {
            console.log('✅ Payment verification response:', response);
            if (response.success && response.data?.status) {
              const status = response.data.status;
              if (status === 'succeeded') {
                console.log('✅ Payment successful!');
                this.paymentStatus.next('success');
              } else if (status === 'failed') {
                console.error('❌ Payment failed');
                this.paymentStatus.next('failed');
              } else {
                console.log('⏳ Payment pending');
                this.paymentStatus.next('pending');
              }
              observer.next(response);
              observer.complete();
            } else {
              console.error('❌ Invalid verification response:', response);
              this.paymentStatus.next('error');
              observer.error(new Error(response.error || 'Failed to verify payment'));
            }
          },
          error: (error) => {
            console.error('❌ Payment verification error:', error);
            this.paymentStatus.next('error');
            observer.error(error);
          }
        });
    });
  }

  /**
   * Redirect to Yoco checkout page
   */
  redirectToCheckout(redirectUrl: string) {
    console.log('🔗 Redirecting to Yoco checkout...');
    window.location.href = redirectUrl;
  }

  /**
   * Extract checkout ID from URL query params
   */
  getCheckoutIdFromUrl(url?: string): string | null {
    const params = new URLSearchParams(url || window.location.search);
    return params.get('checkoutId');
  }

  /**
   * Get current payment status
   */
  getCurrentPaymentStatus(): Observable<string> {
    return this.paymentStatus.asObservable();
  }

  /**
   * Reset payment status
   */
  resetPaymentStatus() {
    this.paymentStatus.next('idle');
  }
}
