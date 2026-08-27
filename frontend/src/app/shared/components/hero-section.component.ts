import { Component, Input, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

export interface HeroConfig {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image?: string;
  showPhone?: boolean;
  bookButtonLabel?: string;
  hideButton?: boolean;
}

@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <section class="hero" [class.hero-home]="showPhone()" [style.background-image]="backgroundImage">
      <video
        #videoElement
        *ngIf="showPhone() && !videoFailed"
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        [attr.poster]="posterImage"
        aria-hidden="true"
        (error)="onVideoError($event)">
        <source [src]="heroVideoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="container hero-content">
        <p class="eyebrow">{{ config.eyebrow }}</p>
        <h1>
          {{ config.title }}
          <span>{{ config.accent }}</span>
        </h1>
        <p class="hero-subtitle" *ngIf="showPhone()">Discover Cape Town</p>
        <p class="description">{{ config.description }}</p>

        <div class="hero-actions" *ngIf="showPhone()">
          <a [routerLink]="['/contact']" fragment="contact-form" class="btn btn-outline-gold">
            Plan Your Journey
          </a>
          <a routerLink="/tours" class="btn btn-outline-light">
            Explore Our Tours
          </a>
        </div>

        <p class="hero-trust" *ngIf="showPhone()">Private · Professional · Personal</p>

        <a *ngIf="!showPhone() && !!config?.bookButtonLabel" [routerLink]="['/contact']" fragment="contact-form" class="btn btn-primary">
          <i class="bi bi-envelope-fill" aria-hidden="true"></i>{{ config.bookButtonLabel }}
        </a>
      </div>
    </section>
  `,
  styleUrl: "./hero-section.component.scss"
})
export class HeroSectionComponent implements AfterViewInit {
  @Input() config!: HeroConfig;
  @Input() showPhone: () => boolean = () => false;
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  readonly heroVideoSrc = "/images/Home_Video.mp4";
  videoFailed = false;

  ngAfterViewInit(): void {
    // Ensure video starts playing when component is initialized
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.warn("Video autoplay failed:", error);
        });
      }
    }
  }

  get backgroundImage(): string {
    const image = this.config?.image || "images/home-hero-mercedes-road.jpg";
    return `linear-gradient(90deg, rgba(6, 8, 12, 0.62), rgba(6, 8, 12, 0.22)), url(${image})`;
  }

  get posterImage(): string {
    return this.config?.image || "images/home-hero-mercedes-road.jpg";
  }

  onVideoError(event: Event): void {
    console.warn("Video failed to load, falling back to background image", event);
    this.videoFailed = true;
  }
}
