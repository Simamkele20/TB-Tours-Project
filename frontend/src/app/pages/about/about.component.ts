import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ViewportScroller } from "@angular/common";
import { HeroSectionComponent } from "../../shared/components/hero-section.component";
import { SITE_CONTENT } from "../../data/site-content";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSectionComponent],
  template: `
    <app-hero-section
      [config]="heroConfig()"
      [showPhone]="() => false">
    </app-hero-section>

    <section class="section container about-story-block">
      <p class="about-kicker">Our Approach</p>
      <h2>Personal, professional and local</h2>
      <p>
        TB Tours offers private tours, airport transfers and chauffeur services across Cape Town and the Cape
        Winelands. Journeys are arranged personally by Thabang, with an emphasis on comfort, safety and local knowledge.
      </p>
      <p>The company grew out of one person's time on the road - a story you can read below.</p>
      <a [routerLink]="['/about']" fragment="founder-story" class="btn btn-outline-light about-approach-btn">Read Thabang's Story</a>
    </section>

    <section id="founder-story" class="about-founder-section">
      <div class="section container about-founder-grid">
        <article class="about-founder-copy">
          <p class="about-kicker">The Founder</p>
          <h2>From the Road to Building a Dream</h2>
          <p class="about-subtitle">Thabang's Story · Founder of TB Tours</p>
          <div class="about-founder-divider" aria-hidden="true"></div>
          <p>
            Every journey begins somewhere.
          </p>
          <p>
            For Thabang, the journey that eventually became TB Tours began behind the wheel.
          </p>
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
        </article>

        <aside class="about-founder-aside">
          <figure class="about-founder-image">
            <img
              src="/images/about-founder.png"
              alt="TB Tours founder and chauffeur service professional"
              loading="eager"
              fetchpriority="high" />
            <figcaption>
              <strong>Thabang</strong>
              <span>Founder, TB Tours (Pty) Ltd</span>
            </figcaption>
          </figure>
          <div class="about-founder-aside-divider" aria-hidden="true"></div>
          <a [routerLink]="['/contact']" fragment="contact-form" class="btn btn-primary about-founder-plan-btn">Plan Your Journey</a>
        </aside>
      </div>
    </section>
  `,
  styleUrl: "./about.component.scss"
})
export class AboutPageComponent implements OnInit {
  readonly heroConfig = computed(() => ({
    ...SITE_CONTENT["about"].hero,
    hideButton: true
  }));

  constructor(
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  }
}
