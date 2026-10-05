export interface HeroBlock {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image?: string;
  video?: string;
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
  price?: string;
  ctaLabel?: string;
  ctaLink?: string;
  tourId?: number;
}

export interface Partner {
  name: string;
  logo: string;
  url?: string;
}

export interface PageContent {
  hero: HeroBlock;
  partners?: Partner[];
  sectionTitle: string;
  sectionSubtitle: string;
  cards: FeatureCard[];
  trustStrip: string[];
  ctaTitle: string;
  ctaText: string;
}

export interface ItineraryStop {
  time: string;
  title: string;
  description?: string;
}

export interface DestinationDetail {
  title: string;
  slug: string;
  hero: HeroBlock;
  description: string;
  duration: string;
  tourType: string;
  itinerary: ItineraryStop[];
  highlights: string[];
  included: string[];
  excluded: string[];
  bestTime?: string;
  customizeInfo?: string;
  pleaseNote?: string;
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
    partners: [
      {
        name: "Tourism Board",
        logo: "/images/Partner.jpg"
      },
      {
        name: "Tourism Partner",
        logo: "/images/Partner 3.jpg"
      }
    ],
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
        "A Cape Town-based private tour, airport transfer and chauffeur company."
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
      eyebrow: "TOUR",
      title: "Where we will ",
      accent: "take you",
      description:
        "A first selection of the places our journeys are built around.",
      image: "images/camp-bay.jpg"
    },
    sectionTitle: "",
    sectionSubtitle: "",
    cards: [
      { title: "Cape Agulhas Day Tour", description: "Southernmost Tip of Africa", image: "images/destinations/cape-agulhas.jpg", ctaLabel: "View Details", ctaLink: "/destinations/cape-agulhas" },
      { title: "Bo-Kaap & Cape Town City Tour", description: "Culture, History & Iconic Cape Town", image: "images/destinations/bo-kaap.jpg", ctaLabel: "View Details", ctaLink: "/destinations/bo-kaap" },
      { title: "Cape Town Highlights Tour", description: "Discover the Best of Cape Town", image: "images/destinations/cape-town-highlights.jpg", ctaLabel: "View Details", ctaLink: "/destinations/cape-town-highlights" },
      { title: "Cape Winelands Tour", description: "Stellenbosch & Franschhoek", image: "images/destinations/cape-winelands.jpg", ctaLabel: "View Details", ctaLink: "/destinations/cape-winelands" },
      { title: "Cape Peninsula Tour", description: "Cape Point • Cape of Good Hope • Boulder's Beach", image: "images/destinations/cape-peninsula.jpg", ctaLabel: "View Details", ctaLink: "/destinations/cape-peninsula" },
      { title: "Hermanus Whale Coast Tour", description: "Scenic Coastal Drive & Hermanus", image: "images/destinations/hermanus.jpg", ctaLabel: "View Details", ctaLink: "/destinations/hermanus" },
      { title: "Aquila Safari Experience", description: "African Wildlife Adventure", image: "images/destinations/aquila-safari.jpg", ctaLabel: "View Details", ctaLink: "/destinations/aquila-safari" },
      { title: "Constantia Wine & Scenic Tour", description: "Cape Town's Historic Wine Valley", image: "images/destinations/constantia-wine.jpg", ctaLabel: "View Details", ctaLink: "/destinations/constantia-wine" },
      { title: "Cape West Coast Tour", description: "Discover the Wild Beauty of the West Coast", image: "images/destinations/cape-west-coast.jpg", ctaLabel: "View Details", ctaLink: "/destinations/cape-west-coast" },
      { title: "Shark Cage Diving", description: "Experience sharks in their natural ocean environment", image: "images/Shark Cage Diving.jpg", ctaLabel: "View Details", ctaLink: "/destinations/shark-cage-diving" },
      { title: "Garden Route Experience", description: "South Africa's Beautiful Garden Route", image: "images/destinations/garden-route.jpg", ctaLabel: "View Details", ctaLink: "/destinations/garden-route" }
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
  },

  services: {
    hero: {
      eyebrow: "SERVICES",
      title: "Travel your ",
      accent: "way",
      description: "From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.",
      image: "images/camp-bay.jpg"
    },
    sectionTitle: "Travel your way",
    sectionSubtitle: "Choose from our curated tours and experiences. Each journey is tailored to your preferences.",
    cards: [
      {
        title: "Airport Transfers",
        description: "Punctual, private arrivals and departures with a calm, professional welcome.",
        image: "images/Image(13).jpg",
        price: "R650",
        duration: "1-2 Hours",
        ctaLabel: "Book Now",
        ctaLink: "/booking/1",
        tourId: 1
      },
      {
        title: "Cape Peninsula Tours",
        description: "The full coastal arc • Chapman's Peak, Cape Point and Boulders Beach.",
        image: "images/Image(19).jpg",
        price: "R1800pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/2",
        tourId: 2
      },
      {
        title: "Cape Town City Tours",
        description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
        image: "images/Image(13).jpg",
        price: "R1500pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/3",
        tourId: 3
      },
      {
        title: "Winelands Tours",
        description: "Slow afternoons among vineyards and estates in Stellenbosch and Franschhoek.",
        image: "images/franschhoek.jpg",
        price: "R1500pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/4",
        tourId: 4
      },
      {
        title: "Full-Day Private Tour",
        description: "A full day of private tour with flexible itinerary shaped around your interests.",
        image: "images/hermanus.jpg",
        price: "R2000pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/5",
        tourId: 5
      },
      {
        title: "Custom Day Tours",
        description: "An itinerary shaped entirely around your interests and your time.",
        image: "images/kirstenbosch.jpg",
        price: "R2000pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/6",
        tourId: 6
      }
    ],
    trustStrip: ["Private", "Professional", "Personal", "Local insight"],
    ctaTitle: "Ready for this adventure?",
    ctaText: "Request a quote and let us customize your journey"
  },

  tours: {
    hero: {
      eyebrow: "TOURS",
      title: "Our ",
      accent: "Services",
      description: "From airport arrivals to private days exploring the Cape, TB Tours (Pty)Ltd makes every journey comfortable, personal and effortless.",
      image: "images/camp-bay.jpg"
    },
    sectionTitle: "Travel your way",
    sectionSubtitle: "Choose from our curated tours and experiences. Each journey is tailored to your preferences.",
    cards: [
      {
        title: "Airport Transfers",
        description: "Punctual, private arrivals and departures with a calm, professional welcome.",
        image: "images/Image(13).jpg",
        price: "R650",
        duration: "1-2 Hours",
        ctaLabel: "Book Now",
        ctaLink: "/booking/1",
        tourId: 1
      },
      {
        title: "Cape Peninsula Tours",
        description: "The full coastal arc • Chapman's Peak, Cape Point and Boulders Beach.",
        image: "images/Image(19).jpg",
        price: "R1800pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/2",
        tourId: 2
      },
      {
        title: "Cape Town City Tours",
        description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
        image: "images/Image(13).jpg",
        price: "R1500pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/3",
        tourId: 3
      },
      {
        title: "Winelands Tours",
        description: "Slow afternoons among vineyards and estates in Stellenbosch and Franschhoek.",
        image: "images/franschhoek.jpg",
        price: "R1500pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/4",
        tourId: 4
      },
      {
        title: "Full-Day Private Tour",
        description: "A full day of private tour with flexible itinerary shaped around your interests.",
        image: "images/hermanus.jpg",
        price: "R2000pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/5",
        tourId: 5
      },
      {
        title: "Custom Day Tours",
        description: "An itinerary shaped entirely around your interests and your time.",
        image: "images/kirstenbosch.jpg",
        price: "R2000pp",
        duration: "Full Day",
        ctaLabel: "Book Now",
        ctaLink: "/booking/6",
        tourId: 6
      }
    ],
    trustStrip: ["Private", "Professional", "Personal", "Local insight"],
    ctaTitle: "Ready for this adventure?",
    ctaText: "Request a quote and let us customize your journey"
  }
};

