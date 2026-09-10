import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Tour {
  id?: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  pricePerPerson?: number;
  duration?: string;
  tourType?: string;
  maxPassengers?: number;
  image?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: any[];
  bestTime?: string;
  customizeInfo?: string;
  pleaseNote?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Service & Tour Management</h1>
        <button class="btn-add" (click)="openCreateModal()">+ Add New Tour</button>
      </div>

      <!-- Tours Grid -->
      <div class="tours-grid" *ngIf="!isLoading">
        <div class="tour-card" *ngFor="let tour of tours">
          <div class="tour-card-header">
            <h3>{{ tour.title }}</h3>
            <span class="status" [class.active]="tour.isActive">
              {{ tour.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <p class="tour-description">{{ tour.shortDescription || tour.description | slice: 0: 100 }}</p>
          <div class="tour-meta">
            <div class="meta-item">
              <label>Price:</label>
              <span>R{{ tour.price }}</span>
            </div>
            <div class="meta-item" *ngIf="tour.pricePerPerson">
              <label>Per Person:</label>
              <span>R{{ tour.pricePerPerson }}</span>
            </div>
            <div class="meta-item" *ngIf="tour.duration">
              <label>Duration:</label>
              <span>{{ tour.duration }}</span>
            </div>
            <div class="meta-item" *ngIf="tour.maxPassengers">
              <label>Max Passengers:</label>
              <span>{{ tour.maxPassengers }}</span>
            </div>
          </div>
          <div class="tour-actions">
            <button class="btn-edit" (click)="openEditModal(tour)">Edit</button>
            <button class="btn-delete" (click)="deleteTour(tour.id)">Delete</button>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading tours...</p>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()"></div>

      <!-- Tour Form Modal -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Edit Tour' : 'Create New Tour' }}</h2>
            <button class="btn-close" (click)="closeModal()">✕</button>
          </div>

          <form [formGroup]="tourForm" (ngSubmit)="submitForm()" class="tour-form">
            <!-- Basic Info -->
            <div class="form-section">
              <h3>Basic Information</h3>

              <div class="form-group">
                <label>Tour Title *</label>
                <input type="text" formControlName="title" placeholder="e.g., Cape Peninsula Tours" />
              </div>

              <div class="form-group">
                <label>Slug *</label>
                <input type="text" formControlName="slug" placeholder="e.g., cape-peninsula-tours" />
              </div>

              <div class="form-group">
                <label>Short Description</label>
                <textarea formControlName="shortDescription" rows="2" placeholder="Brief description for listings"></textarea>
              </div>

              <div class="form-group">
                <label>Full Description *</label>
                <textarea formControlName="description" rows="4" placeholder="Detailed tour description"></textarea>
              </div>

              <div class="form-group">
                <label>Tour Image URL</label>
                <input type="text" formControlName="image" placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            <!-- Pricing & Availability -->
            <div class="form-section">
              <h3>Pricing & Availability</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Base Price (R) *</label>
                  <input type="number" formControlName="price" min="0" step="0.01" />
                </div>

                <div class="form-group">
                  <label>Price Per Person (R)</label>
                  <input type="number" formControlName="pricePerPerson" min="0" step="0.01" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Duration</label>
                  <input type="text" formControlName="duration" placeholder="e.g., 8 hours" />
                </div>

                <div class="form-group">
                  <label>Max Passengers</label>
                  <input type="number" formControlName="maxPassengers" min="1" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Tour Type</label>
                  <input type="text" formControlName="tourType" placeholder="e.g., Adventure, Cultural" />
                </div>

                <div class="form-group checkbox">
                  <label>
                    <input type="checkbox" formControlName="isActive" />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <!-- Tour Details -->
            <div class="form-section">
              <h3>Tour Details</h3>

              <div class="form-group">
                <label>Best Time to Visit</label>
                <input type="text" formControlName="bestTime" placeholder="e.g., September to May" />
              </div>

              <div class="form-group">
                <label>Customization Info</label>
                <textarea formControlName="customizeInfo" rows="3" placeholder="Information about customization options"></textarea>
              </div>

              <div class="form-group">
                <label>Important Notes</label>
                <textarea formControlName="pleaseNote" rows="3" placeholder="Any important information guests should know"></textarea>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-submit" [disabled]="!tourForm.valid || isSubmitting">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Tour' : 'Create Tour') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #0a1530;
      color: #fff;
      padding-top: 120px;
      padding: 120px 2rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #f2b112;
    }

    .admin-header h1 {
      font-size: 2rem;
      color: #f2b112;
      margin: 0;
    }

    .btn-add {
      background: linear-gradient(135deg, #f2b112, #ffc94d);
      color: #0f1419;
      border: none;
      padding: 0.75rem 1.5rem;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(242, 177, 18, 0.3);
    }

    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .tour-card {
      background: linear-gradient(135deg, #1a2d5a 0%, #0f1e45 100%);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .tour-card:hover {
      border-color: #f2b112;
      box-shadow: 0 8px 24px rgba(242, 177, 18, 0.15);
    }

    .tour-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .tour-card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #f2b112;
      flex: 1;
    }

    .status {
      background: #2a5c2a;
      color: #7efa7e;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .status:not(.active) {
      background: #5c2a2a;
      color: #fa7e7e;
    }

    .tour-description {
      color: #b3c1d8;
      margin: 0 0 1rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .tour-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem 0;
      border-top: 1px solid rgba(242, 177, 18, 0.1);
      border-bottom: 1px solid rgba(242, 177, 18, 0.1);
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-item label {
      color: #7a8a9e;
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
    }

    .meta-item span {
      color: #f2b112;
      font-weight: 700;
    }

    .tour-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-edit {
      background: rgba(242, 177, 18, 0.2);
      color: #f2b112;
      border: 1px solid #f2b112;
    }

    .btn-edit:hover {
      background: #f2b112;
      color: #0f1419;
    }

    .btn-delete {
      background: rgba(250, 126, 126, 0.2);
      color: #fa7e7e;
      border: 1px solid #fa7e7e;
    }

    .btn-delete:hover {
      background: #fa7e7e;
      color: #0f1419;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #b3c1d8;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 99;
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #0a1530;
      border: 1px solid #f2b112;
      border-radius: 8px;
      z-index: 100;
      max-height: 90vh;
      overflow-y: auto;
      width: 90%;
      max-width: 600px;
    }

    .modal-content {
      padding: 2rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(242, 177, 18, 0.2);
    }

    .modal-header h2 {
      margin: 0;
      color: #f2b112;
    }

    .btn-close {
      background: none;
      border: none;
      color: #b3c1d8;
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .btn-close:hover {
      color: #f2b112;
    }

    .tour-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section h3 {
      font-size: 1.1rem;
      color: #f2b112;
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(242, 177, 18, 0.2);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      color: #b3c1d8;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea {
      background: #1a2d5a;
      border: 1px solid rgba(242, 177, 18, 0.2);
      color: #fff;
      padding: 0.75rem;
      border-radius: 4px;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #f2b112;
      box-shadow: 0 0 0 3px rgba(242, 177, 18, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-group.checkbox {
      flex-direction: row;
      align-items: center;
      margin-top: 0.5rem;
    }

    .form-group.checkbox input {
      width: auto;
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .form-group.checkbox label {
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid #7a8a9e;
      color: #b3c1d8;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel:hover {
      border-color: #f2b112;
      color: #f2b112;
    }

    .btn-submit {
      background: linear-gradient(135deg, #f2b112, #ffc94d);
      color: #0f1419;
      border: none;
      padding: 0.75rem 2rem;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(242, 177, 18, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 100px 1rem 2rem;
      }

      .admin-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .tours-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal {
        width: 95%;
      }
    }
  `]
})
export class AdminToursComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  tours: Tour[] = [];
  tourForm!: FormGroup;
  showModal = false;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  currentEditingTourId: number | null = null;

  ngOnInit() {
    this.initializeForm();
    this.loadTours();
  }

  initializeForm() {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      pricePerPerson: [null],
      duration: [''],
      tourType: [''],
      maxPassengers: [null],
      image: [''],
      bestTime: [''],
      customizeInfo: [''],
      pleaseNote: [''],
      isActive: [true],
    });
  }

  loadTours() {
    this.isLoading = true;
    this.http.get<{ data: Tour[] }>(`${environment.apiBaseUrl}/tours`)
      .subscribe({
        next: (response) => {
          this.tours = response.data;
          this.cdr.detectChanges();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          alert('Failed to load tours');
        }
      });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentEditingTourId = null;
    this.tourForm.reset({ isActive: true });
    this.showModal = true;
  }

  openEditModal(tour: Tour) {
    this.isEditMode = true;
    this.currentEditingTourId = tour.id || null;
    this.tourForm.patchValue(tour);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.tourForm.reset({ isActive: true });
  }

  submitForm() {
    if (!this.tourForm.valid) return;

    this.isSubmitting = true;
    const formValue = this.tourForm.value;

    if (this.isEditMode && this.currentEditingTourId) {
      this.http.put<{ data: Tour }>(
        `${environment.apiBaseUrl}/tours/${this.currentEditingTourId}`,
        formValue
      ).subscribe({
        next: () => {
          alert('Tour updated successfully');
          this.closeModal();
          this.loadTours();
          this.isSubmitting = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to update tour');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post<{ data: Tour }>(
        `${environment.apiBaseUrl}/tours`,
        formValue
      ).subscribe({
        next: () => {
          alert('Tour created successfully');
          this.closeModal();
          this.loadTours();
          this.isSubmitting = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to create tour');
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteTour(tourId?: number) {
    if (!tourId) return;

    if (!confirm('Are you sure you want to delete this tour?')) return;

    this.http.delete<{ message: string }>(
      `${environment.apiBaseUrl}/tours/${tourId}`
    ).subscribe({
      next: () => {
        alert('Tour deleted successfully');
        this.loadTours();
      },
      error: (error) => {
        alert(error?.error?.error || 'Failed to delete tour');
      }
    });
  }
}
