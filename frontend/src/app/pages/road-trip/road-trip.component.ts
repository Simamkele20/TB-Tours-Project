import { Component } from "@angular/core";

@Component({
  selector: "app-road-trip-page",
  standalone: true,
  template: `
    <section class="road-trip-shell">
      <div class="container road-trip-wrap">
        <p class="road-kicker">Road Trip Soundtrack</p>
        <h1>Drive the Cape with the right soundtrack.</h1>
        <p>
          A curated playlist for coastal drives, mountain passes and winelands sunsets.
          Press play and enjoy the road.
        </p>

        <div class="embed-wrap">
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator"
            title="TB Tours (Pty)Ltd Road Trip Playlist"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .road-trip-shell {
        background: #0b1730;
        color: #f2f4f8;
        min-height: calc(100svh - 80px);
        padding: clamp(5.5rem, 11vw, 8rem) 0 clamp(2.5rem, 6vw, 4rem);
      }

      .road-trip-wrap {
        text-align: center;
      }

      .road-kicker {
        margin: 0;
        color: #e0b659;
        text-transform: uppercase;
        letter-spacing: 0.26em;
        font-size: 0.72rem;
      }

      h1 {
        margin: 1rem auto 0;
        max-width: 18ch;
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 400;
        line-height: 1.06;
      }

      .road-trip-wrap > p {
        margin: 1rem auto 0;
        max-width: 58ch;
        color: #c8cfdb;
        font-size: 1.05rem;
      }

      .embed-wrap {
        margin: 2rem auto 0;
        width: min(860px, 100%);
        border: 1px solid rgba(224, 182, 89, 0.25);
        border-radius: 16px;
        overflow: hidden;
        background: #0d1a36;
      }

      iframe {
        width: 100%;
        min-height: 380px;
        border: 0;
        display: block;
      }

      @media (max-width: 700px) {
        iframe {
          min-height: 420px;
        }
      }
    `
  ]
})
export class RoadTripPageComponent {}