export interface ServiceCard {
  number: string;
  title: string;
  description: string;
  price?: number;
  ctaLabel: string;
  tourId?: number;
  ctaLink?: string;
}

export const SITE_SERVICES: ServiceCard[] = [
  {
    number: "01",
    title: "Airport Transfers",
    description: "Punctual, private arrivals and departures with a calm, professional welcome.",
    price: 650,
    ctaLabel: "BOOK",
    tourId: 1,
    ctaLink: "/booking/1"
  },
  {
    number: "02",
    title: "Cape Peninsula Tours",
    description: "The full coastal arc • Chapman's Peak, Cape Point and Boulders Beach.",
    price: 2500,
    ctaLabel: "BOOK",
    tourId: 2,
    ctaLink: "/booking/2"
  },
  {
    number: "03",
    title: "Cape Town City Tours",
    description: "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's stories.",
    price: 2000,
    ctaLabel: "BOOK",
    tourId: 3,
    ctaLink: "/booking/3"
  },
  {
    number: "04",
    title: "Winelands Tours",
    description: "Stellenbosch and Franschhoek estates at an unhurried pace.",
    price: 2500,
    ctaLabel: "BOOK",
    tourId: 4,
    ctaLink: "/booking/4"
  },
  {
    number: "05",
    title: "Full-Day Private Tour",
    description: "A full day of private tour with flexible itinerary shaped around your interests.",
    price: 3500,
    ctaLabel: "BOOK",
    tourId: 5,
    ctaLink: "/booking/5"
  },
  {
    number: "06",
    title: "Custom Day Tours",
    description: "An itinerary shaped entirely around your interests and your time.",
    price: 2500,
    ctaLabel: "BOOK",
    tourId: 6,
    ctaLink: "/booking/6"
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

export const DESTINATIONS_DETAIL: Record<string, DestinationDetail> = {
  "cape-agulhas": {
    title: "Cape Agulhas Day Tour",
    slug: "cape-agulhas",
    hero: {
      eyebrow: "TOUR",
      title: "Cape Agulhas ",
      accent: "Day Tour",
      description: "Visit the Southernmost Tip of Africa where the Atlantic and Indian Oceans meet.",
      image: "images/destinations/Cape Agulhas.jpg"
    },
    description: "Take an unforgettable journey from Cape Town to Cape Agulhas, where the Atlantic and Indian Oceans meet. Enjoy beautiful coastal scenery, charming seaside towns and the iconic Cape Agulhas lighthouse.",
    duration: "Full Day",
    tourType: "Private Tour",
    itinerary: [
      { time: "07:00", title: "Pickup from your hotel or accommodation in Cape Town" },
      { time: "08:30", title: "Scenic drive through the Overberg region" },
      { time: "09:30", title: "Stop in Caledon or surrounding area for a short break" },
      { time: "11:00", title: "Arrive in Cape Agulhas" },
      { time: "11:15", title: "Visit the Southernmost Tip of Africa" },
      { time: "12:00", title: "Explore the coastline and enjoy photo opportunities" },
      { time: "12:30", title: "Visit the historic Cape Agulhas Lighthouse" },
      { time: "13:15", title: "Lunch in the area (own cost)" },
      { time: "14:15", title: "Explore the coastal village and surrounding scenery" },
      { time: "15:00", title: "Begin the scenic return journey to Cape Town" },
      { time: "18:00–19:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Southernmost Tip of Africa",
      "Cape Agulhas coastline",
      "Cape Agulhas Lighthouse",
      "Overberg scenery",
      "Beautiful coastal views",
      "Scenic photo stops",
      "Charming seaside surroundings"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Meals and drinks",
      "Lighthouse entrance fees, if applicable",
      "Personal expenses",
      "Optional activities"
    ],
    pleaseNote: "Travel times may vary depending on traffic, weather and road conditions. The itinerary can also be adjusted according to your preferred departure time and interests."
  },

  "bo-kaap": {
    title: "Bo-Kaap & Cape Town City Tour",
    slug: "bo-kaap",
    hero: {
      eyebrow: "TOUR",
      title: "Bo-Kaap & Cape Town ",
      accent: "City Tour",
      description: "Culture, History & Iconic Cape Town in one unforgettable journey.",
      image: "images/destinations/Image (9).jpg"
    },
    description: "Discover the colourful streets, historic landmarks and beautiful viewpoints that make Cape Town one of South Africa's most exciting cities.",
    duration: "±4–5 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "09:00", title: "Pickup from your accommodation" },
      { time: "09:30", title: "Explore the colourful Bo-Kaap" },
      { time: "10:00", title: "Cape Town CBD" },
      { time: "10:30", title: "Company's Garden" },
      { time: "11:00", title: "Greenmarket Square" },
      { time: "11:30", title: "Explore the historic city centre" },
      { time: "12:00", title: "Signal Hill viewpoint" },
      { time: "13:00", title: "Lunch or coffee stop (own cost)" },
      { time: "14:00", title: "Return to your accommodation" }
    ],
    highlights: [
      "Bo-Kaap",
      "Cape Town CBD",
      "Company's Garden",
      "Greenmarket Square",
      "Historic city centre",
      "Signal Hill",
      "City viewpoints"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Meals and drinks",
      "Attraction entrance fees",
      "Personal expenses",
      "Optional activities"
    ]
  },

  "cape-town-highlights": {
    title: "Cape Town Highlights Tour",
    slug: "cape-town-highlights",
    hero: {
      eyebrow: "TOUR",
      title: "Cape Town ",
      accent: "Highlights Tour",
      description: "Experience the highlights of Cape Town on a private and comfortable journey.",
      image: "images/destinations/Image (5).jpg"
    },
    description: "Experience the highlights of Cape Town on a private and comfortable tour designed to showcase some of the city's most iconic destinations.",
    duration: "±6–7 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "09:00", title: "Pickup from your hotel or accommodation" },
      { time: "09:30", title: "Visit the colourful Bo-Kaap and enjoy a photo stop" },
      { time: "10:00", title: "Explore Cape Town CBD and Company's Garden" },
      { time: "10:45", title: "Table Mountain area and scenic viewpoints" },
      { time: "12:00", title: "Camps Bay" },
      { time: "12:30", title: "Clifton" },
      { time: "13:00", title: "Lunch stop (own cost)" },
      { time: "14:00", title: "Sea Point and Mouille Point" },
      { time: "14:45", title: "Signal Hill viewpoint" },
      { time: "15:30", title: "Return to your accommodation" }
    ],
    highlights: [
      "Bo-Kaap",
      "Table Mountain area",
      "Company's Garden",
      "Camps Bay",
      "Clifton",
      "Sea Point",
      "Signal Hill",
      "Cape Town City Centre"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Attraction entrance fees",
      "Meals and drinks",
      "Personal expenses",
      "Optional activities"
    ]
  },

  "cape-winelands": {
    title: "Cape Winelands Tour",
    slug: "cape-winelands",
    hero: {
      eyebrow: "TOUR",
      title: "Cape ",
      accent: "Winelands Tour",
      description: "Stellenbosch & Franschhoek - Experience vineyards, historic towns and mountain scenery.",
      image: "images/destinations/Image (20).jpg"
    },
    description: "Experience the beauty of the Cape Winelands with a private journey through vineyards, historic towns and spectacular mountain scenery.",
    duration: "±8 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "09:00", title: "Pickup from your hotel or accommodation" },
      { time: "10:00", title: "Arrive in Stellenbosch" },
      { time: "10:15", title: "Explore Stellenbosch town" },
      { time: "11:00", title: "Visit a wine estate and enjoy an optional wine tasting" },
      { time: "12:30", title: "Scenic drive through the Cape Winelands" },
      { time: "13:00", title: "Lunch at a wine estate or in Franschhoek (own cost)" },
      { time: "14:15", title: "Explore Franschhoek village" },
      { time: "14:45", title: "Optional second wine tasting" },
      { time: "15:45", title: "Begin the scenic journey back to Cape Town" },
      { time: "17:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Stellenbosch",
      "Franschhoek",
      "Vineyards",
      "Wine estates",
      "Mountain scenery",
      "Wine tasting opportunities",
      "Scenic photo stops"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Wine tasting fees",
      "Meals and drinks",
      "Personal expenses",
      "Optional activities"
    ]
  },

  "camps-bay": {
    title: "Cape Town Beach Escape",
    slug: "camps-bay",
    hero: {
      eyebrow: "TOUR",
      title: "Cape Town ",
      accent: "Beach Escape",
      description: "Experience Cape Town's Famous Beaches & Coastal Scenery",
      image: "images/destinations/Image (31).jpg"
    },
    description: "Discover the beauty of Cape Town's Atlantic Seaboard on a relaxing private tour with TB Tours. Enjoy breathtaking ocean views, beautiful beaches, mountain scenery and some of Cape Town's most iconic coastal locations.",
    duration: "4–5 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "08:30", title: "Pickup from your accommodation" },
      { time: "09:00", title: "Camps Bay Beach" },
      { time: "09:45", title: "Clifton Beaches" },
      { time: "10:30", title: "Sea Point Promenade" },
      { time: "11:00", title: "Hout Bay, Chapman's Peak, Noordhoek" },
      { time: "12:30", title: "Lunch stop (own cost)" },
      { time: "13:30", title: "Cape Point and Cape of Good Hope" },
      { time: "14:30", title: "Boulder's Beach penguin area (optional entrance fee)" },
      { time: "15:30", title: "Return to Cape Town" }
    ],
    highlights: [
      "Camps Bay Beach",
      "Clifton Beaches",
      "Sea Point Promenade",
      "Bantry Bay",
      "Maiden's Cove"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Meals and drinks",
      "Personal expenses",
      "Optional activities"
    ],
    customizeInfo: "Enjoy a private, comfortable journey with TB Tours, with convenient pickup and drop-off from your accommodation or agreed location in Cape Town. Perfect for couples, families, solo travellers, groups, first-time visitors to Cape Town and photography lovers.",
    bestTime: "Experience beautiful beaches, mountain and ocean views, amazing photo opportunities, scenic coastal drives and relaxed Cape Town atmosphere."
  },

  "cape-peninsula": {
    title: "Cape Point and Cape Peninsula Tour",
    slug: "cape-peninsula",
    hero: {
      eyebrow: "TOUR",
      title: "Cape Point & ",
      accent: "Cape Peninsula Tour",
      description: "Where two oceans meet - Explore Cape Point and Cape of Good Hope",
      image: "images/destinations/Image (30).jpg"
    },
    description: "Experience the iconic Cape Peninsula with a private tour showcasing Cape Point, Cape of Good Hope, and Boulder's Beach penguins.",
    duration: "5–6 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "09:00", title: "Pickup from your accommodation" },
      { time: "10:00", title: "Chapman's Peak scenic drive" },
      { time: "11:00", title: "Cape Point Nature Reserve" },
      { time: "11:30", title: "Cape Point and Cape of Good Hope viewpoints" },
      { time: "12:30", title: "Lunch stop (own cost)" },
      { time: "13:30", title: "Simon's Town" },
      { time: "14:00", title: "Boulder's Beach penguin area (optional entrance fee)" },
      { time: "15:00", title: "Return to Cape Town" }
    ],
    highlights: [
      "Cape Point Nature Reserve",
      "Cape of Good Hope",
      "Chapman's Peak Drive",
      "Boulder's Beach Penguins",
      "Simon's Town",
      "Dramatic coastal scenery"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Attraction entrance fees",
      "Meals and drinks",
      "Personal expenses",
      "Optional activities"
    ]
  },

  "hermanus": {
    title: "Hermanus Whale Coast Tour",
    slug: "hermanus",
    hero: {
      eyebrow: "TOUR",
      title: "Hermanus ",
      accent: "Whale Coast Tour",
      description: "Scenic Coastal Drive & Hermanus - Experience the spectacular Whale Coast.",
      image: "images/destinations/Image (7).jpg"
    },
    description: "Escape Cape Town for a spectacular journey along the Whale Coast and discover the charming coastal town of Hermanus.",
    duration: "±8–9 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "08:00", title: "Pickup from your accommodation" },
      { time: "09:00", title: "Scenic coastal drive" },
      { time: "10:00", title: "Betty's Bay area and photo stop" },
      { time: "11:30", title: "Arrive in Hermanus" },
      { time: "12:00", title: "Explore Hermanus waterfront" },
      { time: "13:00", title: "Lunch (own cost)" },
      { time: "14:00", title: "Coastal walk and whale-watching viewpoints" },
      { time: "15:30", title: "Begin return journey" },
      { time: "17:00", title: "Drop-off in Cape Town" }
    ],
    highlights: [
      "Scenic coastal routes",
      "Betty's Bay",
      "Hermanus",
      "Ocean views",
      "Whale-watching viewpoints",
      "Hermanus waterfront",
      "Coastal photo stops"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Meals and drinks",
      "Whale-watching boat trips",
      "Entrance fees",
      "Personal expenses"
    ],
    pleaseNote: "Whale sightings are seasonal and cannot be guaranteed. Boat trips are subject to availability and weather conditions."
  },

  "aquila-safari": {
    title: "Aquila Safari Experience",
    slug: "aquila-safari",
    hero: {
      eyebrow: "TOUR",
      title: "Aquila ",
      accent: "Safari Experience",
      description: "An Unforgettable African Wildlife Adventure at Aquila Private Game Reserve.",
      image: "images/destinations/Image (10).jpg"
    },
    description: "Leave Cape Town behind and experience the beauty of the South African wilderness with a private trip to Aquila Private Game Reserve.",
    duration: "Full Day",
    tourType: "Private Transportation",
    itinerary: [
      { time: "06:30", title: "Pickup from your accommodation" },
      { time: "08:30", title: "Arrive at Aquila Private Game Reserve" },
      { time: "09:00", title: "Safari/game-drive experience (subject to booking)" },
      { time: "12:00", title: "Lunch (depending on package selected)" },
      { time: "13:30", title: "Free time and relaxation" },
      { time: "15:00", title: "Depart Aquila" },
      { time: "17:00", title: "Scenic return journey to Cape Town" },
      { time: "18:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Aquila Private Game Reserve",
      "African wildlife",
      "Safari experience",
      "Game drive",
      "Scenic landscapes",
      "Full-day adventure"
    ],
    included: [
      "Private transportation from Cape Town",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Safari/game-drive fees",
      "Meals unless included in selected package",
      "Personal expenses",
      "Optional activities"
    ],
    pleaseNote: "Safari activities and availability are subject to the reserve's operating schedule and the package selected."
  },

  "constantia-wine": {
    title: "Constantia Wine & Scenic Tour",
    slug: "constantia-wine",
    hero: {
      eyebrow: "TOUR",
      title: "Constantia Wine & ",
      accent: "Scenic Tour",
      description: "Cape Town's Historic Wine Valley - Discover Constantia's vineyards and scenic beauty.",
      image: "images/destinations/Wine Valley.jpg"
    },
    description: "Discover the beauty of Constantia, one of Cape Town's most scenic and historic wine regions. Enjoy peaceful vineyards, mountain views, beautiful estates and the relaxed atmosphere of Cape Town's southern suburbs.",
    duration: "±5–6 Hours",
    tourType: "Private Tour",
    itinerary: [
      { time: "09:00", title: "Pickup from your hotel or accommodation" },
      { time: "09:30", title: "Scenic drive through the Constantia Valley" },
      { time: "10:00", title: "Visit a historic Constantia wine estate" },
      { time: "10:30", title: "Optional wine tasting (own cost)" },
      { time: "11:45", title: "Scenic drive through the Constantia wine region" },
      { time: "12:15", title: "Visit a second estate or scenic viewpoint" },
      { time: "13:00", title: "Lunch at a wine estate or nearby restaurant (own cost)" },
      { time: "14:15", title: "Relax and enjoy the Constantia surroundings" },
      { time: "15:00", title: "Begin return journey" },
      { time: "15:30", title: "Optional photo stop along the route" },
      { time: "16:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Constantia Valley",
      "Historic wine estates",
      "Vineyard scenery",
      "Mountain views",
      "Wine tasting opportunities",
      "Scenic photo stops",
      "Relaxed Cape Town experience"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "Wine tasting fees",
      "Meals and drinks",
      "Estate entrance fees where applicable",
      "Personal expenses",
      "Optional activities"
    ],
    customizeInfo: "Make your Constantia experience your own. Choose your preferred departure time, wine estates and additional stops."
  },

  "cape-west-coast": {
    title: "Cape West Coast Tour",
    slug: "cape-west-coast",
    hero: {
      eyebrow: "TOUR",
      title: "Cape ",
      accent: "West Coast Tour",
      description: "Discover the Wild Beauty of the West Coast - Langebaan, beaches and coastal villages.",
      image: "images/destinations/Image (4).jpg"
    },
    description: "Escape the city and experience the peaceful beauty of South Africa's West Coast. Enjoy spectacular ocean views, charming coastal towns, natural landscapes and delicious local experiences on a private journey with TB Tours.",
    duration: "Full Day",
    tourType: "Private Tour",
    itinerary: [
      { time: "08:00", title: "Pickup from your hotel or accommodation in Cape Town" },
      { time: "09:30", title: "Scenic drive along the West Coast" },
      { time: "10:30", title: "Stop in the coastal town of Langebaan" },
      { time: "11:00", title: "Explore Langebaan Lagoon and enjoy beautiful photo opportunities" },
      { time: "12:00", title: "Continue towards the West Coast National Park area" },
      { time: "13:00", title: "Lunch stop (own cost)" },
      { time: "14:00", title: "Explore the surrounding coastal scenery and viewpoints" },
      { time: "15:00", title: "Visit a local West Coast town or coastal viewpoint" },
      { time: "16:00", title: "Begin the scenic journey back to Cape Town" },
      { time: "18:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Langebaan",
      "Langebaan Lagoon",
      "West Coast coastline",
      "Scenic viewpoints",
      "Coastal villages",
      "Beautiful photo opportunities",
      "Relaxed West Coast atmosphere"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water"
    ],
    excluded: [
      "National park entrance fees",
      "Meals and drinks",
      "Personal expenses",
      "Optional activities"
    ],
    bestTime: "The West Coast is particularly famous for its colourful wildflowers during the spring flower season. Seasonal attractions and conditions may vary.",
    customizeInfo: "Want to spend more time at the beach, visit additional coastal destinations or add a special experience? Let TB Tours customise your West Coast journey around your schedule."
  },

  "garden-route": {
    title: "Garden Route Experience",
    slug: "garden-route",
    hero: {
      eyebrow: "TOUR",
      title: "Garden Route ",
      accent: "Experience",
      description: "Discover South Africa's Beautiful Garden Route - A 3-5 day journey through coastal beauty.",
      image: "images/destinations/Image (8).jpg"
    },
    description: "Embark on an unforgettable journey from Cape Town through the spectacular Garden Route. Experience beautiful coastlines, forests, lagoons, charming towns and some of South Africa's most scenic destinations.",
    duration: "3–5 Days",
    tourType: "Private Tour",
    itinerary: [
      { time: "Day 1: 07:00", title: "Pickup from accommodation - Journey to Mossel Bay" },
      { time: "Day 1: 15:00", title: "Arrive in Mossel Bay - Explore and check in" },
      { time: "Day 2: 08:00", title: "Breakfast - Depart for Knysna" },
      { time: "Day 2: 14:00", title: "Arrive in Knysna - Visit Waterfront and explore" },
      { time: "Day 3: 09:00", title: "Visit Knysna Heads and travel to Plettenberg Bay" },
      { time: "Day 3: 14:00", title: "Visit coastal viewpoints and nature experiences" },
      { time: "Day 4: 09:30", title: "Journey through Garden Route to Tsitsikamma" },
      { time: "Day 4: 13:30", title: "Visit Storms River Mouth area" },
      { time: "Day 5: 09:00", title: "Begin return journey to Cape Town" },
      { time: "Day 5: 18:00–19:00", title: "Drop-off at your accommodation" }
    ],
    highlights: [
      "Mossel Bay",
      "Wilderness",
      "Knysna",
      "Knysna Heads",
      "Plettenberg Bay",
      "Tsitsikamma",
      "Storms River",
      "Garden Route coastline",
      "Forests and scenic landscapes",
      "Beautiful photo opportunities"
    ],
    included: [
      "Private transportation",
      "Hotel/accommodation pickup and drop-off",
      "Comfortable vehicle",
      "Professional driver",
      "Bottled water",
      "Private travel throughout the itinerary"
    ],
    excluded: [
      "Accommodation",
      "Meals and drinks",
      "National park entrance fees",
      "Activities and excursions",
      "Personal expenses"
    ],
    customizeInfo: "Your Garden Route experience can be customised according to your preferred number of days, accommodation, activities and destinations. Contact TB Tours for a personalised Garden Route quote."
  },

  "shark-cage-diving": {
    title: "Shark Cage Diving Day Tour",
    slug: "shark-cage-diving",
    hero: {
      eyebrow: "TOUR",
      title: "Shark Cage ",
      accent: "Diving",
      description: "Experience the thrill of seeing sharks up close in their natural ocean environment.",
      image: "images/Shark Cage Diving.jpg"
    },
    description: "Experience the thrill of seeing sharks up close in their natural ocean environment with TB Tours. This full-day adventure includes hotel pickup, professional safety briefing, cage-diving experience, and all return transport. An unforgettable marine wildlife encounter.",
    duration: "Full Day (11 hours)",
    tourType: "Private Tour",
    itinerary: [
      { time: "06:00", title: "Cape Town Pickup - Pick-up from your hotel, guesthouse, or agreed meeting point" },
      { time: "06:00–08:00", title: "Travel to Shark Diving Location - Comfortable journey through scenic Western Cape countryside" },
      { time: "08:00", title: "Arrival & Breakfast - Arrive at shark-diving centre, check in and enjoy refreshments" },
      { time: "09:00", title: "Safety Briefing - Professional safety briefing and instructions about cage-diving experience" },
      { time: "09:30", title: "Boat Departure - Board the boat and head out onto the ocean in search of sharks" },
      { time: "10:00", title: "Shark Cage Diving - Enter the cage for close-up experience with sharks in their natural environment" },
      { time: "12:00", title: "Return to Shore - Return to harbour and enjoy time to freshen up and relax" },
      { time: "12:30", title: "Lunch - Optional lunch stop at local restaurant or café" },
      { time: "14:00", title: "Return Journey - Comfortable journey back towards Cape Town" },
      { time: "16:00–17:00", title: "Cape Town Drop-Off - Drop-off at your hotel, guesthouse or agreed location" }
    ],
    highlights: [
      "Close-up shark encounters",
      "Professional safety briefing",
      "Boat departure and ocean experience",
      "Scenic Western Cape countryside",
      "Unforgettable marine wildlife experience"
    ],
    included: [
      "Private TB Tours transportation",
      "Hotel/guesthouse pickup and drop-off",
      "Shark diving operation",
      "Professional guide and safety briefing",
      "Breakfast and light refreshments",
      "All safety equipment"
    ],
    excluded: [
      "Optional lunch",
      "Additional refreshments beyond breakfast",
      "Personal expenses",
      "Photography packages"
    ],
    bestTime: "All year round (conditions permitting)",
    customizeInfo: "Group or private bookings available. Flexible pickup locations within Cape Town.",
    pleaseNote: "The itinerary and times may change according to the shark-diving operator's schedule, weather, sea conditions and wildlife activity. Shark sightings cannot be guaranteed. Participants should be comfortable with water and confined spaces."
  }
};

// Terms & Conditions Content
export interface TermsSection {
  number: string;
  title: string;
  content: string[];
}

export const TERMS_CONTENT: TermsSection[] = [
  {
    number: "1",
    title: "Services",
    content: [
      "TB Tours provides private transport, airport transfers, chauffeur services, sightseeing tours, wine tours, and other transport-related services within Cape Town and surrounding areas."
    ]
  },
  {
    number: "2",
    title: "Bookings",
    content: [
      "All bookings are subject to availability and are confirmed only after acceptance by TB Tours. Customers are responsible for providing accurate booking details."
    ]
  },
  {
    number: "3",
    title: "Payments",
    content: [
      "Payment may be required in advance to secure your booking. Any outstanding balance must be paid before or at the start of the service unless otherwise agreed."
    ]
  },
  {
    number: "4",
    title: "Cancellations and Refunds",
    content: [
      "Cancellations made more than 48 hours before the scheduled service may qualify for a refund.",
      "Cancellations made within 48 hours may be subject to cancellation fees.",
      "No-shows are non-refundable."
    ]
  },
  {
    number: "5",
    title: "Customer Responsibilities",
    content: [
      "Customers must provide accurate booking information.",
      "Arrive at the agreed pickup location on time.",
      "Treat our vehicles and staff with respect.",
      "Follow all safety instructions and wear seat belts where provided."
    ]
  },
  {
    number: "6",
    title: "Vehicle Damage",
    content: [
      "Customers may be held responsible for any damage caused to a TB Tours vehicle through negligence or intentional misconduct."
    ]
  },
  {
    number: "7",
    title: "Delays",
    content: [
      "TB Tours will make every effort to arrive on time. However, we are not liable for delays caused by traffic, weather, road closures, vehicle breakdowns, accidents, or other events beyond our reasonable control."
    ]
  },
  {
    number: "8",
    title: "Personal Belongings",
    content: [
      "Passengers are responsible for their personal belongings. While we will do our best to assist in recovering lost property, TB Tours accepts no responsibility for items left in our vehicles."
    ]
  },
  {
    number: "9",
    title: "Right to Refuse Service",
    content: [
      "TB Tours reserves the right to refuse or terminate a service if a passenger behaves in a threatening, abusive, violent, intoxicated, or unlawful manner that may endanger the driver, other passengers, or the vehicle."
    ]
  },
  {
    number: "10",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, TB Tours shall not be liable for indirect, incidental, or consequential losses arising from the use of our services."
    ]
  },
  {
    number: "11",
    title: "Privacy",
    content: [
      "Personal information collected during bookings will be used only to provide our services, communicate with customers, and comply with legal obligations. We respect your privacy and handle your information responsibly."
    ]
  },
  {
    number: "12",
    title: "Changes to These Terms",
    content: [
      "TB Tours reserves the right to update these Terms & Conditions at any time. Any changes will be published on this website and become effective upon posting."
    ]
  },
  {
    number: "13",
    title: "Governing Law",
    content: [
      "These Terms & Conditions are governed by the laws of the Republic of South Africa."
    ]
  }
];

// FAQs Content
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQsPageContent {
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    image: string;
  };
  faqs: FAQItem[];
  closing: string;
}

