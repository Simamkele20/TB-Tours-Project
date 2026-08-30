export interface HeroBlock {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon?: string;
  meta?: string;
  image?: string;
  duration?: string;
  passengers?: string;
  bags?: string;
  ctaLabel?: string;
}

export interface PageContent {
  hero: HeroBlock;
  sectionTitle: string;
  sectionSubtitle: string;
  cards: FeatureCard[];
  trustStrip: string[];
  ctaTitle: string;
  ctaText: string;
}

export const SITE_CONTENT: Record<string, PageContent> = {
  home: {
    hero: {
      eyebrow: "Cape Town · South Africa",
      title: "Your journey.",
      accent: "Our priority.",
      description:
        "Private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands.",
      image: "https://tbtourscapetown.lovable.app/__l5e/assets-v1/3dca2ca0-73a5-4c8b-afe5-e45085fb7cfe/hero-drive-poster.jpg"
    },
    sectionTitle: "Travel your way.",
    sectionSubtitle: "From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.",
    cards: [
      {
        title: "Airport Transfers",
        description: "Punctual, private arrivals and departures with a calm, professional welcome.",
        image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Peninsula Tours",
        description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.",
        image: "https://tbtourscapetown.lovable.app/assets/chapmans-peak-DtXI9Ubi.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Town City Tours",
        description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
        image: "https://tbtourscapetown.lovable.app/assets/waterfront-CWKEfh8G.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Winelands Tours",
        description: "Stellenbosch and Franschhoek estates at an unhurried pace.",
        image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Private Chauffeur Services",
        description: "A discreet driver at your disposal, by the hour or by the day.",
        image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Custom Day Tours",
        description: "An itinerary shaped entirely around your interests and your time.",
        image: "https://tbtourscapetown.lovable.app/assets/hero-table-mountain-DB7gbHqM.jpg",
        ctaLabel: "Learn more"
      }
    ],
    trustStrip: ["Private", "Professional", "Personal", "Local insight"],
    ctaTitle: "Your Cape Town journey starts here.",
    ctaText: "Airport transfer, private tour or a day designed entirely around you - let's make it unforgettable."
  },
  about: {
    hero: {
      eyebrow: "About",
      title: "TB Tours",
      accent: "Cape Town",
      description:
        "A Cape Town-based private tour, airport transfer and chauffeur company built on dignity, care and local insight.",
      image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg"
    },
    sectionTitle: "Personal, professional and local",
    sectionSubtitle: "Journeys are arranged personally by Thabang, with an emphasis on comfort, safety and local knowledge.",
    cards: [
      { title: "From the Road to Building a Dream", description: "Thabang's story is the heart of TB Tours (Pty)Ltd and how one journey became a business built on dignity and care.", image: "https://tbtourscapetown.lovable.app/assets/thabang-arrival-B7xuRbyw.jpg", ctaLabel: "Read the story" },
      { title: "Built Around People", description: "Not a tour bus operation - personal service with local insight and flexibility.", image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg", ctaLabel: "Meet TB Tours (Pty)Ltd" }
    ],
    trustStrip: ["Faith", "Humility", "Integrity", "Perseverance"],
    ctaTitle: "One journey at a time.",
    ctaText: "When you travel with TB Tours (Pty)Ltd, you're travelling with the person who built his business one journey at a time."
  },
  services: {
    hero: {
      eyebrow: "Services",
      title: "Travel arranged",
      accent: "with care",
      description:
        "An outline of the services we offer across Cape Town and the Cape Winelands.",
      image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg"
    },
    sectionTitle: "Travel your way.",
    sectionSubtitle: "From punctual airport pickups to immersive private tours and professional chauffeur services, we handle every detail so you can simply enjoy the journey.",
    cards: [
      { title: "Airport Transfers", description: "Punctual, private arrivals and departures with a calm, professional welcome.", image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg", icon: "bi-airplane-fill", ctaLabel: "Request a quote" },
      { title: "Cape Peninsula Tours", description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.", image: "https://tbtourscapetown.lovable.app/assets/chapmans-peak-DtXI9Ubi.jpg", icon: "bi-geo-alt-fill", ctaLabel: "Request a quote" },
      { title: "Cape Town City Tours", description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.", image: "https://tbtourscapetown.lovable.app/assets/waterfront-CWKEfh8G.jpg", icon: "bi-buildings-fill", ctaLabel: "Request a quote" },
      { title: "Winelands Tours", description: "Stellenbosch and Franschhoek estates at an unhurried pace.", image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg", icon: "bi-cup-straw", ctaLabel: "Request a quote" },
      { title: "Private Chauffeur Services", description: "A discreet driver at your disposal, by the hour or by the day.", image: "https://tbtourscapetown.lovable.app/assets/chauffeur-bovu1Aoh.jpg", icon: "bi-person-fill", ctaLabel: "Request a quote" },
      { title: "Custom Day Tours", description: "An itinerary shaped entirely around your interests and your time.", image: "https://tbtourscapetown.lovable.app/assets/hero-table-mountain-DB7gbHqM.jpg", icon: "bi-stars", ctaLabel: "Request a quote" }
    ],
    trustStrip: ["Airport transfers", "Private touring", "Chauffeur days", "Custom itineraries"],
    ctaTitle: "Need a custom day?",
    ctaText: "Tell us your plan and we will shape a route around your interests and timing, then email your quote."
  },
  tours: {
    hero: {
      eyebrow: "Tours",
      title: "Private tours,",
      accent: "shaped around you",
      description:
        "Experience Cape Town and the Winelands at your own pace with personalized itineraries designed for your interests and timing.",
      image: "https://tbtourscapetown.lovable.app/assets/chapmans-peak-DtXI9Ubi.jpg"
    },
    sectionTitle: "The Cape, at its most memorable",
    sectionSubtitle: "Explore breathtaking coastal routes, vibrant city experiences, world-class vineyards and custom adventures tailored entirely to you.",
    cards: [
      { title: "Cape Peninsula Tours", description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.", duration: "Full Day", passengers: "Private", ctaLabel: "Enquire", image: "https://tbtourscapetown.lovable.app/assets/cape-point-C_z81lyn.jpg", icon: "bi-geo-alt-fill" },
      { title: "Cape Town City Tours", description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.", duration: "Half Day / Full Day", passengers: "Private", ctaLabel: "Enquire", image: "https://tbtourscapetown.lovable.app/assets/waterfront-CWKEfh8G.jpg", icon: "bi-buildings-fill" },
      { title: "Winelands Tours", description: "Stellenbosch and Franschhoek estates at an unhurried pace.", duration: "Full Day", passengers: "Private", ctaLabel: "Enquire", image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg", icon: "bi-cup-straw" },
      { title: "Custom Day Tours", description: "An itinerary shaped entirely around your interests and your time.", duration: "Flexible", passengers: "Private", ctaLabel: "Enquire", image: "https://tbtourscapetown.lovable.app/assets/hero-table-mountain-DB7gbHqM.jpg", icon: "bi-stars" }
    ],
    trustStrip: ["Personalized", "Unhurried", "Local insight", "Comfort-first"],
    ctaTitle: "Enquire about a tour",
    ctaText: "Share your dates and interests and we will tailor the best route for your day."
  },
  destinations: {
    hero: {
      eyebrow: "Destinations",
      title: "Where we will",
      accent: "take you",
      description:
        "A first selection of the places our journeys are built around.",
      image: "https://tbtourscapetown.lovable.app/assets/cape-point-C_z81lyn.jpg"
    },
    sectionTitle: "The Cape, at its most memorable",
    sectionSubtitle: "A first selection of the places our journeys are built around.",
    cards: [
      { title: "Cape Point", description: "Cape Peninsula", image: "https://tbtourscapetown.lovable.app/assets/cape-point-C_z81lyn.jpg", ctaLabel: "Plan a stop" },
      { title: "Chapman's Peak Drive", description: "Atlantic Coast", image: "https://tbtourscapetown.lovable.app/assets/chapmans-peak-DtXI9Ubi.jpg", ctaLabel: "Plan a stop" },
      { title: "Boulders Beach", description: "Simon's Town", image: "https://tbtourscapetown.lovable.app/assets/boulders-CZnAwwfM.jpg", ctaLabel: "Plan a stop" },
      { title: "Bo-Kaap", description: "Cape Town City", image: "https://tbtourscapetown.lovable.app/assets/bo-kaap-KgRFsEe_.jpg", ctaLabel: "Plan a stop" },
      { title: "V&A Waterfront", description: "Cape Town City", image: "https://tbtourscapetown.lovable.app/assets/waterfront-CWKEfh8G.jpg", ctaLabel: "Plan a stop" },
      { title: "Kirstenbosch", description: "Table Mountain", image: "https://tbtourscapetown.lovable.app/assets/kirstenbosch-Bi8CyJ4T.jpg", ctaLabel: "Plan a stop" },
      { title: "Cape Winelands", description: "Stellenbosch & Franschhoek", image: "https://tbtourscapetown.lovable.app/assets/winelands-CbN4j39m.jpg", ctaLabel: "Plan a stop" }
    ],
    trustStrip: ["Coastal routes", "City highlights", "Nature stops", "Winelands"],
    ctaTitle: "Explore all destinations",
    ctaText: "Tell us what you want to see and we will shape the day around your pace."
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Plan your",
      accent: "journey",
      description:
        "Tell us your dates and what you would like to see - we will take care of the rest.",
      image: "https://tbtourscapetown.lovable.app/assets/waterfront-CWKEfh8G.jpg"
    },
    sectionTitle: "Send us a message",
    sectionSubtitle: "",
    cards: [
      { title: "Contact Person", description: "Thabang", meta: "Founder", icon: "bi-person-badge-fill", image: "images/card-executive-sedan.jpg" },
      { title: "Phone / WhatsApp", description: "073 448 3958", meta: "Available daily", icon: "bi-telephone-fill", image: "images/card-waterfront.jpg" },
      { title: "Email", description: "info@tb-tours.co.za", meta: "Fast replies", icon: "bi-envelope-fill", image: "images/card-harbour.jpg" },
      { title: "Location", description: "Cape Town, South Africa", meta: "Local pickup and drop-off", icon: "bi-geo-alt-fill", image: "images/card-table-cableway.jpg" }
    ],
    trustStrip: ["WhatsApp first", "Direct line", "Flexible timing", "Personal support"],
    ctaTitle: "Your Cape Town journey starts here.",
    ctaText: "Airport transfer, private tour or custom day out - let's plan it together by email."
  }
};
