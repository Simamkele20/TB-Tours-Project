import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <!-- Header -->
        <div class="register-header">
          <h1>Create your TB Tours Account</h1>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <!-- Step 1: Register -->
        <div *ngIf="step === 1" class="form-section">
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <!-- First Name Field -->
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                placeholder="John"
                [class.invalid]="isFieldInvalid('firstName')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('firstName')">
                {{ getFieldError('firstName') }}
              </span>
            </div>

            <!-- Last Name Field -->
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                formControlName="lastName"
                placeholder="Doe"
                [class.invalid]="isFieldInvalid('lastName')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('lastName')">
                {{ getFieldError('lastName') }}
              </span>
            </div>

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
                placeholder="At least 8 characters"
                [class.invalid]="isFieldInvalid('password')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('password')">
                {{ getFieldError('password') }}
              </span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                placeholder="Re-enter your password"
                [class.invalid]="isFieldInvalid('confirmPassword')"
              />
              <span class="error-text" *ngIf="isFieldInvalid('confirmPassword')">
                {{ getFieldError('confirmPassword') }}
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!registerForm.valid || authService.isLoading()"
            >
              {{ authService.isLoading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Login Link -->
          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login">Login here</a></p>
          </div>
        </div>

        <!-- Step 2: Verify Email -->
        <div *ngIf="step === 2" class="form-section">
          <p class="step-description">
            We've sent a verification code to <strong>{{ registeredEmail }}</strong>
          </p>

          <form [formGroup]="verifyForm" (ngSubmit)="onVerify()">
            <!-- Code Field -->
            <div class="form-group">
              <label for="code">Verification Code</label>
              <input
                id="code"
                type="text"
                inputmode="numeric"
                formControlName="code"
                placeholder="000000"
                maxlength="6"
                [class.invalid]="isFieldInvalid('code', verifyForm)"
                (input)="onCodeInput($event)"
              />
              <span class="error-text" *ngIf="isFieldInvalid('code', verifyForm)">
                {{ getFieldError('code', verifyForm) }}
              </span>
              <span class="info-text">
                Code expires in {{ codeExpiryMinutes }} minutes
              </span>
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!verifyForm.valid || authService.isLoading()"
              >
                {{ authService.isLoading() ? 'Verifying...' : 'Verify Email' }}
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                (click)="onResendCode()"
                [disabled]="resendCooldown > 0 || authService.isLoading()"
              >
                {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend Code' }}
              </button>
            </div>
          </form>

          <div class="back-link">
            <a href="javascript:void(0)" (click)="onBackToRegister()">Back to registration</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(8, 10, 14, 0.85), rgba(8, 10, 14, 0.75)),
                  url('/images/camp-bay.jpg') center / cover no-repeat;
      padding: 0px;
      margin-top: 100px;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 450px;
      overflow: hidden;
    }

    .register-header {
      background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
      border-bottom: 3px solid #f2b112;
    }

    .register-logo {
      height: 50px;
      width: auto;
      margin-bottom: 20px;
      display: block;
    }

    .register-header h1 {
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

    .step-description {
      text-align: center;
      color: #666;
      margin-bottom: 25px;
      font-size: 14px;
      line-height: 1.6;
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

    .info-text {
      color: #999;
      font-size: 13px;
      margin-top: 6px;
      display: block;
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

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #e0e0e0;
      margin-bottom: 0;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #efefef;
      border-color: #d0d0d0;
    }

    .btn-secondary:disabled {
      background: #f9f9f9;
      color: #999;
      cursor: not-allowed;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .back-link {
      text-align: center;
      margin-top: 20px;
    }

    .back-link a {
      color: #f2b112;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .back-link a:hover {
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
      .register-card {
        border-radius: 8px;
      }

      .register-header,
      .form-section {
        padding: 30px 20px;
      }

      .register-header h1 {
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
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  verifyForm!: FormGroup;
  step = 1;
  registeredEmail = '';
  registeredFirstName = '';
  registeredLastName = '';
  registeredPassword = '';
  errorMessage = '';
  codeExpiryMinutes = 15;
  resendCooldown = 0;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.authService.clearError();
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  async onRegister(): Promise<void> {
    if (!this.registerForm.valid) return;
    this.errorMessage = '';

    try {
      const { firstName, lastName, email, password } = this.registerForm.value;
      // Store registration data for resend functionality
      this.registeredFirstName = firstName;
      this.registeredLastName = lastName;
      this.registeredEmail = email;
      this.registeredPassword = password;

      await this.authService.register(email, password, firstName, lastName);
      this.step = 2;
      this.verifyForm.reset();
      setTimeout(() => {
        const codeInput = document.getElementById('code') as HTMLInputElement;
        if (codeInput) codeInput.focus();
      }, 100);
    } catch (error: any) {
      this.errorMessage = error?.error?.error || 'Registration failed. Please try again.';
    }
  }

  async onVerify(): Promise<void> {
    if (!this.verifyForm.valid) return;
    this.errorMessage = '';

    try {
      const { code } = this.verifyForm.value;
      await this.authService.verifyEmail(this.registeredEmail, code);
      this.router.navigate(['/auth/login'], {
        queryParams: { message: 'Email verified! Please log in.' },
      });
    } catch (error: any) {
      this.errorMessage = error?.error?.error || 'Verification failed. Please check your code and try again.';
    }
  }

  async onResendCode(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.register(
        this.registeredEmail,
        this.registeredPassword,
        this.registeredFirstName,
        this.registeredLastName
      );
      this.resendCooldown = 30;
      const interval = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) clearInterval(interval);
      }, 1000);
    } catch (error: any) {
      this.errorMessage = 'Failed to resend code. Please try again.';
    }
  }

  onBackToRegister(): void {
    this.step = 1;
    this.verifyForm.reset();
    this.errorMessage = '';
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
  }

  isFieldInvalid(fieldName: string, form: FormGroup = this.registerForm): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, form: FormGroup = this.registerForm): string {
    const field = form.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    if (field.errors['email']) return 'Invalid email address';
    if (field.errors['minlength']) return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['pattern']) return 'Verification code must be 6 digits';
    if (form.errors?.['passwordMismatch'] && fieldName === 'confirmPassword') return 'Passwords do not match';
    return 'Invalid input';
  }
}