export const FAQS_PAGE_CONTENT: FAQsPageContent = {
  hero: {
    eyebrow: "Questions?",
    title: "Frequently Asked",
    accent: "Questions",
    description: "Find answers to common questions about booking tours and our services.",
    image: "images/faq.jpg"
  },
  faqs: [
    {
      question: "What does TB Tours offer?",
      answer: "TB Tours provides premium private tours, airport transfers and personalised travel experiences across Cape Town and the Western Cape."
    },
    {
      question: "Are your tours private?",
      answer: "Yes. Our tours are designed to provide a private and personalised experience, allowing you to explore Cape Town at your own pace."
    },
    {
      question: "Can I customise my itinerary?",
      answer: "Absolutely. We can tailor your experience around your interests, available time and preferred destinations."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes. We offer private airport transfers to and from Cape Town International Airport, with a focus on comfort, punctuality and a seamless arrival or departure."
    },
    {
      question: "Which destinations do you cover?",
      answer: "We operate across Cape Town and surrounding areas, including the Cape Town CBD, Blouberg, Melkbosstrand, Table View, Durbanville, Stellenbosch and other popular Western Cape destinations."
    },
    {
      question: "Can you arrange a complete Cape Town experience?",
      answer: "Yes. We can combine airport transfers, private tours and multiple destinations to create a seamless travel experience throughout your stay."
    },
    {
      question: "Do you cater for couples, families and groups?",
      answer: "Yes. We welcome couples, families, private groups and corporate travellers. We can recommend suitable options based on your group size and requirements."
    },
    {
      question: "How do I reserve a tour?",
      answer: "Simply contact TB Tours with your preferred date, number of guests and desired experience. We will check availability and provide a personalised quotation."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking in advance to secure your preferred date and itinerary, particularly during peak travel seasons."
    },
    {
      question: "What is included in my tour?",
      answer: "Your quotation will clearly outline what is included. Depending on the experience, this may include private transportation, collection and drop-off, and the agreed itinerary."
    },
    {
      question: "Do you provide personalised travel recommendations?",
      answer: "Yes. If you're visiting Cape Town for the first time, we can recommend destinations and experiences that suit your interests and available time."
    },
    {
      question: "Do you offer courier services?",
      answer: "Yes. TB Tours also provides a professional courier and delivery service for suitable items within our service areas."
    },
    {
      question: "How do I receive a quotation?",
      answer: "Send us your requirements via WhatsApp, phone or our website. Our team will provide a personalised quotation based on your journey or experience."
    },
    {
      question: "Why choose TB Tours?",
      answer: "At TB Tours, we focus on comfort, reliability, personal service and memorable experiences. Our goal is to make every journey effortless from the moment you arrive in Cape Town."
    },
    {
      question: "Where can I contact TB Tours?",
      answer: "Our team is available via WhatsApp, phone and our website to assist with bookings, enquiries and personalised travel arrangements."
    }
  ],
  closing: "TB Tours — Discover Cape Town. Travel in Comfort. Experience More."
};

