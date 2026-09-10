import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Tour {
  id: number;
  title: string;
  price: number;
  duration?: number;
  description?: string;
}

interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  tourId: number;
  tourDate: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  User?: User;
  Tour?: Tour;
}

interface BookingAnalytics {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  payment: {
    paid: number;
    unpaid: number;
    totalRevenue: number;
  };
  thisMonth: number;
  topTours: Array<{
    id: number;
    title: string;
    bookingCount: number;
    totalRevenue: number;
  }>;
}

interface Analytics {
  users: {
    total: number;
    verified: number;
    unverified: number;
    admins: number;
    customers: number;
  };
  registrations: {
    today: number;
    thisMonth: number;
  };
}

// ============ MOCK DATA ============
const MOCK_ANALYTICS: Analytics = {
  users: {
    total: 22,
    verified: 20,
    unverified: 2,
    admins: 2,
    customers: 20
  },
  registrations: {
    today: 1,
    thisMonth: 5
  }
};

// Calculate total revenue from all paid bookings (must be defined after MOCK_BOOKINGS)
const MOCK_BOOKING_ANALYTICS: BookingAnalytics = {
  bookings: {
    total: 0, // Will be calculated by date range filter
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  },
  payment: {
    paid: 0,
    unpaid: 0,
    totalRevenue: 0 // Will be calculated by date range filter
  },
  thisMonth: 0,
  topTours: [] // Will be calculated by date range filter
};

