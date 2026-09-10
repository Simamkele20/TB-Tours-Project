const Destination = require('./src/models/Destination');
const { sequelize } = require('./src/db/connect');

const seedDestinations = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected successfully');

    // Sync database
    await sequelize.sync();
    console.log('[DB] Tables synced');

    const destinations = [
      {
        title: 'Camps Bay',
        slug: 'camps-bay',
        description: 'A scenic coastal drive along the Atlantic seaboard to iconic Camps Bay Beach. Enjoy pristine white sand, crystal-clear waters, and surrounded by dramatic mountain peaks.',
        shortDescription: 'Scenic coastal beach with mountain views',
        duration: '4 hours',
        image: '/images/camp-bay.jpg',
        highlights: ['Scenic views', 'Beach access', 'Local cafes', 'Photography'],
        included: ['Professional guide', 'Hotel pickup', 'Refreshments'],
        excluded: ['Meals', 'Equipment rental'],
        itinerary: [
          { time: '08:00', title: 'Hotel Pickup', description: 'Start your day with a comfortable pickup from your accommodation' },
          { time: '08:30', title: 'Scenic Drive', description: 'Drive along the scenic Atlantic coast' },
          { time: '09:30', title: 'Camps Bay Beach', description: 'Arrive at beautiful Camps Bay and explore the area' },
          { time: '12:00', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'September to May',
        isActive: true,
      },
      {
        title: 'Cape Point',
        slug: 'cape-point',
        description: 'Explore the dramatic Cape Point where the Atlantic Ocean and Indian Ocean meet. Hike to the lighthouse for breathtaking panoramic views and spot wildlife including apes and birds.',
        shortDescription: 'Where two oceans meet with stunning views',
        duration: '6 hours',
        image: '/images/Image(19).jpg',
        highlights: ['Scenic viewpoint', 'Hiking trails', 'Wildlife viewing', 'Photography'],
        included: ['Professional guide', 'Hotel pickup', 'Entry fees', 'Light lunch'],
        excluded: ['Beverages', 'Equipment rental'],
        itinerary: [
          { time: '07:00', title: 'Hotel Pickup', description: 'Comfortable pickup and departure' },
          { time: '08:00', title: 'Drive to Cape Point', description: 'Scenic drive through Cape Peninsula' },
          { time: '09:00', title: 'Hiking', description: 'Guided hike to Cape Point lighthouse' },
          { time: '12:00', title: 'Lunch', description: 'Enjoy a light lunch with ocean views' },
          { time: '14:00', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
      {
        title: 'Winelands Tour',
        slug: 'winelands',
        description: 'Visit world-class vineyards in the Stellenbosch and Franschhoek valleys. Enjoy wine tastings, meet winemakers, and experience South African hospitality in lush vineyards surrounded by mountains.',
        shortDescription: 'World-class vineyards with wine tasting',
        duration: '8 hours',
        image: '/images/franschhoek.jpg',
        highlights: ['Wine tasting', 'Vineyard tours', 'Fine dining', 'Mountain scenery'],
        included: ['Professional guide', 'Hotel pickup', 'Winery visits', 'Wine tastings', 'Lunch'],
        excluded: ['Additional wine purchases', 'Souvenir gifts'],
        itinerary: [
          { time: '08:00', title: 'Hotel Pickup', description: 'Start your wine adventure' },
          { time: '09:00', title: 'First Winery', description: 'Visit first vineyard with tasting' },
          { time: '11:30', title: 'Second Winery', description: 'Wine tasting at second location' },
          { time: '13:00', title: 'Lunch', description: 'Fine dining lunch with local cuisine' },
          { time: '14:30', title: 'Third Winery', description: 'Final vineyard visit and tasting' },
          { time: '16:30', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'March to May, September to November',
        isActive: true,
      },
      {
        title: 'Cape Town City Tour',
        slug: 'city-tour',
        description: 'Comprehensive tour of Cape Town\'s historic city center and iconic landmarks. Visit the V&A Waterfront, Robben Island viewpoint, Table Mountain base, and explore local markets and cultural heritage sites.',
        shortDescription: 'Historic city center with iconic landmarks',
        duration: '5 hours',
        image: '/images/Image(13).jpg',
        highlights: ['Historical sites', 'Local markets', 'Cultural heritage', 'Waterfront views'],
        included: ['Professional guide', 'Hotel pickup', 'Walking tour'],
        excluded: ['Meals', 'Cable car tickets'],
        itinerary: [
          { time: '09:00', title: 'Hotel Pickup', description: 'Begin your city exploration' },
          { time: '09:30', title: 'V&A Waterfront', description: 'Explore the iconic waterfront' },
          { time: '11:00', title: 'Robben Island Viewpoint', description: 'View historical Robben Island' },
          { time: '12:00', title: 'Local Markets', description: 'Browse local crafts and produce' },
          { time: '13:30', title: 'Cultural Sites', description: 'Visit museums and cultural landmarks' },
          { time: '14:30', title: 'Return', description: 'Return to your hotel' }
        ],
        bestTime: 'Year-round',
        isActive: true,
      },
    ];

    // Check if destinations already exist
    for (const dest of destinations) {
      const existing = await Destination.findOne({ where: { slug: dest.slug } });
      if (!existing) {
        await Destination.create(dest);
        console.log(`✓ Created destination: ${dest.title}`);
      } else {
        console.log(`- Destination already exists: ${dest.title}`);
      }
    }

    console.log('[SEED] Destination seeding complete!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
};

seedDestinations();
