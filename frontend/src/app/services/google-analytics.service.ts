import { Injectable } from '@angular/core';

declare let gtag: Function;

export interface Gtag {
  (command: 'config', targetId: string, config?: any): void;
  (command: 'event', eventName: string, eventParams?: any): void;
}

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
      gtag('config', this.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }

  /**
   * Track custom events
   * @param eventName - Name of the event
   * @param eventData - Event data object
   */
  trackEvent(eventName: string, eventData?: any): void {
    if (this.isGtagAvailable()) {
      gtag('event', eventName, eventData);
    }
  }

  /**
   * Track form submission
   * @param formName - Name of the form
   * @param formData - Optional form data
   */
  trackFormSubmission(formName: string, formData?: any): void {
    if (this.isGtagAvailable()) {
      gtag('event', 'form_submit', {
        form_name: formName,
        ...formData
      });
    }
  }

  /**
   * Track booking inquiry
   * @param bookingDetails - Booking details
   */
  trackBookingInquiry(bookingDetails?: any): void {
    if (this.isGtagAvailable()) {
      gtag('event', 'booking_inquiry', {
        event_category: 'engagement',
        event_label: 'Booking Form Submission',
        ...bookingDetails
      });
    }
  }

  /**
   * Check if gtag is available
   */
  private isGtagAvailable(): boolean {
    return typeof gtag !== 'undefined';
  }
}
