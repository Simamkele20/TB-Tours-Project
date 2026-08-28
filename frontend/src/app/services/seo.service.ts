import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseUrl = 'https://tb-tours.co.za';
  private defaultImage = `${this.baseUrl}/images/tb-tours-logo-new.png`;

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  setMetaTags(config: SeoConfig): void {
    // Set page title
    const fullTitle = config.title.includes('TB Tours')
      ? config.title
      : `${config.title} | TB Tours`;
    this.title.setTitle(fullTitle);

    // Update meta description
    this.updateMetaTag('name', 'description', config.description);

    // Update keywords if provided
    if (config.keywords) {
      this.updateMetaTag('name', 'keywords', config.keywords);
    }

    // Update Open Graph tags
    const url = config.url || `${this.baseUrl}${window.location.pathname}`;
    const image = config.image || this.defaultImage;

    this.updateMetaTag('property', 'og:title', config.title);
    this.updateMetaTag('property', 'og:description', config.description);
    this.updateMetaTag('property', 'og:image', image);
    this.updateMetaTag('property', 'og:url', url);
    this.updateMetaTag('property', 'og:type', config.type || 'website');

    // Update Twitter Card tags
    this.updateMetaTag('name', 'twitter:title', config.title);
    this.updateMetaTag('name', 'twitter:description', config.description);
    this.updateMetaTag('name', 'twitter:image', image);

    // Update canonical URL
    this.updateCanonicalUrl(url);
  }

  setLocalSearchOptimization(): void {
    // Add structured data for local search optimization
    const scriptData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'TB Tours (Pty)Ltd',
      'description': 'Private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands',
      'areaServed': [
        { '@type': 'City', 'name': 'Cape Town' },
        { '@type': 'City', 'name': 'Stellenbosch' },
        { '@type': 'City', 'name': 'Franschhoek' }
      ]
    };

    // This is handled in index.html, but can be enhanced dynamically if needed
    console.log('Local search optimization active for:',
      scriptData.areaServed.map(area => (area as any).name).join(', '));
  }

  private updateMetaTag(
    attrSelector: string,
    attrName: string,
    content: string
  ): void {
    const tag = this.meta.selectOne(`${attrSelector}="${attrName}"`);
    if (tag) {
      this.meta.updateTag({ [attrSelector]: attrName, content });
    } else {
      this.meta.addTag({ [attrSelector]: attrName, content });
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  // Page-specific SEO configurations
  getPageConfig(page: string): SeoConfig {
    const configs: { [key: string]: SeoConfig } = {
      home: {
        title: 'TB Tours - Private Tours & Airport Transfers in Cape Town & Winelands',
        description: 'Private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands. Explore the Peninsula, City, and Winelands with local expertise.',
        keywords: 'Cape Town tours, Winelands tours, airport transfers, chauffeur service, private tours'
      },
      tours: {
        title: 'Tours - Private Experiences in Cape Town',
        description: 'Explore Cape Town, the Peninsula, and Winelands with private guided tours. Airport transfers and custom day tours available.',
        keywords: 'Cape Town tours, Peninsula tours, Winelands tours, private tours South Africa'
      },
      services: {
        title: 'Services - Tours, Transfers & Chauffeur in Cape Town',
        description: 'Airport transfers, Cape Peninsula tours, City tours, Winelands tours, and private chauffeur services. Local expertise and personal service.',
        keywords: 'airport transfers Cape Town, chauffeur service, tour operator, transportation services'
      },
      destinations: {
        title: 'Destinations - Cape Town, Peninsula & Winelands',
        description: 'Discover Cape Town destinations: Table Mountain, Cape Point, Bo-Kaap, V&A Waterfront, and Winelands. Expert local knowledge.',
        keywords: 'Cape Town attractions, Table Mountain, Cape Point, Cape Winelands, Stellenbosch, Franschhoek'
      },
      about: {
        title: 'About TB Tours - Local Expert in Cape Town Tours',
        description: 'Meet Thabang, founder of TB Tours. Personalized private tours and transfers across Cape Town and the Cape Winelands with local insight.',
        keywords: 'about TB Tours, Thabang, Cape Town tour operator, local expert'
      },
      contact: {
        title: 'Contact TB Tours - Book Your Cape Town Experience',
        description: 'Get in touch with TB Tours. Available for bookings via phone, WhatsApp, or email. Quick response times guaranteed.',
        keywords: 'contact TB Tours, book tours, inquiry, Cape Town transfers'
      }
    };

    return configs[page] || configs.home;
  }
}
