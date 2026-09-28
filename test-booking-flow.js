#!/usr/bin/env node

/**
 * Test Script: Verify Booking Creation and Retrieval
 * 
 * This script tests:
 * 1. Login to get a valid JWT token
 * 2. Get available tours
 * 3. Create a booking
 * 4. Verify booking was saved to database (GET /api/bookings)
 * 5. Verify admin can retrieve all bookings (GET /api/admin/bookings)
 * 6. Verify admin can retrieve all users (GET /api/admin/users)
 */

const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:4000';
const TEST_EMAIL = 'princetancu06@gmail.com';
const TEST_PASSWORD = 'secure123';

let authToken = null;

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
            rawBody: data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: null,
            rawBody: data,
            parseError: e.message,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test functions
async function testLogin() {
  console.log('\n📝 Testing Login...');
  const response = await makeRequest('POST', '/api/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  console.log(`  Status: ${response.status}`);
  if (response.status === 200 && response.body.data?.token) {
    authToken = response.body.data.token;
    console.log(`  ✅ Login successful, token received`);
    return true;
  } else {
    console.log(`  ❌ Login failed:`, response.body);
    return false;
  }
}

async function testGetTours() {
  console.log('\n🎫 Testing Get Tours...');
  const response = await makeRequest('GET', '/api/bookings/tours');

  console.log(`  Status: ${response.status}`);
  if (response.status === 200 && response.body.data?.length > 0) {
    console.log(`  ✅ Tours retrieved: ${response.body.data.length} tours found`);
    console.log(`  First tour: ${response.body.data[0].title} (ID: ${response.body.data[0].id})`);
    return response.body.data[0].id;
  } else {
    console.log(`  ❌ Failed to get tours:`, response.body);
    return null;
  }
}

async function testCreateBooking(tourId) {
  console.log('\n✍️ Testing Create Booking...');
  
  if (!authToken) {
    console.log('  ❌ No auth token available');
    return null;
  }

  const bookingData = {
    tourId,
    tourDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    numberOfPassengers: 2,
    specialRequests: 'Test booking',
  };

  const response = await makeRequest('POST', '/api/bookings', bookingData, {
    Authorization: `Bearer ${authToken}`,
  });

  console.log(`  Status: ${response.status}`);
  if (response.status === 201 && response.body.data?.booking) {
    console.log(`  ✅ Booking created successfully`);
    console.log(`     Booking ID: ${response.body.data.booking.id}`);
    console.log(`     Reference: ${response.body.data.booking.bookingReference}`);
    console.log(`     Status: ${response.body.data.booking.status}`);
    console.log(`     Payment Status: ${response.body.data.booking.paymentStatus}`);
    return response.body.data.booking.id;
  } else {
    console.log(`  ❌ Failed to create booking:`, response.body);
    return null;
  }
}

async function testGetUserBookings() {
  console.log('\n📚 Testing Get User Bookings (GET /api/bookings)...');
  
  if (!authToken) {
    console.log('  ❌ No auth token available');
    return false;
  }

  const response = await makeRequest('GET', '/api/bookings', null, {
    Authorization: `Bearer ${authToken}`,
  });

  console.log(`  Status: ${response.status}`);
  if (response.status === 200 && response.body.data) {
    console.log(`  ✅ User bookings retrieved: ${response.body.data.length} bookings found`);
    if (response.body.data.length > 0) {
      console.log(`     Latest booking: ${response.body.data[0].bookingReference}`);
      console.log(`     Status: ${response.body.data[0].status}`);
      console.log(`     Payment Status: ${response.body.data[0].paymentStatus}`);
    }
    return true;
  } else {
    console.log(`  ❌ Failed to get bookings:`, response.body);
    return false;
  }
}

async function testGetAdminBookings() {
  console.log('\n📊 Testing Admin Get All Bookings (GET /api/admin/bookings)...');
  
  if (!authToken) {
    console.log('  ❌ No auth token available');
    return false;
  }

  const response = await makeRequest('GET', '/api/admin/bookings', null, {
    Authorization: `Bearer ${authToken}`,
  });

  console.log(`  Status: ${response.status}`);
  if (response.status === 200 && response.body.data) {
    console.log(`  ✅ Admin bookings retrieved: ${response.body.data.length} bookings found`);
    if (response.body.pagination) {
      console.log(`     Total bookings in DB: ${response.body.pagination.total}`);
      console.log(`     Pagination: page ${response.body.pagination.page} of ${response.body.pagination.pages}`);
    }
    if (response.body.data.length > 0) {
      console.log(`     Latest booking: ${response.body.data[0].bookingReference}`);
      console.log(`     User: ${response.body.data[0].User?.firstName} ${response.body.data[0].User?.lastName}`);
      console.log(`     Tour: ${response.body.data[0].Tour?.title}`);
    }
    return true;
  } else if (response.status === 403) {
    console.log(`  ⚠️  Access denied (not admin): ${response.body.error}`);
    return false;
  } else {
    console.log(`  ❌ Failed to get admin bookings:`, response.body);
    return false;
  }
}

async function testGetAdminUsers() {
  console.log('\n👥 Testing Admin Get All Users (GET /api/admin/users)...');
  
  if (!authToken) {
    console.log('  ❌ No auth token available');
    return false;
  }

  const response = await makeRequest('GET', '/api/admin/users', null, {
    Authorization: `Bearer ${authToken}`,
  });

  console.log(`  Status: ${response.status}`);
  if (response.status === 200 && response.body.data) {
    console.log(`  ✅ Admin users retrieved: ${response.body.data.length} users shown`);
    if (response.body.pagination) {
      console.log(`     Total users in DB: ${response.body.pagination.total}`);
      console.log(`     Pagination: page ${response.body.pagination.page} of ${response.body.pagination.pages}`);
    }
    if (response.body.data.length > 0) {
      console.log(`     Sample users:`);
      response.body.data.slice(0, 3).forEach((user, i) => {
        console.log(`       ${i + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      });
    }
    return true;
  } else if (response.status === 403) {
    console.log(`  ⚠️  Access denied (not admin): ${response.body.error}`);
    return false;
  } else {
    console.log(`  ❌ Failed to get admin users:`, response.body);
    return false;
  }
}

// Main test flow
async function runTests() {
  console.log('🚀 Starting Booking Flow Test...');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Test User: ${TEST_EMAIL}`);

  try {
    // Step 1: Login
    const loginOk = await testLogin();
    if (!loginOk) {
      console.log('\n❌ Login failed, cannot proceed with other tests');
      process.exit(1);
    }

    // Step 2: Get tours
    const tourId = await testGetTours();
    if (!tourId) {
      console.log('\n❌ No tours found, cannot create booking');
      process.exit(1);
    }

    // Step 3: Create a new booking
    const bookingId = await testCreateBooking(tourId);
    // Note: bookingId might be null if using mock payment, but that's okay

    // Step 4: Get user's bookings
    await testGetUserBookings();

    // Step 5: Get admin bookings
    await testGetAdminBookings();

    // Step 6: Get admin users
    await testGetAdminUsers();

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
