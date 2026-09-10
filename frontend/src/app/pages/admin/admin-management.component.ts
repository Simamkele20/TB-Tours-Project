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

interface Destination {
  id?: number;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  duration?: string;
  image?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: any[];
  bestTime?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-wrapper">
        <div class="admin-header">
          <h1>Services & Content Management</h1>
          <p class="subtitle">Manage tours/services and featured destinations</p>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'tours'"
          (click)="activeTab = 'tours'"
        >
          <i class="bi bi-map" aria-hidden="true"></i> Services & Tours
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'destinations'"
          (click)="activeTab = 'destinations'"
        >
          <i class="bi bi-geo-alt" aria-hidden="true"></i> Featured Destinations
        </button>
      </div>

      <!-- Tours Tab -->
      @if (activeTab === 'tours') {
        <div class="tab-content tours-tab">
          <div class="tab-header">
            <h2>Services & Tours Management</h2>
            <button class="btn-add" (click)="openCreateTourModal()">+ Add New Tour</button>
          </div>

          <!-- Tours Grid -->
          <div class="tours-grid" *ngIf="!isLoadingTours">
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
              </div>
              <div class="tour-actions">
                <button class="btn-edit" (click)="openEditTourModal(tour)">Edit</button>
                <button class="btn-delete" (click)="deleteTour(tour.id)">Delete</button>
              </div>
            </div>
          </div>

          <div class="loading" *ngIf="isLoadingTours">
            <p>Loading tours...</p>
          </div>
        </div>
      }

      <!-- Destinations Tab -->
      @if (activeTab === 'destinations') {
        <div class="tab-content destinations-tab">
          <div class="tab-header">
            <h2>Featured Destinations</h2>
            <button class="btn-add" (click)="openCreateDestModal()">+ Add Destination</button>
          </div>

          <!-- Destinations Grid -->
          <div class="destinations-grid" *ngIf="!isLoadingDestinations">
            <div class="destination-card" *ngFor="let dest of destinations">
              <div class="dest-image">
                <img [src]="dest.image" [alt]="dest.title" *ngIf="dest.image; else noImage">
                <ng-template #noImage>
                  <i class="bi bi-image" aria-hidden="true"></i>
                </ng-template>
              </div>
              <div class="dest-content">
                <h3>{{ dest.title }}</h3>
                <p class="dest-duration">{{ dest.duration }}</p>
                <p class="dest-description">{{ dest.description | slice: 0: 100 }}...</p>
                <div class="dest-highlights">
                  <span class="badge" *ngFor="let highlight of dest.highlights | slice: 0: 3">
                    {{ highlight }}
                  </span>
                </div>
              </div>
              <div class="dest-actions">
                <button class="btn-edit" (click)="openEditDestModal(dest)">Edit</button>
                <button class="btn-delete" (click)="deleteDestination(dest.id)">Delete</button>
              </div>
            </div>
          </div>

          <div class="loading" *ngIf="isLoadingDestinations">
            <p>Loading destinations...</p>
          </div>
        </div>
      }

      <!-- Modal Backdrop -->
      <div class="modal-backdrop" *ngIf="showTourModal" (click)="closeTourModal()"></div>

      <!-- Tour Form Modal -->
      <div class="modal" *ngIf="showTourModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditingTour ? 'Edit Tour' : 'Create New Tour' }}</h2>
            <button class="btn-close" (click)="closeTourModal()">✕</button>
          </div>

          <form [formGroup]="tourForm" (ngSubmit)="submitTourForm()" class="tour-form">
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

