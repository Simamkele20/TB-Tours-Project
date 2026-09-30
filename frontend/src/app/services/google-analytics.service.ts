import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private readonly measurementId = 'G-YP5P63DQF2';

  /**
   * Track page view
   * @param pagePath - The page path (e.g., '/contact', '/tours')
   * @param pageTitle - The page title
   */
  trackPageView(pagePath: string, pageTitle: string): void {
    if (this.isGtagAvailable()) {
      try {
        gtag('config', this.measurementId, {
          page_path: pagePath,
          page_title: pageTitle
        });
      } catch (error) {
        // Google Analytics tracking failed silently
      }
    }
  }

  /**
   * Track booking inquiry
   * @param bookingDetails - Booking details
   */
  trackBookingInquiry(bookingDetails?: any): void {
    if (this.isGtagAvailable()) {
      try {
        gtag('event', 'booking_inquiry', {
          event_category: 'engagement',
          event_label: 'Booking Form Submission',
          ...bookingDetails
        });
      } catch (error) {
        // Google Analytics tracking failed silently
      }
    }
  }

  /**
   * Check if gtag is available
   */
  private isGtagAvailable(): boolean {
    return typeof gtag !== 'undefined';
  }
}
