import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts: Observable<Toast[]> = this.toasts$.asObservable();

  private toastCounter = 0;

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 4000
  ): void {
    const id = `toast-${this.toastCounter++}`;
    const icon = this.getIconForType(type);

    const toast: Toast = {
      id,
      message,
      type,
      duration,
      icon
    };

    const currentToasts = this.toasts$.getValue();
    this.toasts$.next([...currentToasts, toast]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration ?? 6000); // Longer duration for errors
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  remove(id: string): void {
    const currentToasts = this.toasts$.getValue();
    this.toasts$.next(currentToasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }

  private getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      'success': '✓',
      'error': '✕',
      'info': 'ℹ',
      'warning': '⚠'
    };
    return icons[type] || '';
  }
}
