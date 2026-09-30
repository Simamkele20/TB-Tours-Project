require("dotenv").config({ path: ".env.develop" });

const { connectDB } = require("./src/db/connect");
const Tour = require("./src/models/Tour");

async function listTours() {
  try {
    await connectDB();
    console.log("✓ Connected to database\n");
    
    const tours = await Tour.findAll({
      attributes: ['id', 'title', 'slug', 'price', 'pricePerPerson', 'duration', 'tourType', 'maxPassengers', 'isActive'],
      order: [['id', 'ASC']]
    });
    
    console.log(`📋 Total tours in database: ${tours.length}\n`);
    console.log("Tours:");
    
    tours.forEach((tour, index) => {
      console.log(`\n${index + 1}. ID: ${tour.id}`);
      console.log(`   Title: ${tour.title}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   Price: $${tour.price}`);
      console.log(`   Price Per Person: ${tour.pricePerPerson ? '$' + tour.pricePerPerson : 'N/A'}`);
      console.log(`   Duration: ${tour.duration}`);
      console.log(`   Tour Type: ${tour.tourType}`);
      console.log(`   Max Passengers: ${tour.maxPassengers}`);
      console.log(`   Active: ${tour.isActive ? 'Yes' : 'No'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

listTours();
