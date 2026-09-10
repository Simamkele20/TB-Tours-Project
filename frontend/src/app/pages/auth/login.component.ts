import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1>Login to TB Tours</h1>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div class="form-section">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="your@email.com"
                [class.invalid]="isFieldInvalid('email')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('email')">
                {{ getFieldError('email') }}
              </span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Enter your password"
                [class.invalid]="isFieldInvalid('password')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('password')">
                {{ getFieldError('password') }}
              </span>
            </div>

            <!-- Remember Me -->
            <div class="form-group checkbox">
              <input
                id="remember"
                type="checkbox"
                formControlName="rememberMe"
              />
              <label for="remember">Remember me</label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!loginForm.valid || authService.isLoading()"
            >
              {{ authService.isLoading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <!-- Forgot Password Link -->
          <div class="forgot-password-link">
            <a routerLink="/auth/forgot-password">Forgot your password?</a>
          </div>

          <!-- Register Link -->
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(8, 10, 14, 0.85), rgba(8, 10, 14, 0.75)),
                  url('/images/camp-bay.jpg') center / cover no-repeat;
      padding: 0px;
      margin-top: 100px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 450px;
      overflow: hidden;
    }

    .auth-header {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
      border-bottom: 3px solid #f2b112;
    }

    .auth-logo {
      height: 50px;
      width: auto;
      margin-bottom: 20px;
      display: block;
    }

    .auth-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .form-section {
      padding: 40px 30px;
    }

    .error-alert {
      background-color: #fee;
      border-left: 4px solid #e74c3c;
      color: #c33;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 25px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 22px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input[type='email'],
    input[type='password'],
    input[type='text'] {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 15px;
      font-family: inherit;
      transition: all 0.3s ease;
      box-sizing: border-box;
      background: #f9f9f9;
    }

    input[type='email']:focus,
    input[type='password']:focus,
    input[type='text']:focus {
      outline: none;
      background: white;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    input.invalid {
      border-color: #e74c3c;
      background: #fef5f5;
    }

    .error-text {
      color: #e74c3c;
      font-size: 13px;
      margin-top: 6px;
      display: block;
      font-weight: 500;
    }

    .checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 22px;
    }

    input[type='checkbox'] {
      margin-right: 10px;
      cursor: pointer;
      width: 18px;
      height: 18px;
      accent-color: #f2b112;
    }

    .checkbox label {
      margin: 0;
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
      color: #666;
      text-transform: none;
      letter-spacing: normal;
    }

    .btn {
      padding: 14px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f2b112, #ffc94d);
      color: #0f1419;
      margin-bottom: 12px;
      font-weight: 700;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(242, 177, 18, 0.4);
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .forgot-password-link {
      text-align: center;
      margin-bottom: 20px;
    }

    .forgot-password-link a {
      color: #f2b112;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .forgot-password-link a:hover {
      color: #ffc94d;
      text-decoration: underline;
    }

    .auth-footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #f0f0f0;
    }

    .auth-footer p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .auth-footer a {
      color: #f2b112;
      text-decoration: none;
      font-weight: 700;
      transition: color 0.3s ease;
    }

    .auth-footer a:hover {
      color: #ffc94d;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        border-radius: 8px;
      }

      .auth-header,
      .form-section {
        padding: 30px 20px;
      }

      .auth-header h1 {
        font-size: 24px;
      }

      input[type='email'],
      input[type='password'],
      input[type='text'] {
        padding: 12px 14px;
        font-size: 16px;
      }

      .btn {
        padding: 12px 20px;
        font-size: 15px;
      }
    }
  `],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to home
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    this.authService.clearError();
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm.valid) {
      return;
    }

    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);

      // Redirect to return URL or home
      this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      this.errorMessage =
        error?.error?.error || 'Login failed. Please check your credentials.';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.errors['email']) {
      return 'Invalid email address';
    }
    if (field.errors['minlength']) {
      return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid input';
  }
}