// Couriers Page Content
export interface CourierVehicle {
  name: string;
  seats: number;
  features: string[];
  image?: string;
  capacity?: string;
  specs?: string;
}

export const COURIERS_VEHICLES: CourierVehicle[] = [
  {
    name: "Express Delivery",
    seats: 4,
    features: ["Air conditioning", "Comfortable seating", "Professional driver"],
    image: "images/Del 1.jpg",
    capacity: "Small parcels & documents",
    specs: "Fast, efficient delivery for urgent items"
  },
  {
    name: "Standard Delivery",
    seats: 8,
    features: ["Spacious interior", "Air conditioning", "Luggage space"],
    image: "images/Del 2.jpg",
    capacity: "Medium packages",
    specs: "Reliable service for standard deliveries"
  },
  {
    name: "Premium Delivery",
    seats: 4,
    features: ["Air conditioning", "Comfortable seating", "Professional driver"],
    image: "images/Del 3.jpg",
    capacity: "Large packages",
    specs: "Professional delivery for bulk items"
  },
  {
    name: "Corporate Delivery",
    seats: 8,
    features: ["Spacious interior", "Air conditioning", "Luggage space"],
    image: "images/Del 4.jpg",
    capacity: "Business deliveries",
    specs: "Dedicated service for corporate clients"
  },
  {
    name: "Multi-Stop Delivery",
    seats: 4,
    features: ["Air conditioning", "Comfortable seating", "Professional driver"],
    image: "images/Del 5.jpg",
    capacity: "Multiple deliveries",
    specs: "Efficient multi-stop delivery routes"
  }
];

