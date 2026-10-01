require('dotenv').config({ path: '.env.develop' });
const { initializeDatabase } = require('./models');

async function verifyTours() {
  try {
    await initializeDatabase();
    const Tour = require('./models/Tour');
    
    const tours = await Tour.findAll({
      attributes: ['id', 'title', 'price', 'pricePerPerson'],
      order: [['id', 'ASC']]
    });

    console.log('\n✅ ALL 6 TOURS WITH UPDATED PRICES:\n');
    console.log('=====================================');
    tours.forEach(tour => {
      const priceInfo = tour.pricePerPerson ? ` | Per Person: R${tour.pricePerPerson}` : '';
      console.log(`ID: ${tour.id} | ${tour.title} | Price: R${tour.price}${priceInfo}`);
    });
    console.log('=====================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyTours();
