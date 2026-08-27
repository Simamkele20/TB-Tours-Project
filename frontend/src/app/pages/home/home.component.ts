import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => true">
    </app-hero-section>

    <section class="section container home-services">
      <p class="kicker">Our Services</p>
      <h2>Travel your way.</h2>
      <p class="subtitle">From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.</p>

      <div class="service-list">
        <a *ngFor="let item of serviceCards(); index as i" [routerLink]="item.link" class="service-item">
          <span class="service-number">{{ (i + 1).toString().padStart(2, '0') }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <section class="section container story-grid">
      <article class="story-card">
        <p class="kicker">The TB Tours (Pty)Ltd Experience</p>
        <h2>More than a ride. It's your Cape Town experience.</h2>
        <p>
          From the moment you arrive at Cape Town International Airport to your final sunset overlooking the Atlantic,
          TB Tours (Pty)Ltd gives you the freedom to experience the Cape at your own pace.
        </p>
        <p>
          Travel privately with a professional local driver who knows the roads, the viewpoints and the places worth
          stopping for. TB Tours (Pty)Ltd is run personally by Thabang - not a tour-bus operation.
        </p>
        <a routerLink="/about" class="btn btn-dark">Meet TB Tours (Pty)Ltd</a>
      </article>
      <figure class="story-image">
        <img src="https://tbtourscapetown.lovable.app/assets/chapmans-peak-DtXI9Ubi.jpg" alt="Chapman's Peak Drive winding above the Atlantic near Cape Town" loading="lazy" />
      </figure>
    </section>

    <section class="section container founder">
      <p class="kicker">The Founder</p>
      <h2>One journey at a time.</h2>
      <p>From starting out as an e-hailing driver to founding TB Tours (Pty)Ltd, Thabang's journey is at the heart of the company.</p>
      <a routerLink="/about/thabangs-story" class="btn btn-primary">Read Thabang's Story</a>
    </section>

    <section class="section container destinations">
      <p class="kicker">Featured Experiences</p>
      <h2>The Cape, at its most memorable</h2>

      <div class="destination-grid">
        <a routerLink="/destinations" class="destination-card" *ngFor="let destination of destinationCards">
          <img [src]="destination.image" [alt]="destination.title" loading="lazy" />
          <div>
            <h3>{{ destination.title }}</h3>
            <p>{{ destination.description }}</p>
          </div>
        </a>
      </div>

      <a routerLink="/destinations" class="btn btn-dark">Explore All Destinations</a>
    </section>

    <section class="section home-cta">
      <div class="container home-cta-inner">
        <p class="kicker">Book Your Journey</p>
        <h2>Your Cape Town journey starts here.</h2>
        <p>Airport transfer, private tour or a day designed entirely around you - let's make it unforgettable.</p>
        <div class="cta-actions">
          <a [routerLink]="['/contact']" fragment="contact-form" class="btn btn-primary">Plan Your Journey</a>
          <a href="tel:+27734483958" class="btn btn-outline-gold">Call Thabang · 073 448 3958</a>
        </div>
        <a class="cta-email" href="mailto:info@tb-tours.co.za">info@tb-tours.co.za</a>
      </div>
    </section>
  `,
  styleUrls: ["./home.component.scss"]
})
export class HomePageComponent {
  readonly heroConfig = computed(() => SITE_CONTENT["home"].hero);

  readonly serviceCards = computed(() => {
    const cards = SITE_CONTENT["home"].cards;
    return cards.map((card) => ({
      ...card,
      link: card.title.includes("Transfer") || card.title.includes("Chauffeur") ? "/services" : "/tours"
    }));
  });

  readonly destinationCards = [
    {
      title: "Table Mountain",
      description: "See Cape Town from above.",
      image: "https://tbtourscapetown.lovable.app/assets/hero-table-mountain-DB7gbHqM.jpg"
    },
    {
      title: "Cape Peninsula",
      description: "Where the mountains meet the Atlantic.",
      image: "https://tbtourscapetown.lovable.app/assets/cape-point-C_z81lyn.jpg"
    },
    {
      title: "Boulders Beach",
      description: "Meet Cape Town's famous penguins.",
      image: "https://tbtourscapetown.lovable.app/assets/boulders-CZnAwwfM.jpg"
    },
    {
      title: "Cape Winelands",
      description: "Slow afternoons among vineyards and estates.",
      image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg"
    }
  ];
}
