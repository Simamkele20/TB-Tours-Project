const https = require('https');
const fs = require('fs');
const path = require('path');

// Create destinations folder if it doesn't exist
const destDir = path.join(__dirname, 'frontend/public/images/destinations');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of destination slugs to image URLs from Unsplash
const destinationImages = {
  'cape-agulhas': 'https://images.unsplash.com/photo-1605662235062-31d31bd23533?w=1200&q=80', // Lighthouse
  'bo-kaap': 'https://images.unsplash.com/photo-1551019231-c4b8c9a8f8d7?w=1200&q=80', // Colorful houses
  'cape-town-highlights': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', // Table Mountain
  'cape-winelands': 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=1200&q=80', // Vineyards
  'cape-peninsula': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', // Coastal drive
  'hermanus': 'https://images.unsplash.com/photo-1547521064-7e2b82b339cc?w=1200&q=80', // Whale watching
  'aquila-safari': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', // Wildlife
  'constantia-wine': 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=1200&q=80', // Wine valley
  'cape-west-coast': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', // Coastal scenery
  'garden-route': 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1200&q=80' // Forest
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(destDir, filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('finish', () => {
            console.log(`✓ Downloaded ${filename}`);
            resolve();
          })
          .on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAllImages() {
  console.log('Starting destination image downloads...\n');
  
  for (const [slug, url] of Object.entries(destinationImages)) {
    const filename = `${slug}.jpg`;
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`);
    }
  }
  
  console.log('\n✓ All images downloaded!');
}

downloadAllImages().catch(console.error);
