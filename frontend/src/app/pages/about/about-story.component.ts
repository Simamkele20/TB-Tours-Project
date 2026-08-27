import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-about-story-page",
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent],
  template: `
    <app-hero-section [config]="heroConfig()" [showPhone]="() => false"></app-hero-section>

    <section class="section container story-page">
      <p class="story-kicker">The Founder</p>
      <h2>From the Road to Building a Dream</h2>
      <p class="story-subtitle">Thabang's Story · Founder of TB Tours</p>

      <p>Every journey begins somewhere.</p>
      <p>For Thabang, the journey that eventually became TB Tours began behind the wheel.</p>
      <p>
        Coming from a township, Thabang started his working life as an e-hailing driver, driving passengers across Cape
        Town and getting to know the city one journey at a time. What started as a way to make a living gradually became
        something more.
      </p>
      <p>
        Behind the wheel, he discovered that he genuinely enjoyed meeting people, hearing their stories and showing
        them the different sides of Cape Town. Every passenger was different. Every destination was different. And every
        journey taught him something.
      </p>
      <p>But Thabang had a bigger vision.</p>
      <p>
        He wanted to build something of his own - a business built around service, reliability, dignity and personal
        connection.
      </p>
      <p>So he took the experience he had gained on the road and turned it into a dream: TB Tours.</p>
      <p>
        What began with Thabang driving passengers as an e-hailing driver became the foundation for his own tour and
        chauffeur company. Today, TB Tours gives visitors the opportunity to experience Cape Town, the Cape Peninsula
        and the Winelands with a local driver who knows the roads, the destinations and the importance of making people
        feel comfortable along the way.
      </p>

      <blockquote>"Where you start does not have to determine where you finish."</blockquote>

      <p>For Thabang, this journey is about more than business.</p>
      <p>
        His Christian faith is an important part of who he is and the values he brings to his work - faith, humility,
        integrity, perseverance and treating people with respect.
      </p>
      <p>
        From growing up in a township, to becoming an e-hailing driver, to taking the leap of faith to become an
        entrepreneur and founder of TB Tours, Thabang's story is a reminder that sometimes the road you're already
        travelling can lead you somewhere you never expected.
      </p>
      <p>Today, the journey continues.</p>

      <figure class="story-figure">
        <img
          src="https://tbtourscapetown.lovable.app/assets/thabang-arrival-B7xuRbyw.jpg"
          alt="TB Tours chauffeur in a black suit opening the rear door of a white Honda for a smiling guest, with Table Mountain in the background"
          loading="eager"
          fetchpriority="high" />
        <figcaption>
          <strong>Thabang</strong>
          <span>Founder, TB Tours (Pty) Ltd</span>
        </figcaption>
      </figure>

      <p class="closing-copy">
        When you travel with TB Tours, you're not simply getting from one destination to another.
        You're travelling with the person who built his business one journey at a time.
      </p>
      <p class="closing-brand">TB Tours - Your journey. Our priority.</p>

      <div class="story-actions">
        <a [routerLink]="['/contact']" fragment="contact-form" class="btn btn-primary">Plan Your Journey</a>
      </div>
    </section>
  `,
  styleUrl: "./about-story.component.scss"
})
export class AboutStoryPageComponent {
  readonly heroConfig = computed(() => ({
    ...SITE_CONTENT["about"].hero,
    hideButton: true
  }));
}
