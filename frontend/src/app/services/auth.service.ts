import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer' | 'admin';
    verified: boolean;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin';
  verified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = environment.apiBaseUrl;
  private readonly TOKEN_KEY = 'auth_token';

  // Signals for reactive state
  private userSignal = signal<User | null>(this.loadUserFromStorage());
  private tokenSignal = signal<string | null>(this.getToken());
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isLoading = computed(() => this.isLoadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {
    this.validateTokenOnInit();
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, {
          firstName,
          lastName,
          email,
          password,
          confirmPassword: password,
        })
      );
      return response;
    } catch (error: any) {
      const errorMsg =
        error?.error?.error || 'Registration failed. Please try again.';
      this.errorSignal.set(errorMsg);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Verify email with code
   */
  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/verify-email`, {
          email,
          code,
        })
      );
      return response;
    } catch (error: any) {
      const errorMsg =
        error?.error?.error || 'Email verification failed. Please try again.';
      this.errorSignal.set(errorMsg);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, {
          email,
          password,
        })
      );

      // Store token and user
      if (response.token) {
        this.setToken(response.token);
        this.userSignal.set(response.user);
      }

      return response;
    } catch (error: any) {
      const errorMsg =
        error?.error?.error || 'Login failed. Please check your credentials.';
      this.errorSignal.set(errorMsg);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Request password reset code
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.apiBaseUrl}/auth/forgot-password`, {
          email,
        })
      );
      return response;
    } catch (error: any) {
      const errorMsg = error?.error?.error || 'Password reset request failed.';
      this.errorSignal.set(errorMsg);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Reset password with code
   */
  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/reset-password`, {
          email,
          code,
          newPassword,
          confirmPassword: newPassword,
        })
      );
      return response;
    } catch (error: any) {
      const errorMsg =
        error?.error?.error || 'Password reset failed. Please try again.';
      this.errorSignal.set(errorMsg);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.clearToken();
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.errorSignal.set(null);
  }

  /**
   * Set token in storage and signal
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  /**
   * Get token from storage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Clear token from storage
   */
  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Load user from storage (parse from JWT if available)
   */
  private loadUserFromStorage(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode JWT manually (without verification, since we trust localStorage)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(atob(parts[1]));
      return {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        role: decoded.role,
        verified: decoded.verified,
      };
    } catch {
      return null;
    }
  }

  /**
   * Validate token on app initialization
   */
  private validateTokenOnInit(): void {
    const token = this.getToken();
    if (!token) return;

    // Optionally, call /auth/me to validate token with backend
    // For now, we trust the stored token
  }

  /**
   * Refresh current user from backend
   */
  async refreshUser(): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    try {
      const response = await lastValueFrom(
        this.http.get<{ user: User }>(`${this.apiBaseUrl}/auth/me`)
      );
      this.userSignal.set(response.user);
    } catch (error) {
      console.error('Failed to refresh user', error);
      // If token is invalid, logout
      this.logout();
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