const MOCK_USERS: User[] = [
  { id: 1, firstName: 'Prince', lastName: 'Tancu', email: 'princetancu06@gmail.com', role: 'admin', verified: true, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-01-10T08:00:00Z' },
  { id: 41, firstName: 'Christopher', lastName: 'Clark', email: 'christopher.clark@tb-tours.co.za', role: 'admin', verified: true, createdAt: '2026-01-15T10:30:00Z', updatedAt: '2026-01-15T10:30:00Z' },
  { id: 42, firstName: 'Jennifer', lastName: 'Rodriguez', email: 'jennifer.rodriguez@tb-tours.co.za', role: 'admin', verified: true, createdAt: '2026-01-15T10:31:00Z', updatedAt: '2026-01-15T10:31:00Z' },
  { id: 43, firstName: 'John', lastName: 'Smith', email: 'john.smith@tbtours.test', role: 'customer', verified: true, createdAt: '2026-02-20T11:00:00Z', updatedAt: '2026-02-20T11:00:00Z' },
  { id: 44, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-03-05T11:05:00Z', updatedAt: '2026-03-05T11:05:00Z' },
  { id: 45, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@tbtours.test', role: 'customer', verified: false, createdAt: '2026-05-10T11:10:00Z', updatedAt: '2026-05-10T11:10:00Z' },
  { id: 46, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@tbtours.test', role: 'customer', verified: true, createdAt: '2026-06-15T11:15:00Z', updatedAt: '2026-06-15T11:15:00Z' },
  { id: 47, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-07-20T11:20:00Z', updatedAt: '2026-07-20T11:20:00Z' },
  { id: 48, firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@tbtours.test', role: 'customer', verified: true, createdAt: '2026-08-01T11:25:00Z', updatedAt: '2026-08-01T11:25:00Z' },
  { id: 49, firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@tbtours.test', role: 'customer', verified: false, createdAt: '2026-08-15T11:30:00Z', updatedAt: '2026-08-15T11:30:00Z' },
  { id: 50, firstName: 'Lisa', lastName: 'Taylor', email: 'lisa.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-08-25T11:35:00Z', updatedAt: '2026-08-25T11:35:00Z' },
  { id: 51, firstName: 'James', lastName: 'Thomas', email: 'james.thomas@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-01T11:40:00Z', updatedAt: '2026-09-01T11:40:00Z' },
  { id: 52, firstName: 'Mary', lastName: 'Jackson', email: 'mary.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-03T11:45:00Z', updatedAt: '2026-09-03T11:45:00Z' },
  { id: 53, firstName: 'William', lastName: 'White', email: 'william.white@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-05T11:50:00Z', updatedAt: '2026-09-05T11:50:00Z' },
  { id: 54, firstName: 'Karen', lastName: 'Harris', email: 'karen.harris@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-07T11:55:00Z', updatedAt: '2026-09-07T11:55:00Z' },
  { id: 55, firstName: 'Charles', lastName: 'Martin', email: 'charles.martin@tbtours.test', role: 'customer', verified: false, createdAt: '2026-09-08T12:00:00Z', updatedAt: '2026-09-08T12:00:00Z' },
  { id: 56, firstName: 'Patricia', lastName: 'Thompson', email: 'patricia.thompson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-09T12:05:00Z', updatedAt: '2026-09-09T12:05:00Z' },
  { id: 57, firstName: 'Christopher', lastName: 'Garcia', email: 'christopher.garcia@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-10T08:10:00Z', updatedAt: '2026-09-10T08:10:00Z' },
  { id: 58, firstName: 'Nancy', lastName: 'Moore', email: 'nancy.moore@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-10T09:15:00Z', updatedAt: '2026-09-10T09:15:00Z' },
  { id: 59, firstName: 'Daniel', lastName: 'Jackson', email: 'daniel.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-10T10:20:00Z', updatedAt: '2026-09-10T10:20:00Z' },
  { id: 60, firstName: 'Linda', lastName: 'Taylor', email: 'linda.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-09-10T11:25:00Z', updatedAt: '2026-09-10T11:25:00Z' }
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 1, bookingReference: 'BK-MTVM2L1F-ASGNHA', userId: 43, tourId: 1, tourDate: '2026-09-09T09:00:00Z', numberOfPassengers: 3, totalPrice: 97200, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-09-09T14:30:00Z', updatedAt: '2026-09-09T14:30:00Z', User: { id: 43, firstName: 'John', lastName: 'Smith', email: 'john.smith@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:00:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 2, bookingReference: 'BK-XPQW5K8M-LQKMJU', userId: 44, tourId: 2, tourDate: '2026-09-08T10:30:00Z', numberOfPassengers: 2, totalPrice: 113400, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-09-08T10:15:00Z', updatedAt: '2026-09-08T11:00:00Z', User: { id: 44, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:05:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 3, bookingReference: 'BK-ZCVB9NM0-POIUYT', userId: 45, tourId: 3, tourDate: '2026-09-07T08:00:00Z', numberOfPassengers: 1, totalPrice: 20000, status: 'completed', paymentStatus: 'paid', createdAt: '2026-09-07T09:45:00Z', updatedAt: '2026-09-07T16:30:00Z', User: { id: 45, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:10:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 4, bookingReference: 'BK-DFGH4JKL-WERTYU', userId: 46, tourId: 4, tourDate: '2026-09-06T11:00:00Z', numberOfPassengers: 4, totalPrice: 252400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-09-06T15:20:00Z', updatedAt: '2026-09-06T18:00:00Z', notes: 'Excellent tour experience', User: { id: 46, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:15:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 5, bookingReference: 'BK-MNBV2CXZ-ASDFGH', userId: 47, tourId: 5, tourDate: '2026-09-05T07:30:00Z', numberOfPassengers: 1, totalPrice: 135000, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-09-05T12:00:00Z', updatedAt: '2026-09-05T14:00:00Z', User: { id: 47, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:20:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 6, bookingReference: 'BK-QWERT5Y-UIOPAS', userId: 48, tourId: 1, tourDate: '2026-08-28T09:15:00Z', numberOfPassengers: 2, totalPrice: 64800, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-08-28T08:30:00Z', updatedAt: '2026-08-28T17:00:00Z', User: { id: 48, firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:25:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 7, bookingReference: 'BK-ZXCVB3NM-QWERTY', userId: 49, tourId: 2, tourDate: '2026-08-23T10:00:00Z', numberOfPassengers: 3, totalPrice: 170100, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2026-08-23T13:45:00Z', updatedAt: '2026-08-23T10:00:00Z', notes: 'Cancelled due to weather', User: { id: 49, firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:30:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 8, bookingReference: 'BK-GHJKL7U-IOPQWE', userId: 50, tourId: 3, tourDate: '2026-08-25T08:30:00Z', numberOfPassengers: 2, totalPrice: 86400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-08-25T11:20:00Z', updatedAt: '2026-08-25T14:30:00Z', User: { id: 50, firstName: 'Lisa', lastName: 'Taylor', email: 'lisa.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:35:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 9, bookingReference: 'BK-TYUIP8O-ASDFGHJK', userId: 51, tourId: 4, tourDate: '2026-02-26T12:00:00Z', numberOfPassengers: 2, totalPrice: 151200, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-17T14:15:00Z', updatedAt: '2026-01-18T09:30:00Z', User: { id: 51, firstName: 'James', lastName: 'Thomas', email: 'james.thomas@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:40:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 10, bookingReference: 'BK-FGHJK9L-ZXCVBNM', userId: 52, tourId: 5, tourDate: '2026-02-21T06:00:00Z', numberOfPassengers: 1, totalPrice: 135000, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-11T10:00:00Z', updatedAt: '2026-02-21T19:00:00Z', notes: 'Private service was excellent', User: { id: 52, firstName: 'Mary', lastName: 'Jackson', email: 'mary.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:45:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 11, bookingReference: 'BK-MNBV1C-QWERTYUI', userId: 53, tourId: 1, tourDate: '2026-02-24T09:45:00Z', numberOfPassengers: 4, totalPrice: 129600, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-21T16:30:00Z', updatedAt: '2026-01-21T16:30:00Z', User: { id: 53, firstName: 'William', lastName: 'White', email: 'william.white@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:50:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 12, bookingReference: 'BK-XZAQW2S-EDCVFR', userId: 54, tourId: 2, tourDate: '2026-01-30T10:30:00Z', numberOfPassengers: 1, totalPrice: 56700, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-03T07:00:00Z', updatedAt: '2026-01-30T15:45:00Z', User: { id: 54, firstName: 'Karen', lastName: 'Harris', email: 'karen.harris@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:55:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 13, bookingReference: 'BK-CDERF3T-YHUJIK', userId: 55, tourId: 3, tourDate: '2026-02-27T08:15:00Z', numberOfPassengers: 2, totalPrice: 86400, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-22T12:45:00Z', updatedAt: '2026-01-22T12:45:00Z', User: { id: 55, firstName: 'Charles', lastName: 'Martin', email: 'charles.martin@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T11:00:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 14, bookingReference: 'BK-VGYHJ4U-IOLKJH', userId: 56, tourId: 4, tourDate: '2026-02-20T11:30:00Z', numberOfPassengers: 3, totalPrice: 226800, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-09T14:20:00Z', updatedAt: '2026-02-20T18:15:00Z', notes: 'Great experience with friends', User: { id: 56, firstName: 'Patricia', lastName: 'Thompson', email: 'patricia.thompson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:05:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 15, bookingReference: 'BK-MKYIK5P-OIJKMNB', userId: 57, tourId: 5, tourDate: '2026-02-19T07:00:00Z', numberOfPassengers: 2, totalPrice: 270000, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-16T09:30:00Z', updatedAt: '2026-01-17T11:00:00Z', User: { id: 57, firstName: 'Christopher', lastName: 'Garcia', email: 'christopher.garcia@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:10:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 16, bookingReference: 'BK-OLKJH6M-WERTYUI', userId: 58, tourId: 1, tourDate: '2026-01-27T09:30:00Z', numberOfPassengers: 1, totalPrice: 20000, status: 'completed', paymentStatus: 'paid', createdAt: '2026-01-02T13:15:00Z', updatedAt: '2026-01-27T16:45:00Z', User: { id: 58, firstName: 'Nancy', lastName: 'Moore', email: 'nancy.moore@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:15:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 17, bookingReference: 'BK-UYJKL7N-QASDFGH', userId: 59, tourId: 2, tourDate: '2026-02-21T10:15:00Z', numberOfPassengers: 2, totalPrice: 113400, status: 'confirmed', paymentStatus: 'pending', createdAt: '2026-01-19T15:45:00Z', updatedAt: '2026-01-19T15:45:00Z', User: { id: 59, firstName: 'Daniel', lastName: 'Jackson', email: 'daniel.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:20:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 18, bookingReference: 'BK-IKMJN8O-ZXCVBNM', userId: 60, tourId: 3, tourDate: '2026-01-29T08:45:00Z', numberOfPassengers: 3, totalPrice: 129600, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-06T10:30:00Z', updatedAt: '2026-01-29T14:00:00Z', User: { id: 60, firstName: 'Linda', lastName: 'Taylor', email: 'linda.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:25:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 19, bookingReference: 'BK-PLOKM9I-ASDFGHJKL', userId: 43, tourId: 4, tourDate: '2026-02-28T12:30:00Z', numberOfPassengers: 1, totalPrice: 75600, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-23T11:00:00Z', updatedAt: '2026-01-23T11:00:00Z', User: { id: 43, firstName: 'John', lastName: 'Smith', email: 'john.smith@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:00:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 20, bookingReference: 'BK-OKIJH0U-WERTYUIOP', userId: 44, tourId: 6, tourDate: '2026-02-17T06:30:00Z', numberOfPassengers: 2, totalPrice: 68400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-04T12:00:00Z', updatedAt: '2026-02-17T19:30:00Z', notes: 'Custom tour was perfect', User: { id: 44, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:05:00Z' }, Tour: { id: 6, title: 'Custom Day Tours', price: 34200 } },
  { id: 21, bookingReference: 'BK-AQWSD1F-NMJKIOL', userId: 45, tourId: 1, tourDate: '2026-02-22T09:00:00Z', numberOfPassengers: 2, totalPrice: 64800, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-20T14:30:00Z', updatedAt: '2026-01-21T09:00:00Z', User: { id: 45, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:10:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 22, bookingReference: 'BK-ZXASW2E-BNMKIOL', userId: 46, tourId: 2, tourDate: '2026-01-31T10:45:00Z', numberOfPassengers: 1, totalPrice: 56700, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-07T09:15:00Z', updatedAt: '2026-01-31T16:00:00Z', User: { id: 46, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:15:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 23, bookingReference: 'BK-CXASW3R-GHJUIOL', userId: 47, tourId: 3, tourDate: '2026-02-23T08:30:00Z', numberOfPassengers: 4, totalPrice: 172800, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2026-01-13T16:45:00Z', updatedAt: '2026-01-30T11:20:00Z', notes: 'Customer changed plans', User: { id: 47, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:20:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 24, bookingReference: 'BK-VXASW4T-THJKUIOL', userId: 48, tourId: 4, tourDate: '2026-02-24T11:15:00Z', numberOfPassengers: 2, totalPrice: 151200, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-18T13:30:00Z', updatedAt: '2026-01-19T10:00:00Z', User: { id: 48, firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:25:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 25, bookingReference: 'BK-BXASW5Y-YHKJUIOL', userId: 49, tourId: 5, tourDate: '2026-02-25T07:45:00Z', numberOfPassengers: 1, totalPrice: 20000, status: 'completed', paymentStatus: 'paid', createdAt: '2026-01-01T08:00:00Z', updatedAt: '2026-02-25T20:00:00Z', notes: 'Five star service', User: { id: 49, firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:30:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 26, bookingReference: 'BK-NXASW6U-IJKLUIOL', userId: 50, tourId: 6, tourDate: '2026-02-19T10:00:00Z', numberOfPassengers: 3, totalPrice: 102600, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-21T15:20:00Z', updatedAt: '2026-01-21T15:20:00Z', User: { id: 50, firstName: 'Lisa', lastName: 'Taylor', email: 'lisa.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:35:00Z' }, Tour: { id: 6, title: 'Custom Day Tours', price: 34200 } },
  { id: 27, bookingReference: 'BK-MXASW7I-JKLMUIOL', userId: 51, tourId: 1, tourDate: '2026-01-26T09:30:00Z', numberOfPassengers: 1, totalPrice: 32400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-13T14:00:00Z', updatedAt: '2026-01-26T17:15:00Z', User: { id: 51, firstName: 'James', lastName: 'Thomas', email: 'james.thomas@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:40:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 28, bookingReference: 'BK-KXASW8O-KLMNUIOL', userId: 52, tourId: 2, tourDate: '2026-02-20T10:30:00Z', numberOfPassengers: 3, totalPrice: 170100, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-24T11:45:00Z', updatedAt: '2026-01-24T11:45:00Z', User: { id: 52, firstName: 'Mary', lastName: 'Jackson', email: 'mary.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:45:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 29, bookingReference: 'BK-HXASW9P-LMNOUIOL', userId: 53, tourId: 3, tourDate: '2026-02-01T08:00:00Z', numberOfPassengers: 2, totalPrice: 86400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-15T10:30:00Z', updatedAt: '2026-02-01T13:45:00Z', User: { id: 53, firstName: 'William', lastName: 'White', email: 'william.white@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:50:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 30, bookingReference: 'BK-GXASW0Q-MNOPUIOL', userId: 54, tourId: 4, tourDate: '2026-02-16T12:00:00Z', numberOfPassengers: 4, totalPrice: 302400, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-10T13:15:00Z', updatedAt: '2026-01-11T09:30:00Z', User: { id: 54, firstName: 'Karen', lastName: 'Harris', email: 'karen.harris@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:55:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 31, bookingReference: 'BK-FXASW1W-NOPQUIOL', userId: 55, tourId: 5, tourDate: '2026-02-18T06:15:00Z', numberOfPassengers: 1, totalPrice: 135000, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-08T08:45:00Z', updatedAt: '2026-02-18T18:30:00Z', notes: 'Memorable experience', User: { id: 55, firstName: 'Charles', lastName: 'Martin', email: 'charles.martin@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T11:00:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 32, bookingReference: 'BK-DXASW2E-OPQRUIOL', userId: 56, tourId: 6, tourDate: '2026-02-22T09:45:00Z', numberOfPassengers: 2, totalPrice: 68400, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-25T12:30:00Z', updatedAt: '2026-01-25T12:30:00Z', User: { id: 56, firstName: 'Patricia', lastName: 'Thompson', email: 'patricia.thompson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:05:00Z' }, Tour: { id: 6, title: 'Custom Day Tours', price: 34200 } },
  { id: 33, bookingReference: 'BK-SXASW3R-PQRSUIOL', userId: 57, tourId: 1, tourDate: '2026-01-24T09:15:00Z', numberOfPassengers: 3, totalPrice: 97200, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-14T15:45:00Z', updatedAt: '2026-01-24T16:30:00Z', User: { id: 57, firstName: 'Christopher', lastName: 'Garcia', email: 'christopher.garcia@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:10:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 34, bookingReference: 'BK-AXASW4T-QRSTUIOL', userId: 58, tourId: 2, tourDate: '2026-02-17T10:45:00Z', numberOfPassengers: 1, totalPrice: 20000, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-01-17T10:00:00Z', updatedAt: '2026-01-18T14:30:00Z', User: { id: 58, firstName: 'Nancy', lastName: 'Moore', email: 'nancy.moore@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:15:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 35, bookingReference: 'BK-ZXASW5Y-RSTUUIOL', userId: 59, tourId: 3, tourDate: '2026-02-02T08:30:00Z', numberOfPassengers: 2, totalPrice: 86400, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-12T11:20:00Z', updatedAt: '2026-02-02T15:00:00Z', User: { id: 59, firstName: 'Daniel', lastName: 'Jackson', email: 'daniel.jackson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:20:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 36, bookingReference: 'BK-WXASW6U-STUVUIOL', userId: 60, tourId: 4, tourDate: '2026-02-03T11:45:00Z', numberOfPassengers: 3, totalPrice: 226800, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2026-01-16T14:15:00Z', updatedAt: '2026-01-28T10:45:00Z', notes: 'Refund processed', User: { id: 60, firstName: 'Linda', lastName: 'Taylor', email: 'linda.taylor@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T11:25:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 37, bookingReference: 'BK-QXASW7I-TUVVUIOL', userId: 43, tourId: 5, tourDate: '2026-02-04T07:30:00Z', numberOfPassengers: 2, totalPrice: 270000, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-19T16:00:00Z', updatedAt: '2026-01-20T11:30:00Z', User: { id: 43, firstName: 'John', lastName: 'Smith', email: 'john.smith@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:00:00Z' }, Tour: { id: 5, title: 'Private Chauffeur Service', price: 135000 } },
  { id: 38, bookingReference: 'BK-EXASW8O-UVWWUIOL', userId: 44, tourId: 1, tourDate: '2026-02-05T09:30:00Z', numberOfPassengers: 1, totalPrice: 32400, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-26T13:45:00Z', updatedAt: '2026-01-26T13:45:00Z', User: { id: 44, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:05:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } },
  { id: 39, bookingReference: 'BK-RXASW9P-VWXUUIOL', userId: 45, tourId: 2, tourDate: '2026-02-06T10:15:00Z', numberOfPassengers: 4, totalPrice: 226800, status: 'confirmed', paymentStatus: 'unpaid', createdAt: '2026-01-27T15:30:00Z', updatedAt: '2026-01-28T09:00:00Z', User: { id: 45, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:10:00Z' }, Tour: { id: 2, title: 'Cape Peninsula Tour', price: 56700 } },
  { id: 40, bookingReference: 'BK-TXASW0Q-WXYUUIOL', userId: 46, tourId: 3, tourDate: '2026-02-07T08:45:00Z', numberOfPassengers: 1, totalPrice: 43200, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-28T12:15:00Z', updatedAt: '2026-02-07T14:30:00Z', User: { id: 46, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:15:00Z' }, Tour: { id: 3, title: 'Boulders Beach Tour', price: 43200 } },
  { id: 41, bookingReference: 'BK-YXASW1W-XYYZUIOL', userId: 47, tourId: 4, tourDate: '2026-02-08T12:30:00Z', numberOfPassengers: 2, totalPrice: 151200, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-01-29T14:45:00Z', updatedAt: '2026-01-29T14:45:00Z', User: { id: 47, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:20:00Z' }, Tour: { id: 4, title: 'Cape Winelands Tour', price: 75600 } },
  { id: 42, bookingReference: 'BK-UXASW2E-YZAUUIOL', userId: 48, tourId: 6, tourDate: '2026-02-09T10:00:00Z', numberOfPassengers: 3, totalPrice: 102600, status: 'confirmed', paymentStatus: 'pending', createdAt: '2026-01-30T10:30:00Z', updatedAt: '2026-01-30T10:30:00Z', User: { id: 48, firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@tbtours.test', role: 'customer', verified: true, createdAt: '2026-01-15T10:25:00Z' }, Tour: { id: 6, title: 'Custom Day Tours', price: 34200 } },
  { id: 43, bookingReference: 'BK-IXASW3R-ZABUUIOL', userId: 49, tourId: 1, tourDate: '2026-02-10T09:00:00Z', numberOfPassengers: 2, totalPrice: 64800, status: 'completed', paymentStatus: 'unpaid', createdAt: '2026-01-31T11:00:00Z', updatedAt: '2026-02-10T16:45:00Z', notes: 'Great day out', User: { id: 49, firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@tbtours.test', role: 'customer', verified: false, createdAt: '2026-01-15T10:30:00Z' }, Tour: { id: 1, title: 'Table Mountain Tour', price: 32400 } }
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // Tab Management
  activeTab: 'overview' | 'bookings' | 'users' = 'overview';

  // Users Management
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Bookings Management
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  bookingSearchQuery = '';
  bookingStatusFilter = '';
  paymentStatusFilter = '';
  bookingCurrentPage = 1;
  bookingPageSize = 10;
  bookingTotalPages = 1;

  // Date Filter for Analytics
  dateRange: 'all' | 'year' | 'month' | 'week' | 'day' = 'all';

  // Analytics - Initialize with empty/zero values so they always display
  analytics: Analytics = {
    users: { total: 0, verified: 0, unverified: 0, admins: 0, customers: 0 },
    registrations: { today: 0, thisMonth: 0 }
  };
  bookingAnalytics: BookingAnalytics = {
    bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    payment: { paid: 0, unpaid: 0, totalRevenue: 0 },
    thisMonth: 0,
    topTours: []
  };

  private apiBaseUrl = environment.apiBaseUrl;
  private useMockData = environment.useMockData;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalytics();
    this.loadBookingAnalytics();
    this.loadUsers();
    this.loadBookings();
  }

  onDateRangeChange(range: 'all' | 'year' | 'month' | 'week' | 'day') {
    this.dateRange = range;
    this.loadAnalytics();
    this.loadBookingAnalytics();
  }

  // ============ ANALYTICS METHODS ============
  loadAnalytics() {
    if (this.useMockData) {
      this.analytics = this.filterAnalyticsByDateRange(MOCK_ANALYTICS, MOCK_USERS);
      return;
    }

    this.http.get<{ data: Analytics }>(`${this.apiBaseUrl}/admin/analytics?range=${this.dateRange}`)
      .subscribe({
        next: (response) => {
          this.analytics = response.data;
        },
        error: (error) => {
          this.analytics = this.filterAnalyticsByDateRange(MOCK_ANALYTICS, MOCK_USERS); // Fallback to mock data
        }
      });
  }

  loadBookingAnalytics() {
    if (this.useMockData) {
      this.bookingAnalytics = this.filterBookingAnalyticsByDateRange(MOCK_BOOKING_ANALYTICS, MOCK_BOOKINGS);
      return;
    }

    this.http.get<{ data: BookingAnalytics }>(`${this.apiBaseUrl}/admin/bookings-analytics?range=${this.dateRange}`)
      .subscribe({
        next: (response) => {
          this.bookingAnalytics = response.data;
        },
        error: (error) => {
          this.bookingAnalytics = this.filterBookingAnalyticsByDateRange(MOCK_BOOKING_ANALYTICS, MOCK_BOOKINGS); // Fallback to mock data
        }
      });
  }

  // Helper method to get date range based on filter
  private getDateRange(): { start: Date; end: Date } {
    const now = new Date();
    let start = new Date();

    switch (this.dateRange) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const currentDay = now.getDay();
        start.setDate(now.getDate() - currentDay);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'all':
      default:
        return { start: new Date('2000-01-01'), end: now };
    }

    return { start, end: now };
  }

  // Filter analytics by date range
  private filterAnalyticsByDateRange(analytics: Analytics, users: User[]): Analytics {
    const { start, end } = this.getDateRange();

    const filteredUsers = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      return createdDate >= start && createdDate <= end;
    });

    return {
      users: {
        total: filteredUsers.length,
        verified: filteredUsers.filter(u => u.verified).length,
        unverified: filteredUsers.filter(u => !u.verified).length,
        admins: filteredUsers.filter(u => u.role === 'admin').length,
        customers: filteredUsers.filter(u => u.role === 'customer').length
      },
      registrations: {
        today: filteredUsers.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length,
        thisMonth: filteredUsers.filter(u => {
          const d = new Date(u.createdAt);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length
      }
    };
  }

  // Filter booking analytics by date range
  private filterBookingAnalyticsByDateRange(analytics: BookingAnalytics, bookings: Booking[]): BookingAnalytics {
    const { start, end } = this.getDateRange();

    const filteredBookings = bookings.filter(b => {
      const createdDate = new Date(b.createdAt);
      return createdDate >= start && createdDate <= end;
    });

    const topTours = this.calculateTopTours(filteredBookings);
    const totalRevenue = filteredBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      bookings: {
        total: filteredBookings.length,
        pending: filteredBookings.filter(b => b.status === 'pending').length,
        confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
        completed: filteredBookings.filter(b => b.status === 'completed').length,
        cancelled: filteredBookings.filter(b => b.status === 'cancelled').length
      },
      payment: {
        paid: filteredBookings.filter(b => b.paymentStatus === 'paid').length,
        unpaid: filteredBookings.filter(b => b.paymentStatus === 'unpaid' || b.paymentStatus === 'pending').length,
        totalRevenue
      },
      thisMonth: filteredBookings.filter(b => {
        const d = new Date(b.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      topTours
    };
  }

  // Calculate top tours from bookings
  private calculateTopTours(bookings: Booking[]): Array<{ id: number; title: string; bookingCount: number; totalRevenue: number }> {
    const tourMap = new Map<number, { title: string; bookingCount: number; totalRevenue: number }>();

    bookings.forEach(b => {
      if (!tourMap.has(b.tourId)) {
        tourMap.set(b.tourId, {
          title: b.Tour?.title || `Tour ${b.tourId}`,
          bookingCount: 0,
          totalRevenue: 0
        });
      }
      const tour = tourMap.get(b.tourId)!;
      tour.bookingCount++;
      if (b.paymentStatus === 'paid') {
        tour.totalRevenue += b.totalPrice;
      }
    });

    return Array.from(tourMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);
  }

  // ============ USERS METHODS ============
  loadUsers() {
    if (this.useMockData) {
      this.users = MOCK_USERS;
      this.totalPages = Math.ceil(MOCK_USERS.length / this.pageSize);
      this.filterUsers();
      return;
    }

    this.http.get<{ data: User[]; pagination: any }>(
      `${this.apiBaseUrl}/admin/users?page=${this.currentPage}&limit=${this.pageSize}`
    ).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalPages = response.pagination.pages;
        this.filterUsers();
      },
      error: (error) => {
        this.users = MOCK_USERS; // Fallback to mock data
        this.totalPages = Math.ceil(MOCK_USERS.length / this.pageSize);
        this.filterUsers();
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }

  // ============ BOOKINGS METHODS ============
  loadBookings() {
    if (this.useMockData) {
      this.bookings = MOCK_BOOKINGS;
      this.bookingTotalPages = Math.ceil(MOCK_BOOKINGS.length / this.bookingPageSize);
      this.filterBookings();
      return;
    }

    const params = 'page=' + this.bookingCurrentPage + '&limit=' + this.bookingPageSize;
    this.http.get<{ data: Booking[]; pagination: any }>(
      `${this.apiBaseUrl}/admin/bookings?${params}`
    ).subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.bookingTotalPages = response.pagination.pages;
        this.filterBookings();
      },
      error: (error) => {
        this.bookings = MOCK_BOOKINGS; // Fallback to mock data
        this.bookingTotalPages = Math.ceil(MOCK_BOOKINGS.length / this.bookingPageSize);
        this.filterBookings();
      }
    });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch =
        booking.bookingReference.toLowerCase().includes(this.bookingSearchQuery.toLowerCase()) ||
        (booking.User?.email.toLowerCase().includes(this.bookingSearchQuery.toLowerCase()) ?? false) ||
        (booking.Tour?.title.toLowerCase().includes(this.bookingSearchQuery.toLowerCase()) ?? false);

      const matchesStatus = !this.bookingStatusFilter || booking.status === this.bookingStatusFilter;
      const matchesPayment = !this.paymentStatusFilter || booking.paymentStatus === this.paymentStatusFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }

  cancelBooking(booking: Booking) {
    if (confirm('Cancel booking ' + booking.bookingReference + '?')) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      this.loadBookingAnalytics();
      alert('Booking cancelled successfully');
    }
  }

  markBookingDone(booking: Booking) {
    if (confirm('Mark booking ' + booking.bookingReference + ' as done?')) {
      booking.status = 'completed';
      this.loadBookingAnalytics();
      alert('Booking marked as completed');
    }
  }

  // ============ PAGINATION METHODS ============
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextBookingPage() {
    if (this.bookingCurrentPage < this.bookingTotalPages) {
      this.bookingCurrentPage++;
      this.loadBookings();
    }
  }

  previousBookingPage() {
    if (this.bookingCurrentPage > 1) {
      this.bookingCurrentPage--;
      this.loadBookings();
    }
  }

  // ============ UTILITY METHODS ============
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value: any): string {
    const num = parseFloat(value);
    if (isNaN(num)) return 'R0.00';
    return 'R' + num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
