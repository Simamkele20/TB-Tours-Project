import { Injectable } from "@angular/core";
import { SITE_CONTENT } from "../data/site-content";
import { PageLayoutComponent, type PageLayoutConfig } from "../shared/components/page-layout.component";
import type { TrustItem } from "../shared/components/trust-strip.component";

/**
 * Smart service for managing page data and layout configuration.
 *
 * Responsibility: Transform content data into component-ready format.
 * This service is the single source of truth for all page data,
 * eliminating duplication and making content updates centralized.
 */
@Injectable({ providedIn: "root" })
export class PageDataService {
  /**
   * Get complete page layout configuration by page key
   * Returns null if page doesn't exist
   */
  getPageConfig(pageKey: string): PageLayoutConfig | null {
    const content = SITE_CONTENT[pageKey as keyof typeof SITE_CONTENT];
    if (!content) return null;

    const trustItems = this.transformTrustItems(content.trustStrip);

    return {
      hero: content.hero,
      cards: content.cards,
      cardTitle: content.sectionTitle,
      cardSubtitle: content.sectionSubtitle,
      cardLayout: this.inferCardLayout(pageKey),
      trustItems,
      trustVariant: this.inferTrustVariant(pageKey),
      trustShowIntro: pageKey !== "destinations",
      trustIntroIcon: "bi-patch-check",
      trustIntroText: this.getIntroText(pageKey),
      ctaTitle: content.ctaTitle,
      ctaText: content.ctaText,
      ctaLabel: this.getCtaLabel(pageKey),
      ctaLink: "/contact"
    };
  }

  /**
   * Get list of all available pages
   */
  getAllPages(): string[] {
    return Object.keys(SITE_CONTENT);
  }

  /**
   * Transform trust strip strings to TrustItem objects
   * Creates meaningful icons based on the trust value
   */
  private transformTrustItems(trustStrings: string[]): TrustItem[] {
    const iconMap: Record<string, string> = {
      "Private": "bi-shield-check",
      "Professional": "bi-briefcase",
      "Personal": "bi-heart",
      "Local insight": "bi-compass",
      "Faith": "bi-star",
      "Humility": "bi-hand-index",
      "Integrity": "bi-check-circle",
      "Perseverance": "bi-arrow-right",
      "WhatsApp first": "bi-chat-left-text",
      "Direct line": "bi-telephone",
      "Flexible timing": "bi-clock",
      "Personal support": "bi-person-check",
      "Personalized": "bi-pencil-square",
      "Unhurried": "bi-hourglass-split",
      "Comfort-first": "bi-cup-hot"
    };

    return trustStrings.map((item) => ({
      icon: iconMap[item] || "bi-patch-check",
      title: item,
      description: this.getTrustDescription(item)
    }));
  }

  /**
   * Get description for each trust item
   */
  private getTrustDescription(item: string): string {
    const descriptions: Record<string, string> = {
      "Private": "Dedicated service just for you",
      "Professional": "Experienced, reliable, courteous",
      "Personal": "We care about your experience",
      "Local insight": "Deep knowledge of Cape Town",
      "Faith": "Built on strong values",
      "Humility": "Always learning and improving",
      "Integrity": "Honest, transparent service",
      "Perseverance": "Committed to your satisfaction",
      "WhatsApp first": "Direct communication channel",
      "Direct line": "Reach Thabang personally",
      "Flexible timing": "Work around your schedule",
      "Personal support": "One-on-one attention",
      "Personalized": "Tours tailored to you",
      "Unhurried": "Time to enjoy the moment",
      "Comfort-first": "Your comfort is our priority"
    };
    return descriptions[item] || item;
  }

  /**
   * Infer card layout based on page type
   */
  private inferCardLayout(pageKey: string): "services" | "tours" | "destinations" {
    const layoutMap: Record<string, "services" | "tours" | "destinations"> = {
      home: "services",
      tours: "tours",
      destinations: "destinations",
      about: "tours",
      services: "services",
      contact: "tours",
      fleet: "tours",
      "road-trip": "tours"
    };
    return layoutMap[pageKey] || "services";
  }

  /**
   * Infer trust variant based on page type
   */
  private inferTrustVariant(pageKey: string): "services" | "tours" | "default" {
    const variantMap: Record<string, "services" | "tours" | "default"> = {
      home: "services",
      tours: "tours",
      destinations: "default",
      about: "default",
      services: "services",
      contact: "default",
      fleet: "tours",
      "road-trip": "tours"
    };
    return variantMap[pageKey] || "default";
  }

  /**
   * Get intro text for trust strip
   */
  private getIntroText(pageKey: string): string {
    const introMap: Record<string, string> = {
      home: "Private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands.",
      about: "Personal service built on faith, humility, integrity and perseverance.",
      tours: "Private tours across the Peninsula, city and Winelands with flexible timing and local insight.",
      destinations: "Explore the best of Cape Town with personalized guidance and comfortable travel.",
      services: "We offer a range of services tailored to your needs.",
      contact: "Get in touch with us directly for personalized assistance.",
      fleet: "Our fleet is maintained to the highest standards for your comfort and safety.",
      "road-trip": "Experience Cape Town's most scenic drives with professional guidance."
    };
    return introMap[pageKey] || "We are committed to providing top-quality service.";
  }

  /**
   * Get CTA label based on page type
   */
  private getCtaLabel(pageKey: string): string {
    const labelMap: Record<string, string> = {
      home: "Plan Your Journey",
      tours: "Enquire About a Tour",
      destinations: "Enquire",
      about: "Get in Touch",
      services: "Browse Our Services",
      contact: "Send Message",
      fleet: "View Fleet Details",
      "road-trip": "Plan Your Road Trip"
    };
    return labelMap[pageKey] || "Get Started";
  }
}