export interface CourierService {
  number: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
}

export const COURIERS_PAGE_CONTENT = {
  hero: {
    eyebrow: "Delivery Services",
    title: "TB TOURS ",
    accent: "COURIER",
    description: "Fast. Reliable. Door-to-Door. Need to send a parcel, document or package? TB Tours Courier provides reliable door-to-door delivery services for individuals and businesses.",
    image: "images/Del 2.jpg"
  },
  tagline: "We offer convenient local deliveries with a professional and personal service.",
  services: [
    {
      number: "01",
      title: "Same-Day Deliveries",
      description: "Send documents and parcels across your local area with convenient same-day delivery.",
      icon: "📦"
    },
    {
      number: "02",
      title: "Door-to-Door Delivery",
      description: "We collect your parcel from your chosen location and deliver it directly to the recipient.",
      icon: "🚐"
    },
    {
      number: "03",
      title: "Business Deliveries",
      description: "Reliable delivery support for small businesses, offices, guesthouses and other businesses.",
      icon: "🏢"
    },
    {
      number: "04",
      title: "Documents & Small Parcels",
      description: "Ideal for important documents, packages, personal items and other suitable deliveries.",
      icon: "📄"
    },
    {
      number: "05",
      title: "Courier Service",
      description: "Complete courier solutions for your delivery needs.",
      icon: "🚚"
    }
  ],
  pricing: [
    { tier: "0–5 km", distance: "0–5 km", rate: "R60", price: "R60" },
    { tier: "5–10 km", distance: "5–10 km", rate: "R80", price: "R80" },
    { tier: "10–15 km", distance: "10–15 km", rate: "R100", price: "R100" },
    { tier: "15–20 km", distance: "15–20 km", rate: "R120", price: "R120" },
    { tier: "20–30 km", distance: "20–30 km", rate: "R150", price: "R150" },
    { tier: "30–40 km", distance: "30–40 km", rate: "R180", price: "R180" },
    { tier: "40–50 km", distance: "40–50 km", rate: "R220", price: "R220" },
    { tier: "Over 50 km", distance: "Over 50 km", rate: "Contact for quote", price: "Contact for quote" }
  ],
  whyChoose: [
    "Reliable service",
    "Door-to-door delivery",
    "Same-day delivery options",
    "Competitive pricing",
    "Professional service",
    "Ideal for individuals and businesses"
  ],
  steps: [
    { number: "01", title: "Request a Quote", description: "Contact us with your pickup location, delivery location and parcel details." },
    { number: "02", title: "Confirm Your Booking", description: "We'll confirm the price and delivery details with you." },
    { number: "03", title: "We Collect", description: "We collect your parcel from the agreed pickup location." },
    { number: "04", title: "We Deliver", description: "Your parcel is delivered directly to the recipient." }
  ]
};