              <div class="form-group checkbox">
                <label>
                  <input type="checkbox" formControlName="isActive" />
                  Active
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeTourModal()">Cancel</button>
              <button type="submit" class="btn-submit" [disabled]="!tourForm.valid || isSubmittingTour">
                {{ isSubmittingTour ? 'Saving...' : (isEditingTour ? 'Update Tour' : 'Create Tour') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Destination Modal -->
      <div class="modal-backdrop" *ngIf="showDestModal" (click)="closeDestModal()"></div>
      <div class="modal" *ngIf="showDestModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditingDest ? 'Edit Destination' : 'Create New Destination' }}</h2>
            <button class="btn-close" (click)="closeDestModal()">✕</button>
          </div>

          <form [formGroup]="destForm" (ngSubmit)="submitDestForm()" class="tour-form">
            <!-- Basic Info -->
            <div class="form-section">
              <h3>Basic Information</h3>

              <div class="form-group">
                <label>Destination Title *</label>
                <input type="text" formControlName="title" placeholder="e.g., Cape Peninsula" />
              </div>

              <div class="form-group">
                <label>Slug *</label>
                <input type="text" formControlName="slug" placeholder="e.g., cape-peninsula" />
              </div>

              <div class="form-group">
                <label>Short Description</label>
                <textarea formControlName="shortDescription" rows="2" placeholder="Brief description"></textarea>
              </div>

              <div class="form-group">
                <label>Full Description *</label>
                <textarea formControlName="description" rows="4" placeholder="Detailed description"></textarea>
              </div>

              <div class="form-group">
                <label>Image URL</label>
                <input type="text" formControlName="image" placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            <!-- Details -->
            <div class="form-section">
              <h3>Details</h3>

              <div class="form-group">
                <label>Duration</label>
                <input type="text" formControlName="duration" placeholder="e.g., 8 hours" />
              </div>

              <div class="form-group">
                <label>Best Time to Visit</label>
                <input type="text" formControlName="bestTime" placeholder="e.g., September to May" />
              </div>

              <div class="form-group checkbox">
                <label>
                  <input type="checkbox" formControlName="isActive" />
                  Active
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeDestModal()">Cancel</button>
              <button type="submit" class="btn-submit" [disabled]="!destForm.valid || isSubmittingDest">
                {{ isSubmittingDest ? 'Saving...' : (isEditingDest ? 'Update Destination' : 'Create Destination') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #0a1530;
      color: #fff;
      padding: 120px 0 3rem 0;
    }

    .admin-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .admin-header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #f2b112;
    }

    .admin-header h1 {
      font-size: 2rem;
      color: #f2b112;
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: #b3c1d8;
      margin: 0;
      font-size: 0.95rem;
    }

    /* Tab Navigation */
    .tab-navigation {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(242, 177, 18, 0.2);
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: #b3c1d8;
      padding: 1rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      color: #f2b112;
    }

    .tab-btn.active {
      color: #f2b112;
      border-bottom-color: #f2b112;
    }

    .tab-btn i {
      font-size: 1.2rem;
    }

    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(242, 177, 18, 0.2);
    }

    .tab-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #f2b112;
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

    /* Tours Grid */
    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
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
      gap: 1rem;
    }

