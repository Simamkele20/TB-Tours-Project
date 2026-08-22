import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-booking-cancelled",
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="state container">
      <h1>Payment cancelled</h1>
      <p>No charge was made. You can return to booking and try again at any time.</p>
      <a class="btn btn-dark" routerLink="/book">Back to booking</a>
    </section>
  `,
  styles: `
    .state { padding: 4rem 1rem; text-align: center; }
    h1 { margin-bottom: 0.6rem; text-transform: uppercase; }
  `
})
export class BookingCancelledComponent {}
