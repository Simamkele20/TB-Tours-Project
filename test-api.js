const https = require('https');
const http = require('http');

// Note: Replace with a valid JWT token from your local server or .env file
// To get a test token, log in to the application or check your backend logs
const token = process.env.TEST_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REDACTED.REDACTED';

if (token.includes('REDACTED')) {
  console.error('[ERROR] TEST_TOKEN not set. Please set TEST_TOKEN environment variable or use a valid JWT.');
  process.exit(1);
}

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/bookings',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

console.log('[TEST] Requesting: http://localhost:4000/api/bookings');
console.log('[TEST] Token: ' + token.substring(0, 30) + '...');

const req = http.request(options, (res) => {
  console.log('[TEST] Response Status:', res.statusCode);
  console.log('[TEST] Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('[TEST] Response Body:', data);
    if (data) {
      try {
        const json = JSON.parse(data);
        console.log('[TEST] Parsed JSON:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('[TEST] Failed to parse JSON:', e.message);
      }
    }
  });
});

req.on('error', (e) => {
  console.error('[TEST] ERROR:', e);
});

req.on('timeout', () => {
  console.error('[TEST] REQUEST TIMEOUT');
  req.destroy();
});

req.setTimeout(5000);
req.end();
