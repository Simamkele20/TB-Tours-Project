import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="contact-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input
          id="name"
          type="text"
          placeholder="Full Name *"
          formControlName="name"
          [class.error]="isFieldInvalid('name')" />
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input
          id="email"
          type="email"
          placeholder="Email Address *"
          formControlName="email"
          [class.error]="isFieldInvalid('email')" />
      </div>

      <div class="form-group">
        <label for="phone">Phone Number *</label>
        <input
          id="phone"
          type="tel"
          placeholder="Phone Number *"
          formControlName="phone"
          [class.error]="isFieldInvalid('phone')" />
      </div>

      <div class="form-group">
        <label for="service">Service Interested In</label>
        <select id="service" formControlName="service" [class.error]="isFieldInvalid('service')">
          <option value="">Service Interested In</option>
          <option value="airport-transfer">Airport Transfer</option>
          <option value="city-tour">City Tour</option>
          <option value="wine-tour">Wine Tour</option>
          <option value="garden-route">Garden Route Tour</option>
          <option value="event-transport">Event Transport</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="message">Your Message *</label>
        <textarea
          id="message"
          placeholder="Your Message *"
          formControlName="message"
          rows="4"
          [class.error]="isFieldInvalid('message')"></textarea>
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="!form.valid || isSending">
        <i class="bi" [class.bi-hourglass]="isSending" [class.bi-send-fill]="!isSending" aria-hidden="true"></i>
        {{ isSending ? "Sending..." : "Send Message" }}
      </button>
    </form>
  `,
  styleUrl: "./contact-form.component.scss"
})
export class ContactFormComponent {
  @Input() isSending = false;
  @Output() formSubmitted = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(7)]],
      service: ["", [Validators.required]],
      message: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
}
