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
      image: "images/hero-drive-poster.jpg"
    },
    sectionTitle: "Travel your way.",
    sectionSubtitle: "From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.",
    cards: [
      {
        title: "Airport Transfers",
        description: "Punctual, private arrivals and departures with a calm, professional welcome.",
        image: "images/city-tour.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Peninsula Tours",
        description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.",
        image: "images/chapmans-peak.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Town City Tours",
        description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
        image: "images/waterfront.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Winelands Tours",
        description: "Stellenbosch and Franschhoek estates at an unhurried pace.",
        image: "images/franschhoek.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Private Chauffeur Services",
        description: "A discreet driver at your disposal, by the hour or by the day.",
        image: "images/city-tour.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Custom Day Tours",
        description: "An itinerary shaped entirely around your interests and your time.",
        image: "images/table-mountain.jpg",
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
      title: "TB Tours ",
      accent: "(Pty) Ltd",
      description:
        "A Cape Town-based private tour, airport transfer and chauffeur company.",
      image: "images/franschhoek.jpg"
    },
    sectionTitle: "Personal, professional and local",
    sectionSubtitle: "Journeys are arranged personally by Thabang, with an emphasis on comfort, safety and local knowledge.",
    cards: [
      { title: "From the Road to Building a Dream", description: "Thabang's story is the heart of TB Tours (Pty)Ltd and how one journey became a business built on dignity and care.", image: "images/thabang-portrait.jpg", ctaLabel: "Read the story" },
      { title: "Built Around People", description: "Not a tour bus operation - personal service with local insight and flexibility.", image: "images/city-tour.jpg", ctaLabel: "Meet TB Tours (Pty)Ltd" }
    ],
    trustStrip: ["Faith", "Humility", "Integrity", "Perseverance"],
    ctaTitle: "One journey at a time.",
    ctaText: "When you travel with TB Tours (Pty)Ltd, you're travelling with the person who built his business one journey at a time."
  },
  services: {
    hero: {
      eyebrow: "Services",
      title: "Travel arranged ",
      accent: "with care",
      description:
        "An outline of the services we offer across Cape Town and the Cape Winelands.",
      image: "images/city-tour.jpg"
    },
    sectionTitle: "",
    sectionSubtitle: "",
    cards: [
      { title: "Airport Transfers", description: "Punctual, private arrivals and departures with a calm, professional welcome.", image: "images/city-tour.jpg", icon: "bi-airplane-fill", ctaLabel: "Request a quote" },
      { title: "Cape Peninsula Tours", description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.", image: "images/chapmans-peak.jpg", icon: "bi-geo-alt-fill", ctaLabel: "Request a quote" },
      { title: "Cape Town City Tours", description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.", image: "images/waterfront.jpg", icon: "bi-buildings-fill", ctaLabel: "Request a quote" },
      { title: "Winelands Tours", description: "Stellenbosch and Franschhoek estates at an unhurried pace.", image: "images/franschhoek.jpg", icon: "bi-cup-straw", ctaLabel: "Request a quote" },
      { title: "Private Chauffeur Services", description: "A discreet driver at your disposal, by the hour or by the day.", image: "images/city-tour.jpg", icon: "bi-person-fill", ctaLabel: "Request a quote" },
      { title: "Custom Day Tours", description: "An itinerary shaped entirely around your interests and your time.", image: "images/table-mountain.jpg", icon: "bi-stars", ctaLabel: "Request a quote" }
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
      image: "images/chapmans-peak.jpg"
    },
    sectionTitle: "",
    sectionSubtitle: "",
    cards: [
      { title: "Cape Peninsula Tours", description: "The full coastal arc - Chapman's Peak, Cape Point and Boulders Beach.", duration: "Full Day", passengers: "Private", ctaLabel: "Enquire", image: "images/cape-point.jpg", icon: "bi-geo-alt-fill" },
      { title: "Cape Town City Tours", description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.", duration: "Half Day / Full Day", passengers: "Private", ctaLabel: "Enquire", image: "images/waterfront.jpg", icon: "bi-buildings-fill" },
      { title: "Winelands Tours", description: "Stellenbosch and Franschhoek estates at an unhurried pace.", duration: "Full Day", passengers: "Private", ctaLabel: "Enquire", image: "images/franschhoek.jpg", icon: "bi-cup-straw" },
      { title: "Custom Day Tours", description: "An itinerary shaped entirely around your interests and your time.", duration: "Flexible", passengers: "Private", ctaLabel: "Enquire", image: "images/table-mountain.jpg", icon: "bi-stars" }
    ],
    trustStrip: ["Personalized", "Unhurried", "Local insight", "Comfort-first"],
    ctaTitle: "Enquire about a tour",
    ctaText: "Share your dates and interests and we will tailor the best route for your day."
  },
  destinations: {
    hero: {
      eyebrow: "Destinations",
      title: "Where we will ",
      accent: "take you",
      description:
        "A first selection of the places our journeys are built around.",
      image: "images/cape-point.jpg"
    },
    sectionTitle: "",
    sectionSubtitle: "",
    cards: [
      { title: "Cape Point", description: "Cape Peninsula", image: "images/cape-point.jpg" },
      { title: "Chapman's Peak Drive", description: "Atlantic Coast", image: "images/chapmans-peak.jpg" },
      { title: "Boulders Beach", description: "Simon's Town", image: "images/boulders-beach.jpg" },
      { title: "Bo-Kaap", description: "Cape Town City", image: "images/city-tour.jpg" },
      { title: "V&A Waterfront", description: "Cape Town City", image: "images/waterfront.jpg" },
      { title: "Kirstenbosch", description: "Table Mountain", image: "images/kirstenbosch.jpg" },
      { title: "Cape Winelands", description: "Stellenbosch & Franschhoek", image: "images/franschhoek.jpg" }
    ],
    trustStrip: [],
    ctaTitle: "",
    ctaText: ""
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Plan your ",
      accent: "journey",
      description:
        "Tell us your dates and what you would like to see - we will take care of the rest.",
      image: "images/waterfront.jpg"
    },
    sectionTitle: "Send us a message",
    sectionSubtitle: "",
    cards: [
      { title: "Contact Person", description: "Thabang", meta: "Founder", icon: "bi-person-badge-fill" },
      { title: "Phone / WhatsApp", description: "073 448 3958", meta: "Available daily", icon: "bi-telephone-fill" },
      { title: "Email", description: "info@tb-tours.co.za", meta: "Fast replies", icon: "bi-envelope-fill" },
      { title: "Location", description: "Cape Town, South Africa", meta: "Local pickup and drop-off", icon: "bi-geo-alt-fill" }
    ],
    trustStrip: ["WhatsApp first", "Direct line", "Flexible timing", "Personal support"],
    ctaTitle: "Your Cape Town journey starts here.",
    ctaText: "Airport transfer, private tour or custom day out - let's plan it together by email."
  }
};

export interface GoogleReview {
  name: string;
  rating: number;
  text: string;
  date: Date;
  reviewCount?: number;
  badges?: string;
  isTranslated?: boolean;
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: "Nonkululeko Dlamini",
    rating: 5,
    text: "Great driver! Smooth, safe ride, friendly service, and a clean vehicle. Would definitely ride with him again!",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    reviewCount: 1
  },
  {
    name: "Anthony Muturi",
    rating: 5,
    text: "TB Tours is very professional - my go to everytime am in the Cape. Uber is nice but it's better when you have a personalized & trusted service!",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    reviewCount: 1
  },
  {
    name: "Sara-Ann De Beer",
    rating: 5,
    text: "I thoroughly enjoyed the ride after a long day at work. Driver was great company. Thank you TB tours",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    reviewCount: 1
  },
  {
    name: "Victor Pena",
    rating: 5,
     text: "Excellent service.Punctual.Friendly.Highly recommended.",
     date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    reviewCount: 1
  },
  {
    name: "Nokhona Mfutwana",
    rating: 5,
    text: "Excellent service very good driver.The car is very clean and tidy",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    reviewCount: 1
  }
];
