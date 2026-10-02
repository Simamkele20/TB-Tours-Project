/**
 * Seed script to add Plan packages as Tours in the database
 * Run: node seed-plan-packages.js
 */

const { sequelize } = require('./src/db/connect');
const Tour = require('./src/models/Tour');

const planPackages = [
  {
    title: '2-DAY CAPE TOWN GETAWAY',
    slug: '2-day-cape-town-getaway',
    description: 'Perfect for a short Cape Town visit.',
    shortDescription: 'Short Cape Town visit with airport transfers and sightseeing.',
    price: '3200',
    pricePerPerson: '800',
    duration: '2 days',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/cape-town.jpg',
    highlights: [
      'Cape Town International Airport pickup',
      'Meet & greet',
      'Private transfer to accommodation',
      'Cape Town sightseeing',
      'One additional local transfer',
      'Return transfer to airport',
      'Personal travel assistance'
    ],
    included: [
      'Cape Town International Airport pickup',
      'Meet & greet',
      'Private transfer to your accommodation',
      'Cape Town sightseeing',
      'One additional local transfer',
      'Return transfer to the airport',
      'Personal travel assistance'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Activities'
    ],
    itinerary: [
      'Day 1: Airport arrival and Cape Town sightseeing',
      'Day 2: Flexible sightseeing or private experience and airport transfer'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Can be customized based on your interests and schedule.',
    pleaseNote: 'Entrance fees, meals and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: '3-DAY CAPE TOWN EXPERIENCE',
    slug: '3-day-cape-town-experience',
    description: 'Perfect for first-time visitors who want to experience the highlights of Cape Town.',
    shortDescription: 'Experience Cape Town highlights including Cape Peninsula.',
    price: '5500',
    pricePerPerson: '1375',
    duration: '3 days',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/cape-peninsula.jpg',
    highlights: [
      'Airport pickup',
      'Hotel transfer',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'One additional local transfer',
      'Private transportation',
      'Airport return transfer',
      'Personal itinerary assistance'
    ],
    included: [
      'Airport pickup',
      'Hotel transfer',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'One additional local transfer',
      'Private transportation',
      'Airport return transfer',
      'Personal itinerary assistance'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Activities'
    ],
    itinerary: [
      'Day 1: Airport arrival and Cape Town',
      'Day 2: Cape Peninsula',
      'Day 3: Flexible experience and departure'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Itinerary can be adjusted based on your preferences.',
    pleaseNote: 'Entrance fees, meals and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: '5-DAY CAPE TOWN EXPLORER',
    slug: '5-day-cape-town-explorer',
    description: 'A great option for visitors who want more time to explore Cape Town.',
    shortDescription: 'Explore Cape Town, Peninsula, and Winelands.',
    price: '9500',
    pricePerPerson: '2375',
    duration: '5 days',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/winelands.jpg',
    highlights: [
      'Airport arrival transfer',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Cape Winelands experience',
      'One additional day of private transportation',
      'Hotel transfers',
      'Airport departure transfer',
      'Personal itinerary assistance'
    ],
    included: [
      'Airport arrival transfer',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Cape Winelands experience',
      'One additional day of private transportation',
      'Hotel transfers',
      'Airport departure transfer',
      'Personal itinerary assistance'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Wine tasting fees',
      'Activities'
    ],
    itinerary: [
      'Day 1: Airport arrival and hotel transfer',
      'Day 2: Cape Town',
      'Day 3: Cape Peninsula',
      'Day 4: Cape Winelands',
      'Day 5: Flexible sightseeing and airport transfer'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Can be customized to include your preferred attractions and wineries.',
    pleaseNote: 'Entrance fees, meals, wine tasting fees and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: '7-DAY CAPE TOWN DISCOVERY',
    slug: '7-day-cape-town-discovery',
    description: 'Designed for travellers who want to explore Cape Town and surrounding destinations at a relaxed pace.',
    shortDescription: 'Comprehensive Cape Town exploration over 7 days.',
    price: '13500',
    pricePerPerson: '3375',
    duration: '7 days',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/cape-town-scenic.jpg',
    highlights: [
      'Airport arrival transfer',
      'Private transportation throughout selected days',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Cape Winelands experience',
      'One additional day trip',
      'Hotel transfers',
      'Airport departure transfer',
      'Personal itinerary assistance'
    ],
    included: [
      'Airport arrival transfer',
      'Private transportation throughout selected days',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Cape Winelands experience',
      'One additional day trip',
      'Hotel transfers',
      'Airport departure transfer',
      'Personal itinerary assistance'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Wine tasting fees',
      'Activities'
    ],
    itinerary: [
      'Day 1: Airport arrival',
      'Day 2: Cape Town',
      'Day 3: Cape Peninsula',
      'Day 4: Cape Winelands',
      'Day 5: Flexible sightseeing',
      'Day 6: Day trip or custom experience',
      'Day 7: Airport departure'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Fully customizable to match your interests and schedule.',
    pleaseNote: 'Entrance fees, meals, wine tasting fees and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: 'COUPLES CAPE TOWN ESCAPE',
    slug: 'couples-cape-town-escape',
    description: 'Designed for couples looking for a private and relaxed Cape Town experience.',
    shortDescription: 'Romantic Cape Town experience for couples.',
    price: '4500',
    pricePerPerson: '2250',
    duration: '2-3 days',
    tourType: 'plan-package',
    maxPassengers: 2,
    image: '/images/destinations/romantic-cape-town.jpg',
    highlights: [
      'Airport transfer',
      'Private transportation',
      'Scenic Cape Town locations',
      'Camps Bay',
      'Clifton',
      'Chapman\'s Peak',
      'Sunset or scenic stop',
      'Hotel transfers',
      'Personal itinerary assistance'
    ],
    included: [
      'Airport transfer',
      'Private transportation',
      'Scenic Cape Town locations',
      'Camps Bay',
      'Clifton',
      'Chapman\'s Peak',
      'Sunset or scenic stop',
      'Hotel transfers',
      'Personal itinerary assistance'
    ],
    excluded: [
      'Meals',
      'Entrance fees',
      'Activities'
    ],
    itinerary: [
      'Private scenic Cape Town experience',
      'Romantic stops and photo opportunities',
      'Flexible timing and locations'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Perfect for anniversaries, honeymoons, birthdays and romantic getaways.',
    pleaseNote: 'Meals, entrance fees and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: 'FAMILY CAPE TOWN PACKAGE',
    slug: 'family-cape-town-package',
    description: 'Designed for families who want comfortable private transportation throughout their stay.',
    shortDescription: 'Family-friendly Cape Town transportation and sightseeing.',
    price: '6500',
    pricePerPerson: '1625',
    duration: '3-5 days',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/family-cape-town.jpg',
    highlights: [
      'Airport pickup and drop-off',
      'Private vehicle',
      'Hotel transfers',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Flexible stops',
      'Luggage assistance',
      'Personal travel assistance'
    ],
    included: [
      'Airport pickup and drop-off',
      'Private vehicle',
      'Hotel transfers',
      'Cape Town sightseeing',
      'Cape Peninsula experience',
      'Flexible stops',
      'Luggage assistance',
      'Personal travel assistance'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Activities'
    ],
    itinerary: [
      'Family-friendly Cape Town experience',
      'Flexible stops suitable for children',
      'Customizable based on children\'s ages and interests'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Family-friendly itineraries can be arranged according to your children\'s ages and interests.',
    pleaseNote: 'Entrance fees, meals and activities are excluded unless stated in your quotation.',
    isActive: true
  },
  {
    title: 'BUSINESS TRAVEL PACKAGE',
    slug: 'business-travel-package',
    description: 'Keep your business trip organised with private transportation.',
    shortDescription: 'Professional chauffeur service for business travelers.',
    price: '2500',
    pricePerPerson: '2500',
    duration: '1 day',
    tourType: 'plan-package',
    maxPassengers: 4,
    image: '/images/destinations/business-travel.jpg',
    highlights: [
      'Private chauffeur',
      'Hotel pickup',
      'Business meetings and appointments',
      'Airport transfers',
      'Restaurant transfers',
      'Evening transportation',
      'Flexible transportation during the booking period'
    ],
    included: [
      'Private chauffeur',
      'Hotel pickup',
      'Business meetings and appointments',
      'Airport transfers',
      'Restaurant transfers',
      'Evening transportation',
      'Flexible transportation during the booking period'
    ],
    excluded: [
      'Meals',
      'Activities'
    ],
    itinerary: [
      'Flexible business travel support',
      'Available for meetings, appointments and transfers',
      'Additional hours can be arranged'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Ideal for business travellers, executives, corporate clients, conferences and meetings.',
    pleaseNote: 'Additional hours can be arranged at the applicable hourly rate.',
    isActive: true
  },
  {
    title: 'GROUP CAPE TOWN TRAVEL',
    slug: 'group-cape-town-travel',
    description: 'Travelling with family, friends or a larger group? TB Tours can arrange private group transportation.',
    shortDescription: 'Private group transportation for Cape Town stays.',
    price: '5500',
    pricePerPerson: '1375',
    duration: '2-7 days',
    tourType: 'plan-package',
    maxPassengers: 12,
    image: '/images/destinations/group-travel.jpg',
    highlights: [
      'Family groups',
      'Friends travelling together',
      'Corporate groups',
      'Wedding groups',
      'Events',
      'Airport transfers',
      'Tours and day trips'
    ],
    included: [
      'Private group transportation',
      'Airport transfers',
      'Hotel transfers',
      'Sightseeing and tours',
      'Flexible itineraries'
    ],
    excluded: [
      'Entrance fees',
      'Meals',
      'Activities'
    ],
    itinerary: [
      'Customized group itinerary',
      'Multiple vehicle options available',
      'Flexible scheduling'
    ],
    bestTime: 'Year-round',
    customizeInfo: 'Larger groups and vehicle requirements are quoted according to passenger numbers, luggage and itinerary.',
    pleaseNote: 'Entrance fees, meals and activities are excluded unless stated in your quotation.',
    isActive: true
  }
];

const seedPlanPackages = async () => {
  try {
    console.log('[SEED] Connecting to database...');
    await sequelize.authenticate();
    console.log('[SEED] Database connected');

    console.log('[SEED] Syncing models...');
    await sequelize.sync();
    console.log('[SEED] Models synchronized');

    console.log('[SEED] Checking for existing plan packages...');
    const existingCount = await Tour.count({
      where: { tourType: 'plan-package' }
    });

    if (existingCount > 0) {
      console.log(`[SEED] Found ${existingCount} existing plan packages. Skipping seed.`);
      console.log('[SEED] To reseed, delete existing plan packages and run again.');
    } else {
      console.log('[SEED] Adding plan packages to database...');
      
      for (const pkg of planPackages) {
        await Tour.create(pkg);
        console.log(`[SEED] ✓ Created: ${pkg.title}`);
      }

      console.log(`[SEED] ✅ Successfully added ${planPackages.length} plan packages!`);
    }

    await sequelize.close();
    console.log('[SEED] Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error.message);
    console.error('[SEED ERROR STACK]', error.stack);
    process.exit(1);
  }
};

// Run the seed
seedPlanPackages();
