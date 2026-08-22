import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [CommonModule, HeroSectionComponent],
  template: `
    <app-hero-section 
      [config]="heroConfig()" 
      [showPhone]="() => false">
    </app-hero-section>

    <section class="about-overview section container">
      <article class="about-story">
        <p class="about-kicker">Who we are</p>
        <h2>Welcome to TB Tours</h2>
        <p>
          Founded with a passion for travel and a commitment to service excellence, TB Tours was created to offer more
          than just transport. We deliver peace of mind, comfort and memorable experiences.
        </p>
        <p>
          Whether you're arriving at the airport, exploring the scenic beauty of the Western Cape, or needing reliable
          transport for your business or event, we are here to make your journey exceptional.
        </p>
        <p>
          With professional drivers, well-maintained vehicles and a customer-first approach, we go the extra mile to
          ensure every trip is smooth, safe and on time.
        </p>
        <p class="about-signature">Thabang Sekhobo</p>
        <p class="about-role">Founder & owner</p>
      </article>

      <figure class="about-image-wrap">
        <img src="images/about-hero.jpg" alt="TB Tours team and vehicle" />
      </figure>
    </section>

    <section class="about-pillars container">
      <article class="pillar-card">
        <h3><i class="bi bi-bullseye" aria-hidden="true"></i>Our mission</h3>
        <p>
          To provide safe, reliable and comfortable transport and tour services while delivering exceptional customer
          service and creating unforgettable travel experiences.
        </p>
      </article>
      <article class="pillar-card">
        <h3><i class="bi bi-eye" aria-hidden="true"></i>Our vision</h3>
        <p>
          To become one of South Africa's most trusted and preferred transport and tour companies, known for our
          professionalism, reliability and excellence.
        </p>
      </article>
    </section>

    <section class="about-values section container">
      <h2>Our values</h2>
      <div class="values-grid">
        <article class="value-item">
          <i class="bi bi-shield-check"></i>
          <h3>Safety</h3>
          <p>We put your safety above everything.</p>
        </article>
        <article class="value-item">
          <i class="bi bi-person-badge"></i>
          <h3>Professionalism</h3>
          <p>Experienced team, professional service.</p>
        </article>
        <article class="value-item">
          <i class="bi bi-clock-history"></i>
          <h3>Punctuality</h3>
          <p>On time, every time. You can count on us.</p>
        </article>
        <article class="value-item">
          <i class="bi bi-heart"></i>
          <h3>Customer care</h3>
          <p>Your satisfaction is our priority.</p>
        </article>
        <article class="value-item">
          <i class="bi bi-star"></i>
          <h3>Excellence</h3>
          <p>We strive for excellence in every journey.</p>
        </article>
      </div>
    </section>
  `,
  styleUrl: "./about.component.scss"
})
export class AboutPageComponent {
  readonly heroConfig = computed(() => SITE_CONTENT["about"].hero);
}
