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
      eyebrow: "Travel in comfort. Arrive in style.",
      title: "Your Journey",
      accent: "Our Priority",
      description:
        "TB Tours offers professional transport and tour services across South Africa.",
      image: "images/home-hero-mercedes-road.jpg"
    },
    sectionTitle: "Our Tours",
    sectionSubtitle: "Unforgettable destinations. Exceptional experiences.",
    cards: [
      {
        title: "Cape Peninsula Tour",
        description: "Experience breathtaking views, charming coastal towns and iconic landmarks.",
        image: "images/card-cape-point.jpg",
        duration: "Full Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Wine Tours",
        description: "Visit the Cape Winelands and enjoy wine tasting at top award-winning estates.",
        image: "images/card-wine-service.jpg",
        duration: "Full Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Whale Watching Tour",
        description: "Witness these magnificent creatures in their natural habitat (seasonal).",
        image: "images/card-cablecar-aerial.jpg",
        duration: "Half Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Garden Route Tour",
        description: "Scenic drives, lush forests, lagoons, beaches and unforgettable stops.",
        image: "images/card-tsitsikamma-bridge.jpg",
        duration: "Multi-Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Cape Town City Tour",
        description: "Explore the history, culture and vibrant life of Cape Town's top attractions.",
        image: "images/card-harbour.jpg",
        duration: "Half Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Boulders Beach Tour",
        description: "Visit the famous penguin colony and enjoy a scenic coastal experience.",
        image: "images/card-penguins.jpg",
        duration: "Half Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Cultural and Heritage Tour",
        description: "Discover South Africa's rich culture, heritage sites and local traditions.",
        image: "images/card-cultural-entry.jpg",
        duration: "Full Day",
        passengers: "1 - 7 People",
        ctaLabel: "View details"
      },
      {
        title: "Private and Group Tours",
        description: "Tailored tours for families, friends, corporates and special occasions.",
        image: "images/card-white-sedan.jpg",
        duration: "Custom",
        passengers: "1 - 14 People",
        ctaLabel: "View details"
      }
    ],
    trustStrip: ["Safe and reliable", "Professional drivers", "Comfortable rides", "On time, every time"],
    ctaTitle: "Ready to explore?",
    ctaText: "Let's make your journey unforgettable."
  },
  about: {
    hero: {
      eyebrow: "About us",
      title: "Passionate About People.",
      accent: "Driven by Excellence.",
      description:
        "TB Tours is a professional transport and tour company based in South Africa. We are committed to providing safe, reliable and comfortable transport and unforgettable travel experiences.",
      image: "images/home-hero-mercedes-road.jpg"
    },
    sectionTitle: "Who We Are",
    sectionSubtitle: "A customer-first team focused on punctuality, safety and service quality.",
    cards: [
      { title: "Our Mission", description: "Deliver dependable transport and unforgettable tours.", image: "images/card-cultural-entry.jpg" },
      { title: "Our Vision", description: "Become one of South Africa's most trusted transport companies.", image: "images/card-cape-good-hope.jpg" },
      { title: "Safety", description: "Your safety is our highest priority on every trip.", image: "images/card-cape-point.jpg" },
      { title: "Customer Care", description: "Clear communication and responsive support.", image: "images/card-estate-lake.jpg" }
    ],
    trustStrip: ["1000+ happy clients", "50+ vehicles", "50+ destinations", "5-star service"],
    ctaTitle: "Meet our team",
    ctaText: "Travel with a professional crew that values your time and comfort."
  },
  services: {
    hero: {
      eyebrow: "Our Services",
      title: "Premium Transport.",
      accent: "Memorable Experiences.",
      description:
        "We provide safe, reliable and comfortable transport and tour services tailored to your needs across South Africa.",
      image: "images/services-hero.jpg"
    },
    sectionTitle: "Our Services",
    sectionSubtitle: "Whether you're traveling for business or leisure, we've got you covered.",
    cards: [
      { title: "Airport Transfers", description: "On-time airport pick-ups and drop-offs for a stress-free journey.", image: "images/card-waterfront.jpg", icon: "bi-airplane-fill" },
      { title: "Hotel Transfers", description: "Reliable transfers to and from your hotel in comfort and style.", image: "images/card-experience-dining.jpg", icon: "bi-building" },
      { title: "Private Chauffeur Services", description: "Professional, discreet and personalized chauffeur services.", image: "images/card-cape-point.jpg", icon: "bi-person-fill" },
      { title: "Day Tours & Excursions", description: "Explore the best attractions and hidden gems with us.", image: "images/card-table-cableway.jpg", icon: "bi-camera-fill" },
      { title: "Wine Tours", description: "Experience the Cape Winelands with our exclusive wine tour packages.", image: "images/card-wine-glass.jpg", icon: "bi-cup-straw" },
      { title: "Group & Event Transport", description: "Comfortable transport for groups, events, and special occasions.", image: "images/card-evening-dining.jpg", icon: "bi-people-fill" },
      { title: "Corporate Transport", description: "Efficient and professional transport solutions for business travelers.", image: "images/card-executive-sedan.jpg", icon: "bi-briefcase-fill" },
      { title: "Cape Peninsula Tours", description: "Discover breathtaking coastal views and iconic landmarks.", image: "images/card-cape-point.jpg", icon: "bi-geo-alt-fill" },
      { title: "Whale Watching Tours", description: "Unforgettable whale watching experiences (seasonal).", image: "images/card-cablecar-aerial.jpg", icon: "bi-water" },
      { title: "Garden Route Tours", description: "Scenic drives and unforgettable stops along the beautiful Garden Route.", image: "images/card-tsitsikamma-bridge.jpg", icon: "bi-signpost-2-fill" }
    ],
    trustStrip: ["Safe & Reliable", "Professional Drivers", "Comfortable Rides", "On Time, Every Time"],
    ctaTitle: "Need a custom route?",
    ctaText: "We design transport plans for families, events and corporate teams."
  },
  tours: {
    hero: {
      eyebrow: "Our Tours",
      title: "Explore. Experience.",
      accent: "Remember.",
      description:
        "Discover the beauty of South Africa with our carefully curated tours. From scenic coastal drives to world-famous attractions, we create unforgettable memories.",
      image: "images/tours-hero.jpg"
    },
    sectionTitle: "Our Tours",
    sectionSubtitle: "Unforgettable destinations. Exceptional experiences.",
    cards: [
      { title: "Cape Peninsula Tour", description: "Experience breathtaking views, charming coastal towns and iconic landmarks.", duration: "Full Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-tsitsikamma-bridge.jpg", icon: "bi-camera-fill" },
      { title: "Wine Tours", description: "Visit the Cape Winelands and enjoy wine tasting at top award-winning estates.", duration: "Full Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-wine-glass.jpg", icon: "bi-cup-straw" },
      { title: "Whale Watching Tour", description: "Witness these magnificent creatures in their natural habitat (seasonal).", duration: "Half Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-cablecar-aerial.jpg", icon: "bi-water" },
      { title: "Garden Route Tour", description: "Scenic drives, lush forests, lagoon, beaches and unforgettable stops along the Garden Route.", duration: "Multi-Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-tsitsikamma-bridge.jpg", icon: "bi-signpost-2-fill" },
      { title: "Cape Town City Tour", description: "Explore the history, culture and vibrant life of Cape Town's top attractions.", duration: "Half Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-harbour.jpg", icon: "bi-building" },
      { title: "Boulders Beach Tour", description: "Visit the famous penguin colony and enjoy a scenic coastal experience.", duration: "Half Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-penguins.jpg", icon: "bi-emoji-sunglasses-fill" },
      { title: "Cultural & Heritage Tour", description: "Discover South Africa's rich culture, heritage sites and local traditions.", duration: "Full Day", passengers: "1 - 7 People", ctaLabel: "View details", image: "images/card-cultural-entry.jpg", icon: "bi-camera-fill" },
      { title: "Private & Group Tours", description: "Tailored tours for families, friends, corporates and special occasions.", duration: "Custom", passengers: "1 - 14 People", ctaLabel: "View details", image: "images/card-evening-dining.jpg", icon: "bi-people-fill" }
    ],
    trustStrip: ["Safe & Reliable", "Professional Drivers", "Comfortable Rides", "On Time, Every Time"],
    ctaTitle: "Ready to explore?",
    ctaText: "Let's make your journey unforgettable."
  },
  fleet: {
    hero: {
      eyebrow: "Our Fleet",
      title: "Comfort. Safety.",
      accent: "Reliability.",
      description:
        "At TB Tours, we take pride in our modern, well-maintained fleet that guarantees comfort, safety and a premium travel experience every time.",
      image: "images/fleet-hero.jpg"
    },
    sectionTitle: "Our Fleet Options",
    sectionSubtitle: "Whether you're traveling solo, with family, or in a group, we have the perfect vehicle for your journey.",
    cards: [
      { title: "Sedan", description: "Perfect for solo travelers or couples.", passengers: "1 - 3 Passengers", bags: "2 Large Bags", image: "images/card-white-sedan.jpg" },
      { title: "SUV", description: "Spacious and comfortable for small groups.", passengers: "1 - 4 Passengers", bags: "4 Large Bags", image: "images/card-red-sedan.jpg" }
    ],
    trustStrip: ["Safety First", "Comfort Guaranteed", "On Time, Every Time", "Professional Drivers"],
    ctaTitle: "Ready to ride?",
    ctaText: "Book your ride with TB Tours today!"
  },
  contact: {
    hero: {
      eyebrow: "Contact us",
      title: "We're Here To Help!",
      accent: "Let's Connect.",
      description:
        "Get in touch for quotes, bookings and custom transport requirements.",
      image: "images/contact-hero.jpg"
    },
    sectionTitle: "Get In Touch",
    sectionSubtitle: "Call, email, or use the booking form for fast assistance.",
    cards: [
      { title: "Call Us", description: "073 448 3958", meta: "Available 24/7", icon: "bi-telephone-fill", image: "images/card-waterfront.jpg" },
      { title: "Email Us", description: "traveling.buddies@tb-tours.com", meta: "We reply within 24 hours", icon: "bi-envelope-fill", image: "images/card-harbour.jpg" },
      { title: "Location", description: "Cape Town, Western Cape", meta: "South Africa", icon: "bi-geo-alt-fill", image: "images/card-table-cableway.jpg" },
      { title: "WhatsApp", description: "073 448 3958", meta: "Quick responses", icon: "bi-whatsapp", image: "images/card-cape-good-hope.jpg" }
    ],
    trustStrip: ["Fast response", "Clear pricing", "Flexible service", "Local support"],
    ctaTitle: "We're one call away",
    ctaText: "Use secure booking and payment to confirm your ride instantly."
  }
};
