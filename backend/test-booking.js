const axios = require('axios');

(async () => {
  try {
    // Login
    const loginRes = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'test@example.com',
      password: 'Test@12345'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Login successful, token length:', token.length);
    
    // Create booking
    console.log('→ Creating booking...');
    const bookingRes = await axios.post('http://localhost:4000/api/bookings', {
      tourId: 25,
      tourDate: '2026-09-30',
      numberOfPassengers: 1
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000
    });
    
    console.log('✓ Booking created:');
    console.log(JSON.stringify(bookingRes.data, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.response?.status, err.response?.data || err.message);
  }
  process.exit(0);
})();