// Plan Your Stay Content
interface TourPackage {
  title: string;
  price: string;
  description: string;
  duration: string;
  passengers: string;
  includes: string[];
  suggestedItinerary: string[];
  exclusions?: string;
}

interface WhyChooseItem {
  title: string;
  description: string;
}

interface PlanPageContent {
  hero: HeroBlock;
  introduction: string;
  packages: TourPackage[];
  customInfo: string;
  customRequirements: string[];
  addonsInfo: string;
  addons: string[];
  whyChoose: WhyChooseItem[];
  importantInfo: string[];
  contactCTA: string;
}

export const PLAN_PAGE_CONTENT: PlanPageContent = {
  hero: {
    eyebrow: "Your Journey, Our Priority",
    title: "PLAN YOUR",
    accent: "CAPE TOWN STAY",
    description: "Personalised travel planning and transportation for your Cape Town holiday.",
    image: "images/camp-bay.jpg"
  },
  introduction: "Make your Cape Town holiday easier with TB Tours. Instead of booking every transfer separately, let us help you arrange your transportation around your stay. Tell us your travel dates, number of passengers, accommodation and the places you would like to visit, and we can create a personalised travel plan for you. Whether you are visiting Cape Town for 2 days or 7 days, travelling as a couple, family, group or business traveller, TB Tours can help make getting around Cape Town simple and comfortable.",
  packages: [
    {
      title: "2-DAY CAPE TOWN GETAWAY",
      price: "FROM R3,200 PER VEHICLE",
      description: "Perfect for a short Cape Town visit.",
      duration: "2 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Cape Town International Airport pickup",
        "Meet & greet",
        "Private transfer to your accommodation",
        "Cape Town sightseeing",
        "One additional local transfer",
        "Return transfer to the airport",
        "Personal travel assistance"
      ],
      suggestedItinerary: [
        "Day 1 – Airport arrival and Cape Town sightseeing",
        "Day 2 – Flexible sightseeing or private experience and airport transfer"
      ],
      exclusions: "Entrance fees, meals and activities are excluded unless stated in your quotation."
    },
    {
      title: "3-DAY CAPE TOWN EXPERIENCE",
      price: "FROM R5,500 PER VEHICLE",
      description: "Perfect for first-time visitors who want to experience the highlights of Cape Town.",
      duration: "3 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport pickup",
        "Hotel transfer",
        "Cape Town sightseeing",
        "Cape Peninsula experience",
        "One additional local transfer",
        "Private transportation",
        "Airport return transfer",
        "Personal itinerary assistance"
      ],
      suggestedItinerary: [
        "Day 1 – Airport arrival and Cape Town",
        "Day 2 – Cape Peninsula",
        "Day 3 – Flexible experience and departure"
      ],
      exclusions: "Entrance fees, meals and activities are excluded unless stated in your quotation."
    },
    {
      title: "5-DAY CAPE TOWN EXPLORER",
      price: "FROM R9,500 PER VEHICLE",
      description: "A great option for visitors who want more time to explore Cape Town.",
      duration: "5 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport arrival transfer",
        "Cape Town sightseeing",
        "Cape Peninsula experience",
        "Cape Winelands experience",
        "One additional day of private transportation",
        "Hotel transfers",
        "Airport departure transfer",
        "Personal itinerary assistance"
      ],
      suggestedItinerary: [
        "Day 1 – Airport arrival and hotel transfer",
        "Day 2 – Cape Town",
        "Day 3 – Cape Peninsula",
        "Day 4 – Cape Winelands",
        "Day 5 – Flexible sightseeing and airport transfer"
      ],
      exclusions: "Entrance fees, meals, wine tasting fees and activities are excluded unless stated in your quotation."
    },
    {
      title: "7-DAY CAPE TOWN DISCOVERY",
      price: "FROM R13,500 PER VEHICLE",
      description: "Designed for travellers who want to explore Cape Town and surrounding destinations at a relaxed pace.",
      duration: "7 Days",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport arrival transfer",
        "Private transportation throughout selected days",
        "Cape Town sightseeing",
        "Cape Peninsula experience",
        "Cape Winelands experience",
        "One additional day trip",
        "Hotel transfers",
        "Airport departure transfer",
        "Personal itinerary assistance"
      ],
      suggestedItinerary: [
        "Day 1 – Airport arrival",
        "Day 2 – Cape Town",
        "Day 3 – Cape Peninsula",
        "Day 4 – Cape Winelands",
        "Day 5 – Flexible sightseeing",
        "Day 6 – Day trip or custom experience",
        "Day 7 – Airport departure"
      ],
      exclusions: "Entrance fees, meals, wine tasting fees and activities are excluded unless stated in your quotation."
    },
    {
      title: "COUPLES CAPE TOWN ESCAPE",
      price: "FROM R4,500 PER VEHICLE",
      description: "Designed for couples looking for a private and relaxed Cape Town experience.",
      duration: "Flexible",
      passengers: "UP TO 2 PASSENGERS",
      includes: [
        "Airport transfer",
        "Private transportation",
        "Scenic Cape Town locations",
        "Camps Bay",
        "Clifton",
        "Chapman's Peak",
        "Sunset or scenic stop",
        "Hotel transfers",
        "Personal itinerary assistance"
      ],
      suggestedItinerary: [
        "Perfect for anniversaries, honeymoons, birthdays and romantic getaways"
      ],
      exclusions: "Meals, entrance fees and activities are excluded unless stated in your quotation."
    },
    {
      title: "FAMILY CAPE TOWN PACKAGE",
      price: "FROM R6,500 PER VEHICLE",
      description: "Designed for families who want comfortable private transportation throughout their stay.",
      duration: "Flexible",
      passengers: "UP TO 4 PASSENGERS",
      includes: [
        "Airport pickup and drop-off",
        "Private vehicle",
        "Hotel transfers",
        "Cape Town sightseeing",
        "Cape Peninsula experience",
        "Flexible stops",
        "Luggage assistance",
        "Personal travel assistance"
      ],
      suggestedItinerary: [
        "Family-friendly itineraries can be arranged according to your children's ages and interests"
      ],
      exclusions: "Entrance fees, meals and activities are excluded unless stated in your quotation."
    },
    {
      title: "BUSINESS TRAVEL PACKAGE",
      price: "FROM R2,500 PER DAY",
      description: "Keep your business trip organised with private transportation.",
      duration: "Per Day",
      passengers: "FLEXIBLE",
      includes: [
        "Private chauffeur",
        "Hotel pickup",
        "Business meetings and appointments",
        "Airport transfers",
        "Restaurant transfers",
        "Evening transportation",
        "Flexible transportation during the booking period"
      ],
      suggestedItinerary: [
        "Business travellers, Executives, Corporate clients, Conferences, Meetings, Events",
        "Additional hours can be arranged at the applicable hourly rate"
      ]
    },
    {
      title: "PRIVATE CHAUFFEUR ADD-ON",
      price: "FROM R450 PER HOUR",
      description: "Add private chauffeur service to your Cape Town stay.",
      duration: "Hourly",
      passengers: "FLEXIBLE",
      includes: [
        "Shopping",
        "Business meetings",
        "Restaurants",
        "Events",
        "Weddings",
        "Sightseeing",
        "Flexible daily transportation"
      ],
      suggestedItinerary: [
        "Minimum booking applies"
      ]
    },
    {
      title: "GROUP CAPE TOWN TRAVEL",
      price: "FROM R5,500 PER VEHICLE",
      description: "Travelling with family, friends or a larger group?",
      duration: "Flexible",
      passengers: "FLEXIBLE",
      includes: [
        "Family groups",
        "Friends travelling together",
        "Corporate groups",
        "Wedding groups",
        "Events",
        "Airport transfers",
        "Tours and day trips"
      ],
      suggestedItinerary: [
        "Larger groups and vehicle requirements are quoted according to passenger numbers, luggage and itinerary"
      ]
    }
  ],
  customInfo: "Don't see a package that suits you? Create your own Cape Town travel plan with TB Tours.",
  customRequirements: [
    "Your arrival date",
    "Departure date",
    "Number of passengers",
    "Number of bags",
    "Accommodation location",
    "Places you want to visit",
    "Activities you are interested in",
    "Required airport transfers",
    "Any special requirements"
  ],
  addonsInfo: "Add these services to your package:",
  addons: [
    "Airport Meet & Greet",
    "Private Airport Transfers",
    "Chauffeur Service",
    "Cape Peninsula",
    "Cape Town City",
    "Cape Winelands",
    "Hermanus",
    "Cape Agulhas",
    "Garden Route",
    "Shark Cage Diving Transfers",
    "Restaurant Transfers",
    "Event Transportation",
    "Wedding Transportation",
    "Corporate Transportation",
    "Custom Day Trips"
  ],
  whyChoose: [
    {
      title: "PERSONAL SERVICE",
      description: "You are not just another booking. We communicate with you before your trip, help you plan your transportation and remain available throughout your journey."
    },
    {
      title: "PRIVATE TRANSPORTATION",
      description: "Travel with your own private vehicle instead of sharing your journey with strangers."
    },
    {
      title: "FLEXIBLE ITINERARIES",
      description: "Your trip can be adjusted around your interests, schedule and accommodation."
    },
    {
      title: "ONE COMPANY FOR YOUR JOURNEY",
      description: "From airport arrival to sightseeing, chauffeur services and your return airport transfer, TB Tours can assist with your transportation needs."
    }
  ],
  importantInfo: [
    "Prices are starting prices and may change according to dates, route, passenger numbers, vehicle requirements and itinerary.",
    "Prices are quoted per vehicle unless otherwise stated.",
    "Entrance fees are not included unless specifically stated.",
    "Meals are not included unless specifically stated.",
    "Wine tasting fees are not included unless specifically stated.",
    "Activities are not included unless specifically stated.",
    "Larger groups can be accommodated subject to vehicle availability.",
    "Overnight and long-distance travel is quoted separately.",
    "Final pricing will be confirmed before booking."
  ],
  contactCTA: "Send us your travel dates, number of passengers and the places you would like to visit."
};

