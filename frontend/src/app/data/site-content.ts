export interface HeroBlock {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image?: string;
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
  }
};

// Courier-related interfaces and data
export interface CourierService {
  icon: string;
  title: string;
  description: string;
}

export interface PricingTier {
  distance: string;
  price: string;
}

export interface CourierStep {
  number: number;
  title: string;
  description: string;
}

export interface CourierVehicle {
  id: number;
  name: string;
  capacity: string;
  specs: string;
  image: string;
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
      icon: "📦",
      title: "Same-Day Deliveries",
      description: "Send documents and parcels across your local area with convenient same-day delivery."
    },
    {
      icon: "🚐",
      title: "Door-to-Door Delivery",
      description: "We collect your parcel from your chosen location and deliver it directly to the recipient."
    },
    {
      icon: "🏢",
      title: "Business Deliveries",
      description: "Reliable delivery support for small businesses, offices, guesthouses and other businesses."
    },
    {
      icon: "📄",
      title: "Documents & Small Parcels",
      description: "Ideal for important documents, packages, personal items and other suitable deliveries."
    }
  ],
  pricing: [
    { distance: "0–5 km", price: "R60" },
    { distance: "5–10 km", price: "R80" },
    { distance: "10–15 km", price: "R100" },
    { distance: "15–20 km", price: "R120" },
    { distance: "20–30 km", price: "R150" },
    { distance: "30–40 km", price: "R180" },
    { distance: "40–50 km", price: "R220" },
    { distance: "Over 50 km", price: "Contact for quote" }
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
    { number: 1, title: "Request a Quote", description: "Contact us with your pickup location, delivery location and parcel details." },
    { number: 2, title: "Confirm Your Booking", description: "We'll confirm the price and delivery details with you." },
    { number: 3, title: "We Collect", description: "We collect your parcel from the agreed pickup location." },
    { number: 4, title: "We Deliver", description: "Your parcel is delivered directly to the recipient." }
  ]
};

export const COURIERS_VEHICLES: CourierVehicle[] = [
  {
    id: 1,
    name: "Express Delivery",
    capacity: "Small parcels & documents",
    specs: "Fast, efficient delivery for urgent items",
    image: "images/Del 1.jpg"
  },
  {
    id: 2,
    name: "Standard Delivery",
    capacity: "Medium packages",
    specs: "Reliable service for standard deliveries",
    image: "images/Del 2.jpg"
  },
  {
    id: 3,
    name: "Premium Delivery",
    capacity: "Large packages",
    specs: "Professional delivery for bulk items",
    image: "images/Del 3.jpg"
  },
  {
    id: 4,
    name: "Corporate Delivery",
    capacity: "Business deliveries",
    specs: "Dedicated service for corporate clients",
    image: "images/Del 4.jpg"
  },
  {
    id: 5,
    name: "Multi-Stop Delivery",
    capacity: "Multiple deliveries",
    specs: "Efficient multi-stop delivery routes",
    image: "images/Del 5.jpg"
  }
];

export interface TermsSection {
  number: number;
  title: string;
  content: string[];
}

export const TERMS_CONTENT: TermsSection[] = [
  {
    number: 1,
    title: "Services",
    content: [
      "TB Tours provides private transport, airport transfers, chauffeur services, sightseeing tours, wine tours, and other transport-related services within Cape Town and surrounding areas."
    ]
  },
  {
    number: 2,
    title: "Bookings",
    content: [
      "All bookings are subject to availability and are confirmed only after acceptance by TB Tours. Customers are responsible for providing accurate booking details."
    ]
  },
  {
    number: 3,
    title: "Payments",
    content: [
      "Payment may be required in advance to secure your booking. Any outstanding balance must be paid before or at the start of the service unless otherwise agreed."
    ]
  },
  {
    number: 4,
    title: "Cancellations and Refunds",
    content: [
      "• Cancellations made more than 48 hours before the scheduled service may qualify for a refund.",
      "• Cancellations made within 48 hours may be subject to cancellation fees.",
      "• No-shows are non-refundable."
    ]
  },
  {
    number: 5,
    title: "Customer Responsibilities",
    content: [
      "Customers must:",
      "• Provide accurate booking information.",
      "• Arrive at the agreed pickup location on time.",
      "• Treat our vehicles and staff with respect.",
      "• Follow all safety instructions and wear seat belts where provided."
    ]
  },
  {
    number: 6,
    title: "Vehicle Damage",
    content: [
      "Customers may be held responsible for any damage caused to a TB Tours vehicle through negligence or intentional misconduct."
    ]
  },
  {
    number: 7,
    title: "Delays",
    content: [
      "TB Tours will make every effort to arrive on time. However, we are not liable for delays caused by traffic, weather, road closures, vehicle breakdowns, accidents, or other events beyond our reasonable control."
    ]
  },
  {
    number: 8,
    title: "Personal Belongings",
    content: [
      "Passengers are responsible for their personal belongings. While we will do our best to assist in recovering lost property, TB Tours accepts no responsibility for items left in our vehicles."
    ]
  },
  {
    number: 9,
    title: "Right to Refuse Service",
    content: [
      "TB Tours reserves the right to refuse or terminate a service if a passenger behaves in a threatening, abusive, violent, intoxicated, or unlawful manner that may endanger the driver, other passengers, or the vehicle."
    ]
  },
  {
    number: 10,
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, TB Tours shall not be liable for indirect, incidental, or consequential losses arising from the use of our services."
    ]
  },
  {
    number: 11,
    title: "Privacy",
    content: [
      "Personal information collected during bookings will be used only to provide our services, communicate with customers, and comply with legal obligations. We respect your privacy and handle your information responsibly."
    ]
  },
  {
    number: 12,
    title: "Changes to These Terms",
    content: [
      "TB Tours reserves the right to update these Terms & Conditions at any time. Any changes will be published on this website and become effective upon posting."
    ]
  },
  {
    number: 13,
    title: "Governing Law",
    content: [
      "These Terms & Conditions are governed by the laws of the Republic of South Africa."
    ]
  }
];

