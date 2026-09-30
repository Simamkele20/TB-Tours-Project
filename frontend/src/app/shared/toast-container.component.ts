import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      @for (toast of toasts; track toast.id) {
        <div
          class="toast show"
          [class]="'bg-' + getBootstrapColor(toast.type)"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style="margin-bottom: 10px;"
        >
          <div class="toast-header" [class]="'bg-' + getBootstrapColor(toast.type) + ' text-' + (toast.type === 'warning' ? 'dark' : 'white')">
            <span class="me-2">{{ toast.icon }}</span>
            <strong class="me-auto">{{ getToastTitle(toast.type) }}</strong>
            <button
              type="button"
              class="btn-close"
              [class]="toast.type === 'warning' ? 'btn-close-dark' : ''"
              (click)="removeToast(toast.id)"
              aria-label="Close"
            ></button>
          </div>
          <div class="toast-body" [class]="'bg-' + getBootstrapColor(toast.type) + ' text-' + (toast.type === 'warning' ? 'dark' : 'white')">
            {{ toast.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      pointer-events: none;
    }
    .toast {
      pointer-events: all;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border: none;
      border-radius: 0.5rem;
    }
    .bg-success { background-color: #28a745 !important; }
    .bg-error { background-color: #dc3545 !important; }
    .bg-info { background-color: #17a2b8 !important; }
    .bg-warning { background-color: #ffc107 !important; }
    .text-white { color: white !important; }
    .text-dark { color: #333 !important; }
    .btn-close {
      filter: brightness(0) invert(1);
    }
    .btn-close-dark {
      filter: none;
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];
  protected toastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.toasts.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getBootstrapColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'success': 'success',
      'error': 'error',
      'info': 'info',
      'warning': 'warning'
    };
    return colorMap[type] || 'info';
  }

  getToastTitle(type: string): string {
    const titles: { [key: string]: string } = {
      'success': 'Success',
      'error': 'Error',
      'info': 'Info',
      'warning': 'Warning'
    };
    return titles[type] || 'Notification';
  }
}
