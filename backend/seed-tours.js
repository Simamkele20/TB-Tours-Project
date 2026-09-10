/**
 * Utility script to populate initial tour data matching service cards
 * Usage: node seed-tours.js
 */

require("dotenv").config({ path: ".env.develop" });

const { connectDB } = require("./src/db/connect");
const Tour = require("./src/models/Tour");

const toursData = [
  {
    id: 1,
    title: "Airport Transfers",
    slug: "airport-transfers",
    description: "Punctual, private arrivals and departures with a calm, professional welcome to Cape Town.",
    shortDescription: "Professional airport transfers",
    price: 650.00,
    pricePerPerson: null,
    duration: "1-2 hours",
    tourType: "Private",
    maxPassengers: 6,
    image: "/images/destinations/airport.jpg",
    highlights: [
      "Professional greeting service",
      "Punctual timing",
      "Clean, comfortable vehicle",
      "Friendly service"
    ],
    included: [
      "Private vehicle transfer",
      "Professional driver",
      "Door-to-door service",
      "Wait assistance (15 mins)"
    ],
    excluded: [
      "Meal or refreshments",
      "Extended wait time (charged hourly after 15 mins)"
    ],
    itinerary: [
      { time: "On arrival", title: "Airport pickup", description: "Driver will meet you at your terminal" },
      { time: "On route", title: "Transfer to destination", description: "Professional and comfortable journey" }
    ],
    bestTime: "Available 24/7",
    customizeInfo: "We can accommodate flight changes. Please notify in advance.",
    pleaseNote: "Please provide your flight number and arrival time.",
    isActive: true
  },
  {
    id: 2,
    title: "Cape Peninsula Tours",
    slug: "cape-peninsula",
    description:
      "The full coastal arc featuring Chapman's Peak, Cape Point and Boulders Beach with our experienced guide.",
    shortDescription: "Coastal experience with penguins",
    price: 1800.00,
    pricePerPerson: 1800.00,
    duration: "Full Day (8-9 hours)",
    tourType: "Private",
    maxPassengers: 6,
    image: "/images/Image (19).jpg",
    highlights: [
      "Chapman's Peak Drive",
      "Cape Point - Two Oceans",
      "Boulders Beach Penguins",
      "Scenic coastal views"
    ],
    included: [
      "Professional guide",
      "Vehicle with air conditioning",
      "Lunch at local restaurant",
      "All entrance fees"
    ],
    excluded: ["Alcoholic beverages", "Souvenirs"],
    itinerary: [
      { time: "08:00", title: "Hotel pickup", description: "Start your peninsula adventure" },
      { time: "09:30", title: "Chapman's Peak Drive", description: "Stunning coastal mountain road" },
      { time: "11:00", title: "Cape Point", description: "Where the Atlantic and Indian Oceans meet" },
      { time: "14:00", title: "Boulders Beach", description: "Meet African penguins" }
    ],
    bestTime: "All year round, but October-April offers best weather",
    customizeInfo: "Routes can be adjusted based on passenger preferences",
    pleaseNote: "Wear comfortable shoes. Bring sun protection.",
    isActive: true
  },
  {
    id: 3,
    title: "Cape Town City Tours",
    slug: "cape-town-city",
    description:
      "Table Mountain, Bo-Kaap, the V&A Waterfront and the city's rich stories with a local expert.",
    shortDescription: "Urban cultural experience",
    price: 1500.00,
    pricePerPerson: 1500.00,
    duration: "Full Day (8 hours)",
    tourType: "Private",
    maxPassengers: 6,
    image: "/images/Image (13).jpg",
    highlights: [
      "Table Mountain views",
      "Bo-Kaap colorful neighborhoods",
      "V&A Waterfront",
      "City cultural insights"
    ],
    included: [
      "Professional guide",
      "Vehicle with air conditioning",
      "Table Mountain cable car access",
      "Complimentary refreshments"
    ],
    excluded: ["Meals", "Museum entry fees"],
    itinerary: [
      { time: "08:00", title: "Hotel pickup", description: "Begin your city tour" },
      { time: "08:30", title: "Table Mountain", description: "Cable car experience" },
      { time: "10:30", title: "Bo-Kaap", description: "Colorful houses and street art" },
      { time: "15:00", title: "V&A Waterfront", description: "Shopping and harbor views" }
    ],
    bestTime: "Year-round, avoid December-January peak season",
    customizeInfo: "Can include museums, galleries, or additional neighborhoods",
    pleaseNote: "Comfortable walking shoes recommended.",
    isActive: true
  },
  {
    id: 4,
    title: "Winelands Tours",
    slug: "winelands-tours",
    description:
      "Stellenbosch and Franschhoek estates at an unhurried pace with wine tastings and vineyard views.",
    shortDescription: "Premium wine estate experiences",
    price: 2200.00,
    pricePerPerson: 2200.00,
    duration: "Full Day (9-10 hours)",
    tourType: "Private",
    maxPassengers: 4,
    image: "/images/franschhoek.jpg",
    highlights: [
      "World-class wine tastings",
      "Award-winning estates",
      "Gourmet lunch",
      "Scenic vineyard landscapes"
    ],
    included: [
      "Professional sommelier guide",
      "Luxury vehicle",
      "Wine tastings at 3-4 estates",
      "Gourmet lunch with wine pairing"
    ],
    excluded: ["Additional beverages outside tastings", "Wine purchases"],
    itinerary: [
      { time: "08:00", title: "Hotel pickup", description: "Begin winelands journey" },
      { time: "09:00", title: "First estate", description: "Welcome tasting" },
      { time: "10:30", title: "Second estate", description: "Premium varietals" },
      { time: "12:30", title: "Gourmet lunch", description: "Wine-paired meal" },
      { time: "14:00", title: "Third estate", description: "Sommelier-led tasting" }
    ],
    bestTime: "February to November (harvest and wine season)",
    customizeInfo: "Group tastings available. Focus on specific varietals.",
    pleaseNote: "Designated driver option available. Smart casual dress code.",
    isActive: true
  },
  {
    id: 5,
    title: "Private Chauffeur Services",
    slug: "chauffeur-services",
    description:
      "A discreet, professional driver at your disposal, available by the hour or by the day for your convenience.",
    shortDescription: "On-demand professional driving",
    price: 1200.00,
    pricePerPerson: null,
    duration: "Flexible (hourly or daily)",
    tourType: "Private",
    maxPassengers: 6,
    image: "/images/hermanus.jpg",
    highlights: [
      "Professional courtesy",
      "Flexible scheduling",
      "Local knowledge",
      "Discreet service"
    ],
    included: [
      "Professional chauffeur",
      "Luxury vehicle",
      "Complimentary Wi-Fi and refreshments",
      "Phone charging"
    ],
    excluded: ["Tolls and parking", "Meal arrangements"],
    itinerary: [
      { time: "Flexible", title: "Pickup", description: "At your requested time" },
      { time: "Flexible", title: "Destinations", description: "Go where you choose" },
      { time: "Flexible", title: "Drop-off", description: "To your final destination" }
    ],
    bestTime: "Available 24/7",
    customizeInfo: "Hourly rates available. Multi-day packages offered.",
    pleaseNote: "Minimum 2-hour booking. 24-hour advance booking recommended.",
    isActive: true
  },
  {
    id: 6,
    title: "Custom Day Tours",
    slug: "custom-tours",
    description:
      "An itinerary shaped entirely around your interests and your time, personalized to your preferences.",
    shortDescription: "Tailored bespoke experiences",
    price: 2500.00,
    pricePerPerson: 2500.00,
    duration: "Custom (typically 8 hours)",
    tourType: "Private",
    maxPassengers: 6,
    image: "/images/kirstenbosch.jpg",
    highlights: [
      "Fully personalized itinerary",
      "Expert local guide",
      "Flexible timing",
      "Hidden gems access"
    ],
    included: [
      "Professional guide",
      "Luxury vehicle",
      "Customized itinerary",
      "Expert advice",
      "Hotel pickup and drop-off"
    ],
    excluded: ["Meals (can be arranged)", "Activity entrance fees"],
    itinerary: [
      { time: "Customizable", title: "Consultation", description: "Discuss your interests" },
      { time: "Customizable", title: "Day exploration", description: "Your bespoke itinerary" },
      { time: "Customizable", title: "Flexibility", description: "Adjust plans as needed" }
    ],
    bestTime: "Year-round",
    customizeInfo: "Completely customizable. Works with your schedule.",
    pleaseNote: "Please provide preferences 48 hours in advance.",
    isActive: true
  }
];

const seedTours = async () => {
  try {
    await connectDB();

    console.log("\n[SEED] Starting tour data population...\n");

    for (const tourData of toursData) {
      const existing = await Tour.findOne({ where: { slug: tourData.slug } });

      if (existing) {
        console.log(`✓ Tour already exists: ${tourData.title}`);
      } else {
        await Tour.create(tourData);
        console.log(`✓ Created tour: ${tourData.title}`);
      }
    }

    console.log("\n[SEED] Tour data population complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("[SEED ERROR]", error.message);
    process.exit(1);
  }
};

seedTours();