export interface BookingPolicySection {
  number: number;
  title: string;
  content: string[];
}

export const BOOKING_POLICY_CONTENT: BookingPolicySection[] = [
  {
    number: 1,
    title: "Booking Policy",
    content: [
      "All bookings are subject to availability and are confirmed only after confirmation from TB Tours. We recommend booking in advance, especially during weekends, public holidays, and peak tourist seasons."
    ]
  },
  {
    number: 2,
    title: "Payment Policy",
    content: [
      "Payment may be required to secure your booking. The remaining balance, if applicable, must be paid before or at the start of the service unless otherwise agreed."
    ]
  },
  {
    number: 3,
    title: "Cancellation Policy",
    content: [
      "• Cancellations made more than 48 hours before the scheduled service may qualify for a refund, subject to any non-refundable costs.",
      "• Cancellations made within 48 hours of the booking may incur cancellation charges.",
      "• No-shows are non-refundable."
    ]
  },
  {
    number: 4,
    title: "Changes to Bookings",
    content: [
      "We will do our best to accommodate changes to bookings. However, changes are subject to vehicle and driver availability."
    ]
  },
  {
    number: 5,
    title: "Waiting Time",
    content: [
      "For airport pickups, complimentary waiting time is provided for delayed flights where flight details have been supplied in advance. Additional waiting time for other services may result in extra charges."
    ]
  },
  {
    number: 6,
    title: "Passenger Responsibility",
    content: [
      "Passengers are expected to treat our vehicles and drivers with respect. TB Tours reserves the right to refuse service to anyone whose behaviour is unsafe, abusive, or illegal."
    ]
  },
  {
    number: 7,
    title: "Safety",
    content: [
      "Your safety is our priority. All passengers must wear seat belts where provided and follow the driver's safety instructions throughout the journey."
    ]
  },
  {
    number: 8,
    title: "Personal Belongings",
    content: [
      "While every effort will be made to return lost items, TB Tours is not responsible for personal belongings left in our vehicles."
    ]
  },
  {
    number: 9,
    title: "Delays",
    content: [
      "Although we always aim to arrive on time, TB Tours cannot be held responsible for delays caused by traffic, weather conditions, road closures, accidents, or other circumstances beyond our control."
    ]
  },
  {
    number: 10,
    title: "Privacy",
    content: [
      "Any personal information collected during bookings is used only to provide our services and communicate with customers. We do not sell or share your personal information with third parties except where required by law."
    ]
  },
  {
    number: 11,
    title: "Contact",
    content: [
      "For booking enquiries, cancellations, or assistance, please contact TB Tours using the details provided on our Contact page.",
      "",
      "Thank you for choosing TB Tours. We are committed to providing safe, reliable, professional, and friendly transport and tour services throughout Cape Town and the surrounding areas."
    ]
  }
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "How do I book a tour or transfer?",
    answer: "You can book directly through our website contact form, by phone (073 448 3958), WhatsApp, or by emailing info@tb-tours.co.za. We'll confirm availability and pricing with you promptly."
  },
  {
    question: "What are your delivery timeframes?",
    answer: "For same-day courier services, deliveries are typically completed within 2-4 hours depending on distance. For tours and transfers, timing depends on the specific itinerary and distance."
  },
  {
    question: "Do you operate on weekends and public holidays?",
    answer: "Yes, we offer services on weekends and public holidays. Please contact us in advance for bookings on these days as availability may vary."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Cancellations made more than 48 hours before your booking may qualify for a refund. Cancellations within 48 hours may be subject to fees. Please contact us as soon as possible to discuss modifications."
  },
  {
    question: "What if my parcel is damaged?",
    answer: "We handle all parcels with care. Please report any damage immediately. We will work with you to document the issue and resolve it appropriately."
  },
  {
    question: "Do you offer corporate/bulk delivery discounts?",
    answer: "Yes, we offer competitive pricing for businesses and regular clients. Contact us directly at info@tb-tours.co.za or 073 448 3958 for a customized quote."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, bank transfer, and major credit/debit cards. Payment terms can be arranged for corporate clients. Contact us for details."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we protect all personal information according to our privacy policy. Your data is used only for service delivery and communication purposes."
  }
];
