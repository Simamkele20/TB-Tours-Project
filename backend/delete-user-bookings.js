require('dotenv').config({ path: '.env.develop' });
const { sequelize } = require('./src/db/connect');
const Booking = require('./src/models/Booking');

const deleteUserBookings = async () => {
  try {
    console.log('[DELETE BOOKINGS] Connecting to database...');
    await sequelize.authenticate();
    console.log('[DELETE BOOKINGS] Connected successfully');

    // Delete all bookings for user 73 (Prince Tancu)
    const deleted = await Booking.destroy({
      where: { UserId: 73 }
    });

    console.log(`[DELETE BOOKINGS] Deleted ${deleted} bookings for user 73`);
    
    await sequelize.close();
    console.log('[DELETE BOOKINGS] Database connection closed');
  } catch (error) {
    console.error('[DELETE BOOKINGS] Error:', error);
    process.exit(1);
  }
};

deleteUserBookings();