    .tour-card-header h3 {
      margin: 0;
      font-size: 1.1rem;
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
      white-space: nowrap;
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
      padding: 0.6rem;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.85rem;
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

    /* Destinations Grid */
    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .destination-card {
      background: linear-gradient(135deg, #1a2d5a 0%, #0f1e45 100%);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .destination-card:hover {
      border-color: #f2b112;
      box-shadow: 0 8px 24px rgba(242, 177, 18, 0.15);
    }

    .dest-image {
      height: 180px;
      background: linear-gradient(135deg, rgba(242, 177, 18, 0.1), rgba(255, 201, 77, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(242, 177, 18, 0.2);
      overflow: hidden;
    }

    .dest-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dest-image i {
      font-size: 3rem;
      color: rgba(242, 177, 18, 0.3);
    }

    .dest-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .dest-content h3 {
      margin: 0 0 0.5rem;
      color: #f2b112;
      font-size: 1.1rem;
    }

    .dest-duration {
      color: #ffc94d;
      font-size: 0.85rem;
      font-weight: 600;
      margin: 0 0 0.75rem;
    }

    .dest-description {
      color: #b3c1d8;
      font-size: 0.9rem;
      margin: 0 0 1rem;
      flex: 1;
    }

    .dest-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .badge {
      background: rgba(242, 177, 18, 0.2);
      color: #ffc94d;
      padding: 0.3rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .dest-actions {
      padding: 1rem;
      border-top: 1px solid rgba(242, 177, 18, 0.2);
      display: flex;
      gap: 0.5rem;
    }

    .loading, .info-box {
      text-align: center;
      padding: 3rem 2rem;
      color: #b3c1d8;
      background: linear-gradient(135deg, #1a2d5a 0%, #0f1e45 100%);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      margin-top: 2rem;
    }

    .info-box i {
      font-size: 1.5rem;
      color: #f2b112;
      flex-shrink: 0;
    }

    .info-box p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
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
      font-size: 1rem;
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
      .admin-wrapper {
        padding: 0 1rem;
      }

      .tab-navigation {
        flex-wrap: wrap;
      }

      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .tours-grid, .destinations-grid {
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
export class AdminManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'tours' | 'destinations' = 'tours';

  // Tours
  tours: Tour[] = [];
  tourForm!: FormGroup;
  showTourModal = false;
  isEditingTour = false;
  isLoadingTours = false;
  isSubmittingTour = false;
  currentEditingTourId: number | null = null;

  // Destinations
  destinations: Destination[] = [];
  destForm!: FormGroup;
  showDestModal = false;
  isEditingDest = false;
  isLoadingDestinations = false;
  isSubmittingDest = false;
  currentEditingDestId: number | null = null;

  ngOnInit() {
    this.initializeTourForm();
    this.initializeDestForm();
    this.loadTours();
    this.loadDestinations();
  }

  initializeDestForm() {
    this.destForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: [''],
      duration: [''],
      image: [''],
      bestTime: [''],
      isActive: [true],
    });
  }

  initializeTourForm() {
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

  // ===== TOURS METHODS =====
  loadTours() {
    this.isLoadingTours = true;
    this.http.get<{ data: Tour[] }>(`${environment.apiBaseUrl}/tours`)
      .subscribe({
        next: (response) => {
          this.tours = response.data;
          this.cdr.detectChanges();
          this.isLoadingTours = false;
        },
        error: (error) => {
          this.isLoadingTours = false;
          alert('Failed to load tours');
        }
      });
  }

  openCreateTourModal() {
    this.isEditingTour = false;
    this.currentEditingTourId = null;
    this.tourForm.reset({ isActive: true });
    this.showTourModal = true;
  }

  openEditTourModal(tour: Tour) {
    this.isEditingTour = true;
    this.currentEditingTourId = tour.id || null;
    this.tourForm.patchValue(tour);
    this.showTourModal = true;
  }

  closeTourModal() {
    this.showTourModal = false;
    this.tourForm.reset({ isActive: true });
  }

  submitTourForm() {
    if (!this.tourForm.valid) return;

    this.isSubmittingTour = true;
    const formValue = this.tourForm.value;

    if (this.isEditingTour && this.currentEditingTourId) {
      this.http.put<{ data: Tour }>(
        `${environment.apiBaseUrl}/tours/${this.currentEditingTourId}`,
        formValue
      ).subscribe({
        next: () => {
          alert('Tour updated successfully');
          this.closeTourModal();
          this.loadTours();
          this.isSubmittingTour = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to update tour');
          this.isSubmittingTour = false;
        }
      });
    } else {
      this.http.post<{ data: Tour }>(
        `${environment.apiBaseUrl}/tours`,
        formValue
      ).subscribe({
        next: () => {
          alert('Tour created successfully');
          this.closeTourModal();
          this.loadTours();
          this.isSubmittingTour = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to create tour');
          this.isSubmittingTour = false;
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

  // ===== DESTINATIONS METHODS =====
  loadDestinations() {
    this.isLoadingDestinations = true;
    this.http.get<{ data: Destination[] }>(`${environment.apiBaseUrl}/destinations`)
      .subscribe({
        next: (response) => {
          this.destinations = response.data;
          this.cdr.detectChanges();
          this.isLoadingDestinations = false;
        },
        error: (error) => {
          this.isLoadingDestinations = false;
          alert('Failed to load destinations');
        }
      });
  }

  openCreateDestModal() {
    this.isEditingDest = false;
    this.currentEditingDestId = null;
    this.destForm.reset({ isActive: true });
    this.showDestModal = true;
  }

  openEditDestModal(dest: Destination) {
    this.isEditingDest = true;
    this.currentEditingDestId = dest.id || null;
    this.destForm.patchValue(dest);
    this.showDestModal = true;
  }

  closeDestModal() {
    this.showDestModal = false;
    this.destForm.reset({ isActive: true });
  }

  submitDestForm() {
    if (!this.destForm.valid) return;

    this.isSubmittingDest = true;
    const formValue = this.destForm.value;

    if (this.isEditingDest && this.currentEditingDestId) {
      this.http.put<{ data: Destination }>(
        `${environment.apiBaseUrl}/destinations/${this.currentEditingDestId}`,
        formValue
      ).subscribe({
        next: () => {
          alert('Destination updated successfully');
          this.closeDestModal();
          this.loadDestinations();
          this.isSubmittingDest = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to update destination');
          this.isSubmittingDest = false;
        }
      });
    } else {
      this.http.post<{ data: Destination }>(
        `${environment.apiBaseUrl}/destinations`,
        formValue
      ).subscribe({
        next: () => {
          alert('Destination created successfully');
          this.closeDestModal();
          this.loadDestinations();
          this.isSubmittingDest = false;
        },
        error: (error) => {
          alert(error?.error?.error || 'Failed to create destination');
          this.isSubmittingDest = false;
        }
      });
    }
  }

  deleteDestination(destId?: number) {
    if (!destId) return;

    if (!confirm('Are you sure you want to delete this destination?')) return;

    this.http.delete<{ message: string }>(
      `${environment.apiBaseUrl}/destinations/${destId}`
    ).subscribe({
      next: () => {
        alert('Destination deleted successfully');
        this.loadDestinations();
      },
      error: (error) => {
        alert(error?.error?.error || 'Failed to delete destination');
      }
    });
  }
}