// Booking Policy Content
export interface BookingPolicySection {
  number: string;
  title: string;
  content: string[];
}

export const BOOKING_POLICY_CONTENT: BookingPolicySection[] = [
  {
    number: "1",
    title: "Booking Policy",
    content: [
      "All bookings are subject to availability and are confirmed only after confirmation from TB Tours. We recommend booking in advance, especially during weekends, public holidays, and peak tourist seasons."
    ]
  },
  {
    number: "2",
    title: "Payment Policy",
    content: [
      "Payment may be required to secure your booking. The remaining balance, if applicable, must be paid before or at the start of the service unless otherwise agreed."
    ]
  },
  {
    number: "3",
    title: "Cancellation Policy",
    content: [
      "Cancellations made more than 48 hours before the scheduled service may qualify for a refund, subject to any non-refundable costs.",
      "Cancellations made within 48 hours of the booking may incur cancellation charges.",
      "No-shows are non-refundable."
    ]
  },
  {
    number: "4",
    title: "Changes to Bookings",
    content: [
      "We will do our best to accommodate changes to bookings. However, changes are subject to vehicle and driver availability."
    ]
  },
  {
    number: "5",
    title: "Waiting Time",
    content: [
      "For airport pickups, complimentary waiting time is provided for delayed flights where flight details have been supplied in advance. Additional waiting time for other services may result in extra charges."
    ]
  },
  {
    number: "6",
    title: "Passenger Responsibility",
    content: [
      "Passengers are expected to treat our vehicles and drivers with respect. TB Tours reserves the right to refuse service to anyone whose behaviour is unsafe, abusive, or illegal."
    ]
  },
  {
    number: "7",
    title: "Safety",
    content: [
      "Your safety is our priority. All passengers must wear seat belts where provided and follow the driver's safety instructions throughout the journey."
    ]
  },
  {
    number: "8",
    title: "Personal Belongings",
    content: [
      "While every effort will be made to return lost items, TB Tours is not responsible for personal belongings left in our vehicles."
    ]
  },
  {
    number: "9",
    title: "Delays",
    content: [
      "Although we always aim to arrive on time, TB Tours cannot be held responsible for delays caused by traffic, weather conditions, road closures, accidents, or other circumstances beyond our control."
    ]
  },
  {
    number: "10",
    title: "Privacy",
    content: [
      "Any personal information collected during bookings is used only to provide our services and communicate with customers. We do not sell or share your personal information with third parties except where required by law."
    ]
  },
  {
    number: "11",
    title: "Contact",
    content: [
      "For booking enquiries, cancellations, or assistance, please contact TB Tours using the details provided on our Contact page.",
      "Thank you for choosing TB Tours. We are committed to providing safe, reliable, professional, and friendly transport and tour services throughout Cape Town and the surrounding areas."
    ]
  }
];
