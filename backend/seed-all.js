const Destination = require('./src/models/Destination');
const Tour = require('./src/models/Tour');
const { sequelize } = require('./src/db/connect');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected successfully');

    // Sync database
    await sequelize.sync();
    console.log('[DB] Tables synced');

    // Clear existing data
    await Destination.truncate();
    await Tour.truncate();
    console.log('[DB] Cleared existing data');

    // Seed Destinations (12 total)
    const destinations = [
      {
        title: 'Cape Agulhas Day Tour',
        slug: 'cape-agulhas',
        description: 'Visit the Southernmost Tip of Africa where the Atlantic and Indian Oceans meet. Enjoy beautiful coastal scenery, charming seaside towns and the iconic Cape Agulhas lighthouse.',
        shortDescription: 'Southernmost Tip of Africa',
        duration: 'Full Day',
        image: '/images/destinations/Cape Agulhas.jpg',
        highlights: ['Southernmost Tip', 'Lighthouse', 'Coastal views', 'Photo opportunities'],
        included: ['Private transportation', 'Pickup/drop-off', 'Professional driver', 'Bottled water'],
        excluded: ['Meals', 'Entrance fees', 'Personal expenses'],
        itinerary: [
          { time: '07:00', title: 'Pickup from hotel', description: 'Start your journey from your accommodation' },
          { time: '11:00', title: 'Arrive at Cape Agulhas', description: 'Visit the Southernmost Tip of Africa' },
          { time: '12:30', title: 'Lighthouse visit', description: 'Explore the historic Cape Agulhas Lighthouse' },
          { time: '15:00', title: 'Return journey', description: 'Begin scenic drive back to Cape Town' }
        ],
        bestTime: 'September to April',
        isActive: true,
      },
      {
        title: 'Bo-Kaap & Cape Town City Tour',
        slug: 'bo-kaap',
        description: 'Discover the colourful streets, historic landmarks and beautiful viewpoints that make Cape Town one of South Africa\'s most exciting cities.',
        shortDescription: 'Culture, History & Iconic Cape Town',
        duration: '4-5 Hours',
        image: '/images/Image(8).jpg',
        highlights: ['Bo-Kaap', 'CBD', 'Historic landmarks', 'City views'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '09:00', title: 'Hotel pickup', description: 'Start your city adventure' },
          { time: '09:30', title: 'Bo-Kaap exploration', description: 'Explore colourful streets and culture' },
          { time: '11:00', title: 'City centre', description: 'Visit Company\'s Garden and Greenmarket' },
          { time: '13:00', title: 'Return', description: 'Return to your accommodation' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Cape Town Highlights Tour',
        slug: 'cape-town-highlights',
        description: 'Discover the best of Cape Town with visits to iconic landmarks and stunning viewpoints.',
        shortDescription: 'Discover the Best of Cape Town',
        duration: 'Full Day',
        image: '/images/Image(10).jpg',
        highlights: ['Table Mountain', 'V&A Waterfront', 'City landmarks', 'Scenic viewpoints'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off'],
        excluded: ['Meals', 'Cable car tickets'],
        itinerary: [
          { time: '08:00', title: 'Hotel pickup', description: 'Begin your highlights tour' },
          { time: '09:00', title: 'Table Mountain base', description: 'View Table Mountain scenery' },
          { time: '11:00', title: 'V&A Waterfront', description: 'Explore the iconic waterfront' },
          { time: '14:00', title: 'City landmarks', description: 'Visit historical sites' },
          { time: '16:00', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Cape Winelands Tour',
        slug: 'cape-winelands',
        description: 'Experience world-class wine estates at an unhurried pace in Stellenbosch and Franschhoek valleys.',
        shortDescription: 'Stellenbosch & Franschhoek',
        duration: 'Full Day',
        image: '/images/franschhoek.jpg',
        highlights: ['Wine tasting', 'Vineyard tours', 'Fine dining', 'Mountain scenery'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off', 'Wine tastings'],
        excluded: ['Meals', 'Additional wine purchases'],
        itinerary: [
          { time: '08:00', title: 'Hotel pickup', description: 'Begin wine country adventure' },
          { time: '09:30', title: 'First estate', description: 'Wine tasting and vineyard tour' },
          { time: '12:00', title: 'Lunch', description: 'Enjoy a meal at a wine estate' },
          { time: '14:00', title: 'Second estate', description: 'More tastings and exploration' },
          { time: '17:00', title: 'Return', description: 'Return to Cape Town' }
        ],
        bestTime: 'March to May, September to November',
        isActive: true,
      },
      {
        title: 'Cape Peninsula Tour',
        slug: 'cape-peninsula',
        description: 'The full coastal arc featuring Chapman\'s Peak, Cape Point and Boulders Beach with its famous penguin colony.',
        shortDescription: 'Cape Point • Cape of Good Hope • Boulder\'s Beach',
        duration: 'Full Day',
        image: '/images/Image(7).jpg',
        highlights: ['Cape Point', 'Boulders Beach', 'Chapman\'s Peak', 'Wildlife viewing'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off', 'Park entry'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '08:00', title: 'Hotel pickup', description: 'Start peninsula adventure' },
          { time: '09:00', title: 'Scenic drive', description: 'Drive along Chapman\'s Peak' },
          { time: '11:00', title: 'Cape Point', description: 'Visit the dramatic viewpoint' },
          { time: '12:30', title: 'Boulders Beach', description: 'See the famous penguin colony' },
          { time: '15:00', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Hermanus Whale Coast Tour',
        slug: 'hermanus',
        description: 'Scenic coastal drive to Hermanus, known as one of the best land-based whale watching destinations in the world.',
        shortDescription: 'Scenic Coastal Drive & Hermanus',
        duration: 'Full Day',
        image: '/images/hermanus.jpg',
        highlights: ['Whale watching', 'Coastal scenery', 'De Kelders Cave', 'Marine views'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off'],
        excluded: ['Meals', 'Whale watching tour fees'],
        itinerary: [
          { time: '07:00', title: 'Hotel pickup', description: 'Begin coastal journey' },
          { time: '10:00', title: 'Arrive Hermanus', description: 'Explore whale watching town' },
          { time: '11:00', title: 'Cliffs walk', description: 'Scenic coastal cliff walks' },
          { time: '13:00', title: 'Lunch', description: 'Meal in Hermanus' },
          { time: '15:00', title: 'Return', description: 'Begin return to Cape Town' }
        ],
        bestTime: 'June to December (whale season)',
        isActive: true,
      },
      {
        title: 'Aquila Safari Experience',
        slug: 'aquila-safari',
        description: 'African wildlife adventure on a private game reserve near Cape Town with safari game drive.',
        shortDescription: 'African Wildlife Adventure',
        duration: 'Full Day',
        image: '/images/Game Reserve.jpg',
        highlights: ['Big Five', 'Safari drive', 'Wildlife viewing', 'African landscape'],
        included: ['Private transportation', 'Safari guide', 'Pickup/drop-off', 'Game drives'],
        excluded: ['Meals', 'Reserve entry fees'],
        itinerary: [
          { time: '06:00', title: 'Early pickup', description: 'Begin safari adventure' },
          { time: '08:00', title: 'Morning game drive', description: 'Search for wildlife' },
          { time: '12:00', title: 'Lunch', description: 'Rest and meal' },
          { time: '14:00', title: 'Afternoon drive', description: 'More wildlife viewing' },
          { time: '17:00', title: 'Return', description: 'Return to Cape Town' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Constantia Wine & Scenic Tour',
        slug: 'constantia-wine',
        description: 'Explore Cape Town\'s historic wine valley with a selection of award-winning estates and scenic viewpoints.',
        shortDescription: 'Historic Wine Valley',
        duration: 'Full Day',
        image: '/images/destinations/constantia-wine.jpg',
        highlights: ['Wine tasting', 'Historic estates', 'Scenic views', 'Fine dining'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off', 'Wine tastings'],
        excluded: ['Meals', 'Additional purchases'],
        itinerary: [
          { time: '09:00', title: 'Hotel pickup', description: 'Start Constantia tour' },
          { time: '10:00', title: 'First estate', description: 'Explore historic vineyard' },
          { time: '12:00', title: 'Second estate', description: 'Wine tasting experience' },
          { time: '13:30', title: 'Lunch', description: 'Meal at estate' },
          { time: '15:30', title: 'Return', description: 'Return to Cape Town' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Cape West Coast Tour',
        slug: 'cape-west-coast',
        description: 'Discover the wild beauty of the West Coast with scenic drives, fishing villages and pristine beaches.',
        shortDescription: 'Wild Beauty of the West Coast',
        duration: 'Full Day',
        image: '/images/destinations/cape-west-coast.jpg',
        highlights: ['Pristine beaches', 'Fishing villages', 'Coastal scenery', 'Local culture'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '07:00', title: 'Hotel pickup', description: 'Begin West Coast adventure' },
          { time: '09:00', title: 'Langebaan', description: 'Visit lagoon and village' },
          { time: '11:00', title: 'Coastal drive', description: 'Scenic coastal exploration' },
          { time: '13:00', title: 'Lunch', description: 'Meal at local restaurant' },
          { time: '15:00', title: 'Return', description: 'Return to Cape Town' }
        ],
        bestTime: 'September to April',
        isActive: true,
      },
      {
        title: 'Garden Route Experience',
        slug: 'garden-route',
        description: 'Explore South Africa\'s Beautiful Garden Route with diverse landscapes, forests and charming towns.',
        shortDescription: 'South Africa\'s Beautiful Garden Route',
        duration: '2-3 Days',
        image: '/images/Image(11).jpg',
        highlights: ['Scenic towns', 'Knysna Heads', 'Forests', 'Wildlife'],
        included: ['Private transportation', 'Professional guide', 'Pickup/drop-off'],
        excluded: ['Accommodation', 'Meals', 'Activity fees'],
        itinerary: [
          { time: '08:00', title: 'Depart Cape Town', description: 'Begin Garden Route journey' },
          { time: '14:00', title: 'Mossel Bay', description: 'Explore coastal town' },
          { time: '16:00', title: 'Scenic drive', description: 'Travel to Garden Route' },
          { time: '18:00', title: 'Knysna arrival', description: 'Settle in for overnight' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Table Mountain',
        slug: 'table-mountain',
        description: 'See Cape Town from above with stunning views from the top of Table Mountain.',
        shortDescription: 'See Cape Town from above',
        duration: 'Half Day',
        image: '/images/Image(13).jpg',
        highlights: ['Panoramic views', 'Photo opportunities', 'Scenic hiking', 'City views'],
        included: ['Private transportation', 'Hotel pickup', 'Refreshments'],
        excluded: ['Cable car tickets', 'Meals'],
        itinerary: [
          { time: '08:00', title: 'Hotel pickup', description: 'Begin mountain adventure' },
          { time: '08:30', title: 'Arrive Table Mountain base', description: 'Start ascent' },
          { time: '10:00', title: 'Summit experience', description: 'Enjoy panoramic views' },
          { time: '12:00', title: 'Return', description: 'Return to hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Boulders Beach',
        slug: 'boulders-beach',
        description: 'Meet Cape Town\'s famous penguin colony at Boulders Beach with pristine white sands.',
        shortDescription: 'Meet Cape Town\'s famous penguins',
        duration: 'Half Day',
        image: '/images/Image(18).jpg',
        highlights: ['Penguin colony', 'Beach access', 'Photography', 'Nature'],
        included: ['Private transportation', 'Hotel pickup', 'Park entry'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '09:00', title: 'Hotel pickup', description: 'Begin peninsula tour' },
          { time: '10:00', title: 'Boulders Beach', description: 'Explore penguin colony' },
          { time: '12:00', title: 'Return', description: 'Return to hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      }
    ];

    // Seed Tours (6 total)
    const tours = [
      {
        title: 'Table Mountain Tour',
        slug: 'table-mountain-tour',
        description: 'See Cape Town from above with breathtaking panoramic views.',
        shortDescription: 'See Cape Town from above',
        price: 1500,
        pricePerPerson: 150,
        duration: 'Half Day',
        tourType: 'City Tour',
        maxPassengers: 6,
        image: '/images/Image(13).jpg',
        highlights: ['Panoramic views', 'Photo opportunities', 'Scenic location'],
        included: ['Professional guide', 'Hotel pickup', 'Bottled water'],
        excluded: ['Cable car tickets', 'Meals'],
        itinerary: [
          { time: '08:00', title: 'Hotel Pickup', description: 'Start your day' },
          { time: '10:00', title: 'Table Mountain Summit', description: 'Enjoy panoramic views' },
          { time: '12:00', title: 'Return', description: 'Return to hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Cape Peninsula Tour',
        slug: 'cape-peninsula-tour',
        description: 'The full coastal arc with Chapman\'s Peak, Cape Point and Boulders Beach.',
        shortDescription: 'Cape Point, Cape of Good Hope & Boulders Beach',
        price: 1800,
        pricePerPerson: 200,
        duration: 'Full Day',
        tourType: 'Scenic Tour',
        maxPassengers: 6,
        image: '/images/Image(4).jpg',
        highlights: ['Cape Point', 'Boulders Beach', 'Chapman\'s Peak', 'Penguin Colony'],
        included: ['Professional guide', 'Hotel pickup', 'Park entry', 'Bottled water'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '08:00', title: 'Hotel Pickup', description: 'Begin peninsula adventure' },
          { time: '10:00', title: 'Chapman\'s Peak', description: 'Scenic drive' },
          { time: '11:30', title: 'Cape Point', description: 'Visit the dramatic viewpoint' },
          { time: '13:00', title: 'Lunch Break', description: 'Rest and food' },
          { time: '14:00', title: 'Boulders Beach', description: 'Meet the penguins' },
          { time: '16:00', title: 'Return', description: 'Return to hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Boulders Beach Penguin Tour',
        slug: 'boulders-beach-tour',
        description: 'Visit Cape Town\'s famous penguin colony at beautiful Boulders Beach.',
        shortDescription: 'Meet Cape Town\'s famous penguins',
        price: 1200,
        pricePerPerson: 120,
        duration: 'Half Day',
        tourType: 'Wildlife Tour',
        maxPassengers: 8,
        image: '/images/Image(18).jpg',
        highlights: ['Penguin Colony', 'White Sand Beach', 'Photography', 'Wildlife'],
        included: ['Professional guide', 'Hotel pickup', 'Park entry', 'Refreshments'],
        excluded: ['Meals', 'Personal expenses'],
        itinerary: [
          { time: '09:00', title: 'Hotel Pickup', description: 'Begin tour' },
          { time: '10:30', title: 'Boulders Beach', description: 'Explore and photograph penguins' },
          { time: '12:00', title: 'Return', description: 'Return to hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Cape Winelands Tour',
        slug: 'winelands-tour',
        description: 'Experience world-class wine estates in Stellenbosch and Franschhoek at an unhurried pace.',
        shortDescription: 'Stellenbosch and Franschhoek wine estates',
        price: 2200,
        pricePerPerson: 250,
        duration: 'Full Day',
        tourType: 'Wine Tour',
        maxPassengers: 6,
        image: '/images/franschhoek.jpg',
        highlights: ['Wine Tasting', 'Vineyard Tours', 'Fine Dining', 'Mountain Scenery'],
        included: ['Professional guide', 'Hotel pickup', 'Wine tastings', 'Bottled water'],
        excluded: ['Meals', 'Additional wine purchases'],
        itinerary: [
          { time: '08:00', title: 'Hotel Pickup', description: 'Begin wine adventure' },
          { time: '09:30', title: 'First Estate', description: 'Wine tasting and tour' },
          { time: '12:00', title: 'Lunch', description: 'Meal at wine estate' },
          { time: '14:00', title: 'Second Estate', description: 'More wine experiences' },
          { time: '16:30', title: 'Return', description: 'Return to Cape Town' }
        ],
        bestTime: 'March to May, September to November',
        isActive: true,
      },
      {
        title: 'Private Chauffeur Services',
        slug: 'private-chauffeur',
        description: 'A discreet driver at your disposal, by the hour or by the day for your custom itinerary.',
        shortDescription: 'Professional driver services',
        price: 1200,
        pricePerPerson: 200,
        duration: 'Flexible',
        tourType: 'Transfer/Chauffeur',
        maxPassengers: 4,
        image: '/images/hermanus.jpg',
        highlights: ['Professional Driver', 'Flexible Timing', 'Comfortable Vehicle', 'Local Knowledge'],
        included: ['Professional chauffeur', 'Comfortable vehicle', 'Bottled water', 'Phone support'],
        excluded: ['Meals', 'Fuel surcharges'],
        itinerary: [
          { time: 'Flexible', title: 'Custom Itinerary', description: 'Design your own journey with our driver' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Custom Day Tours',
        slug: 'custom-day-tour',
        description: 'An itinerary shaped entirely around your interests, timeline and preferences.',
        shortDescription: 'Tailored to your interests',
        price: 2500,
        pricePerPerson: 250,
        duration: 'Full Day',
        tourType: 'Custom Tour',
        maxPassengers: 6,
        image: '/images/kirstenbosch.jpg',
        highlights: ['Personalized Itinerary', 'Flexible Timing', 'Local Expertise', 'Unique Experience'],
        included: ['Professional guide', 'Hotel pickup', 'Custom routing', 'Bottled water'],
        excluded: ['Meals', 'Attraction fees', 'Personal expenses'],
        itinerary: [
          { time: 'Custom', title: 'Your Journey', description: 'Customized based on your preferences' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      }
    ];

    // Insert destinations
    for (const dest of destinations) {
      const existing = await Destination.findOne({ where: { slug: dest.slug } });
      if (!existing) {
        await Destination.create(dest);
        console.log(`✓ Created destination: ${dest.title}`);
      }
    }

    // Insert tours
    for (const tour of tours) {
      const existing = await Tour.findOne({ where: { slug: tour.slug } });
      if (!existing) {
        await Tour.create(tour);
        console.log(`✓ Created tour: ${tour.title}`);
      }
    }

    console.log('[SEED] All data seeded successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
};

seedData();
