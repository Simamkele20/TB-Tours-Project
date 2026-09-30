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
  ctaLink?: string;
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
      image: "images/camp-bay.jpg"
    },
    sectionTitle: "Travel your way.",
    sectionSubtitle: "From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.",
    cards: [
      {
        title: "Table Mountain",
        description: "See Cape Town from above.",
        image: "images/Image(13).jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Peninsula",
        description: "Where the mountains meet the Atlantic.",
        image: "images/Image(19).jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Boulders Beach",
        description: "Meet Cape Town's famous penguins.",
        image: "images/Image(18).jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Cape Winelands",
        description: "Slow afternoons among vineyards and estates.",
        image: "images/franschhoek.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Private Chauffeur Services",
        description: "A discreet driver at your disposal, by the hour or by the day.",
        image: "images/hermanus.jpg",
        ctaLabel: "Learn more"
      },
      {
        title: "Custom Day Tours",
        description: "An itinerary shaped entirely around your interests and your time.",
        image: "images/kirstenbosch.jpg",
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
    sectionTitle: "About",
    sectionSubtitle: "TB Tours (Pty)Ltd offers private tours, airport transfers and chauffeur services across Cape Town and the Cape Winelands. Journeys are arranged personally by Thabang, with an emphasis on comfort, safety and local knowledge.\n\nThe company grew out of one person's time on the road - a story of entrepreneurship, service, and genuine care for every journey.",
    cards: [
      { title: "From the Road to Building a Dream", description: "Thabang's story is the heart of TB Tours (Pty)Ltd and how one journey became a business built on dignity and care.", image: "images/About-removebg-preview.png", ctaLabel: "Read the story" },
      { title: "Built Around People", description: "Not a tour bus operation - personal service with local insight and flexibility.", image: "images/DEst.jpg", ctaLabel: "Meet TB Tours (Pty)Ltd" }
    ],
    trustStrip: ["Faith", "Humility", "Integrity", "Perseverance"],
    ctaTitle: "One journey at a time.",
    ctaText: "When you travel with TB Tours (Pty)Ltd, you're travelling with the person who built his business one journey at a time."
  },

  destinations: {
    hero: {
      eyebrow: "Destinations",
      title: "Where we will ",
      accent: "take you",
      description:
        "A first selection of the places our journeys are built around.",
      image: "images/camp-bay.jpg"
    },
    sectionTitle: "",
    sectionSubtitle: "",
    cards: [
      { title: "Cape Point", description: "Cape Peninsula", image: "images/tsisikama.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Chapman's Peak Drive", description: "Atlantic Coast", image: "images/camp-bay.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Boulders Beach", description: "Simon's Town", image: "images/hermanus.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Bo-Kaap", description: "Cape Town City", image: "images/DEst.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "V&A Waterfront", description: "Cape Town City", image: "images/franschhoek.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Kirstenbosch", description: "Table Mountain", image: "images/camp-bay.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Cape Winelands", description: "Stellenbosch & Franschhoek", image: "images/franschhoek.jpg", ctaLabel: "Enquire", ctaLink: "/contact" },
      { title: "Aquila Game Reserve", description: "Meet the Big Five in their natural habitat.", image: "images/Game Reserve.jpg", ctaLabel: "Enquire", ctaLink: "/contact" }
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
      image: "images/tsisikama.jpg"
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

export interface ServiceCard {
  number: string;
  title: string;
  description: string;
  ctaLabel: string;
}

export const SITE_SERVICES: ServiceCard[] = [
  {
    number: "01",
    title: "Airport Transfers",
    description: "Punctual, private arrivals and departures with a calm, professional welcome.",
    ctaLabel: "REQUEST A QUOTE"
  },
  {
    number: "02",
    title: "Cape Peninsula Tours",
    description: "The full coastal arc • Chapman's Peak, Cape Point and Boulders Beach.",
    ctaLabel: "REQUEST A QUOTE"
  },
  {
    number: "03",
    title: "Cape Town City Tours",
    description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
    ctaLabel: "REQUEST A QUOTE"
  },
  {
    number: "04",
    title: "Winelands Tours",
    description: "Stellenbosch and Franschhoek estates at an unhurried pace.",
    ctaLabel: "REQUEST A QUOTE"
  },
  {
    number: "05",
    title: "Private Chauffeur Services",
    description: "A discreet driver at your disposal, by the hour or by the day.",
    ctaLabel: "REQUEST A QUOTE"
  },
  {
    number: "06",
    title: "Custom Day Tours",
    description: "An itinerary shaped entirely around your interests and your time.",
    ctaLabel: "REQUEST A QUOTE"
  }
];

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
