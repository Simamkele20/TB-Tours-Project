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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">System Management & Analytics</p>
      </header>

      <div class="admin-content">
        <!-- Analytics Section -->
        <section class="analytics-section" *ngIf="analytics">
          <h2>System Analytics</h2>
          <div class="analytics-grid">
            <div class="stat-card">
              <div class="stat-value">{{ analytics.users.total }}</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card verified">
              <div class="stat-value">{{ analytics.users.verified }}</div>
              <div class="stat-label">Verified Users</div>
            </div>
            <div class="stat-card warning">
              <div class="stat-value">{{ analytics.users.unverified }}</div>
              <div class="stat-label">Unverified</div>
            </div>
            <div class="stat-card admin">
              <div class="stat-value">{{ analytics.users.admins }}</div>
              <div class="stat-label">Admins</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ analytics.users.customers }}</div>
              <div class="stat-label">Customers</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ analytics.registrations.today }}</div>
              <div class="stat-label">Registered Today</div>
            </div>
          </div>
        </section>

        <!-- User Management Section -->
        <section class="users-section">
          <h2>User Management</h2>

          <div class="users-controls">
            <input
              type="text"
              placeholder="Search users..."
              class="search-input"
              [(ngModel)]="searchQuery"
              (keyup)="filterUsers()"
            />
            <select class="filter-select" [(ngModel)]="roleFilter" (change)="filterUsers()">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div class="users-table-wrapper">
            <table class="users-table" *ngIf="filteredUsers.length > 0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers">
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="user.role === 'admin' ? 'admin' : 'customer'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <span class="status" [ngClass]="user.verified ? 'verified' : 'unverified'">
                      {{ user.verified ? 'Verified' : 'Unverified' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td class="actions">
                    <button class="btn-small edit-btn" (click)="editUser(user)">Edit</button>
                    <button class="btn-small delete-btn" (click)="deleteUser(user)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="no-users" *ngIf="filteredUsers.length === 0">
              <p>No users found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button
              class="btn-pagination"
              (click)="previousPage()"
              [disabled]="currentPage === 1"
            >
              Previous
            </button>
            <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              class="btn-pagination"
              (click)="nextPage()"
              [disabled]="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #0a1530;
      color: #fff;
      padding-top: 120px;
    }

    .admin-header {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      padding: 3rem 2rem;
      border-bottom: 2px solid #f2b112;
      text-align: center;
    }

    .admin-header h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #f2b112;
      font-weight: 700;
    }

    .admin-header .subtitle {
      margin: 0.5rem 0 0;
      color: #b3c1d8;
      font-size: 1rem;
    }

    .admin-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    section {
      margin-bottom: 3rem;
      background: rgba(10, 21, 48, 0.5);
      border: 1px solid rgba(242, 177, 18, 0.2);
      border-radius: 8px;
      padding: 2rem;
      backdrop-filter: blur(4px);
    }

    section h2 {
      margin: 0 0 1.5rem 0;
      color: #f2b112;
      font-size: 1.5rem;
      border-bottom: 2px solid rgba(242, 177, 18, 0.3);
      padding-bottom: 1rem;
    }

    /* Analytics Section */
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, rgba(242, 177, 18, 0.1) 0%, rgba(242, 177, 18, 0.05) 100%);
      border: 1px solid rgba(242, 177, 18, 0.3);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: linear-gradient(135deg, rgba(242, 177, 18, 0.15) 0%, rgba(242, 177, 18, 0.1) 100%);
      border-color: #f2b112;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.2);
    }

    .stat-card.verified {
      border-color: rgba(76, 175, 80, 0.3);
    }

    .stat-card.warning {
      border-color: rgba(255, 152, 0, 0.3);
    }

    .stat-card.admin {
      border-color: rgba(33, 150, 243, 0.3);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #f2b112;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #b3c1d8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* User Management Section */
    .users-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem 1rem;
      background: rgba(10, 21, 48, 0.8);
      border: 1px solid rgba(242, 177, 18, 0.3);
      border-radius: 4px;
      color: #fff;
      font-size: 0.95rem;
      flex: 1;
      min-width: 200px;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #f2b112;
      box-shadow: 0 0 8px rgba(242, 177, 18, 0.2);
    }

    .search-input::placeholder {
      color: #7a8a9e;
    }

    .users-table-wrapper {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid rgba(242, 177, 18, 0.2);
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(10, 21, 48, 0.3);
    }

    .users-table thead tr {
      background: linear-gradient(90deg, rgba(242, 177, 18, 0.1) 0%, rgba(242, 177, 18, 0.05) 100%);
      border-bottom: 2px solid rgba(242, 177, 18, 0.3);
    }

    .users-table th {
      padding: 1rem;
      text-align: left;
      color: #f2b112;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }

    .users-table tbody tr {
      border-bottom: 1px solid rgba(242, 177, 18, 0.1);
      transition: background-color 0.2s ease;
    }

    .users-table tbody tr:hover {
      background: rgba(242, 177, 18, 0.05);
    }

    .users-table td {
      padding: 1rem;
      color: #b3c1d8;
      font-size: 0.95rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge.admin {
      background: rgba(33, 150, 243, 0.2);
      color: #42a5f5;
      border: 1px solid rgba(33, 150, 243, 0.4);
    }

    .badge.customer {
      background: rgba(242, 177, 18, 0.2);
      color: #f2b112;
      border: 1px solid rgba(242, 177, 18, 0.4);
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status.verified {
      background: rgba(76, 175, 80, 0.2);
      color: #81c784;
      border: 1px solid rgba(76, 175, 80, 0.4);
    }

    .status.unverified {
      background: rgba(255, 152, 0, 0.2);
      color: #ffb74d;
      border: 1px solid rgba(255, 152, 0, 0.4);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-small {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .edit-btn {
      background: rgba(33, 150, 243, 0.2);
      color: #42a5f5;
      border: 1px solid rgba(33, 150, 243, 0.4);
    }

    .edit-btn:hover {
      background: rgba(33, 150, 243, 0.3);
      border-color: #42a5f5;
    }

    .delete-btn {
      background: rgba(244, 67, 54, 0.2);
      color: #ef5350;
      border: 1px solid rgba(244, 67, 54, 0.4);
    }

    .delete-btn:hover {
      background: rgba(244, 67, 54, 0.3);
      border-color: #ef5350;
    }

    .no-users {
      padding: 2rem;
      text-align: center;
      color: #7a8a9e;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-pagination {
      padding: 0.6rem 1.2rem;
      background: rgba(242, 177, 18, 0.1);
      border: 1px solid rgba(242, 177, 18, 0.3);
      border-radius: 4px;
      color: #f2b112;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-pagination:hover:not(:disabled) {
      background: rgba(242, 177, 18, 0.2);
      border-color: #f2b112;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #b3c1d8;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding-top: 100px;
      }

      .admin-header h1 {
        font-size: 1.8rem;
      }

      .admin-content {
        padding: 1rem;
      }

      section {
        padding: 1.5rem;
      }

      .analytics-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .users-controls {
        flex-direction: column;
      }

      .search-input,
      .filter-select {
        min-width: unset;
      }

      .users-table th,
      .users-table td {
        padding: 0.75rem 0.5rem;
        font-size: 0.85rem;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  analytics: Analytics | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  searchQuery = '';
  roleFilter = '';

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalytics();
    this.loadUsers();
  }

  loadAnalytics() {
    this.http.get<{ data: Analytics }>(`${this.apiBaseUrl}/admin/analytics`)
      .subscribe({
        next: (response) => {
          this.analytics = response.data;
        },
        error: (error) => {
          console.error('Failed to load analytics:', error);
        }
      });
  }

  loadUsers() {
    this.http.get<{ data: User[]; pagination: any }>(`${this.apiBaseUrl}/admin/users?page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalPages = response.pagination.pages;
          this.filterUsers();
        },
        error: (error) => {
          console.error('Failed to load users:', error);
        }
      });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  editUser(user: User) {
    console.log('Edit user:', user);
    // TODO: Implement edit modal
  }

  deleteUser(user: User) {
    if (confirm(`Delete ${user.email}? This action cannot be undone.`)) {
      this.http.delete(`${this.apiBaseUrl}/admin/users/${user.id}`)
        .subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.filterUsers();
            alert('User deleted successfully');
          },
          error: (error) => {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
          }
        });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

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
}
