import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1>Reset your Password</h1>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="success-alert">
          {{ successMessage }}
        </div>

        <!-- Step 1: Enter Email -->
        <div *ngIf="step === 1" class="form-section">
          <p class="step-description">
            Enter the email address associated with your account, and we'll send you a code to reset your password.
          </p>

          <form [formGroup]="emailForm" (ngSubmit)="onRequestReset()">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="your@email.com"
                [class.invalid]="isFieldInvalid('email', emailForm)"
              />
              <span class="error-text" *ngIf="isFieldInvalid('email', emailForm)">
                {{ getFieldError('email', emailForm) }}
              </span>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!emailForm.valid || authService.isLoading()"
            >
              {{ authService.isLoading() ? 'Sending...' : 'Send Reset Code' }}
            </button>
          </form>

          <!-- Login Link -->
          <div class="auth-footer">
            <p>Remember your password? <a routerLink="/auth/login">Login here</a></p>
          </div>
        </div>

        <!-- Step 2: Enter Code -->
        <div *ngIf="step === 2" class="form-section">
          <p class="step-description">
            We've sent a verification code to <strong>{{ resetEmail }}</strong>
          </p>

          <form [formGroup]="codeForm" (ngSubmit)="onVerifyCode()">
            <div class="form-group">
              <label for="code">Verification Code</label>
              <input
                id="code"
                type="text"
                inputmode="numeric"
                formControlName="code"
                placeholder="000000"
                maxlength="6"
                [class.invalid]="isFieldInvalid('code', codeForm)"
                (input)="onCodeInput($event)"
              />
              <span class="error-text" *ngIf="isFieldInvalid('code', codeForm)">
                {{ getFieldError('code', codeForm) }}
              </span>
              <span class="info-text">
                Code expires in {{ codeExpiryMinutes }} minutes
              </span>
            </div>

            <div class="button-group">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!codeForm.valid || authService.isLoading()"
              >
                {{ authService.isLoading() ? 'Verifying...' : 'Verify Code' }}
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
            <a href="javascript:void(0)" (click)="onBackToEmail()">Use different email</a>
          </div>
        </div>

        <!-- Step 3: Set New Password -->
        <div *ngIf="step === 3" class="form-section">
          <p class="step-description">
            Enter your new password below.
          </p>

          <form [formGroup]="passwordForm" (ngSubmit)="onResetPassword()">
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                formControlName="newPassword"
                placeholder="At least 8 characters"
                [class.invalid]="isFieldInvalid('newPassword', passwordForm)"
              />
              <span class="error-text" *ngIf="isFieldInvalid('newPassword', passwordForm)">
                {{ getFieldError('newPassword', passwordForm) }}
              </span>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                placeholder="Re-enter your password"
                [class.invalid]="isFieldInvalid('confirmPassword', passwordForm)"
              />
              <span class="error-text" *ngIf="isFieldInvalid('confirmPassword', passwordForm)">
                {{ getFieldError('confirmPassword', passwordForm) }}
              </span>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!passwordForm.valid || authService.isLoading()"
            >
              {{ authService.isLoading() ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
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

    .success-alert {
      background-color: #efe;
      border-left: 4px solid #28a745;
      color: #155724;
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
      margin-bottom: 0;
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
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  emailForm!: FormGroup;
  codeForm!: FormGroup;
  passwordForm!: FormGroup;

  step = 1; // 1: Email, 2: Code, 3: Password
  resetEmail = '';
  resetCode = '';
  errorMessage = '';
  successMessage = '';
  codeExpiryMinutes = 15;
  resendCooldown = 0;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.authService.clearError();
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  async onRequestReset(): Promise<void> {
    if (!this.emailForm.valid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email } = this.emailForm.value;
      await this.authService.forgotPassword(email);

      // Move to code verification step
      this.resetEmail = email;
      this.step = 2;
      this.codeForm.reset();

      // Auto-focus code input
      setTimeout(() => {
        const codeInput = document.getElementById('code') as HTMLInputElement;
        if (codeInput) codeInput.focus();
      }, 100);
    } catch (error: any) {
      this.errorMessage =
        error?.error?.error ||
        'Failed to request password reset. Please try again.';
    }
  }

  onVerifyCode(): void {
    if (!this.codeForm.valid) {
      return;
    }

    // Move to password reset step
    this.resetCode = this.codeForm.get('code')?.value;
    this.step = 3;
    this.passwordForm.reset();
  }

  async onResendCode(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.authService.forgotPassword(this.resetEmail);

      this.successMessage = 'Code resent to your email.';
      this.resendCooldown = 30;

      const interval = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error: any) {
      this.errorMessage =
        error?.error?.error || 'Failed to resend code. Please try again.';
    }
  }

  async onResetPassword(): Promise<void> {
    if (!this.passwordForm.valid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { newPassword } = this.passwordForm.value;
      await this.authService.resetPassword(
        this.resetEmail,
        this.resetCode,
        newPassword
      );

      this.successMessage =
        'Password reset successful! Redirecting to login...';

      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage =
        error?.error?.error ||
        'Password reset failed. Please check your code and try again.';
    }
  }

  onBackToEmail(): void {
    this.step = 1;
    this.errorMessage = '';
    this.successMessage = '';
    this.codeForm.reset();
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
  }

  isFieldInvalid(fieldName: string, form: FormGroup): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, form: FormGroup): string {
    const field = form.get(fieldName);
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
    if (field.errors['pattern']) {
      return 'Verification code must be 6 digits';
    }
    if (form.errors?.['passwordMismatch'] && fieldName === 'confirmPassword') {
      return 'Passwords do not match';
    }
    return 'Invalid input';
  }
}
