const services = [
  // Tours
  { id: "cape-point-tour", name: "Cape Point Tour", category: "tours", priceZar: 2500, description: "Cape Point, Cape of Good Hope & Boulders Beach" },
  { id: "cape-peninsula-tour", name: "Cape Peninsula Tour", category: "tours", priceZar: 2500, description: "Full coastal arc with Chapman's Peak, Cape Point and Boulder's Beach" },
  { id: "winelands-tour", name: "Winelands Tour", category: "tours", priceZar: 2500, description: "Stellenbosch & Franschhoek estates" },
  { id: "cape-town-city-tour", name: "Cape Town City Tour", category: "tours", priceZar: 2000, description: "Table Mountain, Bo-Kaap, V&A Waterfront and city stories" },
  { id: "table-mountain-tour", name: "Table Mountain Tour", category: "tours", priceZar: 2000, description: "Table Mountain and iconic viewpoints" },
  { id: "private-custom-tour", name: "Private Custom Tour", category: "tours", priceZar: 2500, description: "Itinerary shaped around your interests and time" },
  { id: "full-day-private-tour", name: "Full-Day Private Tour", category: "tours", priceZar: 3500, description: "Full day private tour with flexible itinerary" },
  
  // Transfers
  { id: "airport-transfer", name: "Airport Transfer", category: "transfers", priceZar: 650, description: "Private airport arrivals and departures" },
  { id: "private-transfer", name: "Private Transfer", category: "transfers", priceZar: 900, description: "Private point-to-point transfer" },
  { id: "meet-greet", name: "Meet & Greet", category: "transfers", priceZar: 500, description: "Professional meet and greet service" },
  { id: "safari-transfer", name: "Safari Transfer", category: "transfers", priceZar: 3000, description: "Transfer to safari destinations" },
  { id: "corporate-transfer", name: "Corporate Transfer", category: "transfers", priceZar: 1000, description: "Corporate transportation services" },
  
  // Courier Services
  { id: "courier-standard", name: "Courier Services", category: "courier", priceZar: 150, description: "Standard courier service within Cape Town" },
  { id: "courier-same-day", name: "Same-Day Courier", category: "courier", priceZar: 250, description: "Same-day courier delivery" },
  { id: "courier-express", name: "Express Courier", category: "courier", priceZar: 350, description: "Express courier with priority handling" },
  { id: "courier-long-distance", name: "Long-Distance Courier", category: "courier", priceZar: 19, pricingUnit: "per km", description: "Long-distance courier service charged per km" }
];

module.exports = { services };
