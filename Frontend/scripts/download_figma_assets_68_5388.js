const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://www.figma.com/api/mcp/asset/d8cecf10-4624-4a68-8b03-09b3718de0c3',
    filename: 'figma_password_icon.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/0ff89a5c-09d1-46be-a463-559778a96222',
    filename: 'figma_password_frame.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/c64b9213-af91-4d64-b2c2-26b692fe1339',
    filename: 'figma_password_frame121075669.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/f9f93296-2630-412a-8c74-3c5aa8599938',
    filename: 'figma_password_frame1.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/e13f87c7-0cbe-4384-aed2-bc4c18b95299',
    filename: 'figma_password_vector.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/a371da13-8a26-400b-af44-a6baf819b0c4',
    filename: 'figma_password_vector1.png',
  },
];

const downloadDir = path.join(__dirname, '../assets/images');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadAsset(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(downloadDir, filename);
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Saved ${filepath}`);
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function downloadAll() {
  for (const asset of assets) {
    try {
      await downloadAsset(asset.url, asset.filename);
    } catch (error) {
      console.error(`Error downloading ${asset.filename}:`, error);
    }
  }
  console.log('Download complete!');
}

downloadAll();
