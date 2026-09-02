const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Bypass SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Image mapping: local name -> Pexels download URL
const images = {
  // Hero images
  'hero-drive-poster.jpg': 'https://images.pexels.com/photos/8470660/pexels-photo-8470660.jpeg?cs=srgb&dl=pexels-jay-jay-redelinghuys-61078147-8470660.jpg&fm=jpg',
  
  // Services & Tours
  'chauffeur.jpg': 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'chapmans-peak.jpg': 'https://images.pexels.com/photos/36597753/pexels-photo-36597753.jpeg?cs=srgb&dl=pexels-adrien-olichon-1257089-36597753.jpg&fm=jpg',
  'waterfront.jpg': 'https://images.pexels.com/photos/35398305/pexels-photo-35398305.jpeg?cs=srgb&dl=pexels-stefan-maritz-1452486-35398305.jpg&fm=jpg',
  'table-mountain.jpg': 'https://images.pexels.com/photos/36597753/pexels-photo-36597753.jpeg?cs=srgb&dl=pexels-adrien-olichon-1257089-36597753.jpg&fm=jpg',
  'winelands.jpg': 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=600',
  'cape-point.jpg': 'https://images.pexels.com/photos/4684358/pexels-photo-4684358.jpeg?cs=srgb&dl=pexels-taryn-elliott-4684358.jpg&fm=jpg',
  'city-tour.jpg': 'https://images.pexels.com/photos/25650566/pexels-photo-25650566.jpeg?cs=srgb&dl=pexels-photations-25650566.jpg&fm=jpg',
  'thabang-portrait.jpg': 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const outputDir = path.join(__dirname, 'frontend', 'public', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Download function
function downloadImage(filename, url) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);
    
    const protocol = url.startsWith('https') ? https : http;
    const agent = new https.Agent({ rejectUnauthorized: false });
    
    protocol.get(url, { agent }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file async
      console.error(`✗ Failed: ${filename} - ${err.message}`);
      reject(err);
    });
  });
}

// Download all images
async function downloadAll() {
  console.log('Starting image download...\n');
  const results = { success: [], failed: [] };
  
  for (const [filename, url] of Object.entries(images)) {
    try {
      await downloadImage(filename, url);
      results.success.push(filename);
    } catch (error) {
      results.failed.push(filename);
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Successfully downloaded: ${results.success.length}`);
  if (results.failed.length > 0) {
    console.log(`⚠️  Failed downloads: ${results.failed.length}`);
    console.log('Failed files:', results.failed);
  }
}

downloadAll().catch(console.error);
