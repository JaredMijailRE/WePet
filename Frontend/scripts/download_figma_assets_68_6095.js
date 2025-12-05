const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://www.figma.com/api/mcp/asset/a3d97633-ee1a-43dc-b170-0d944a4f122f',
    filename: 'figma_signup_frame121075510.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/3590d527-8641-4540-bb14-5569a61773a9',
    filename: 'figma_signup_icon.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/496e37b3-6522-45bc-b3c5-d8be476c880f',
    filename: 'figma_signup_frame.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/87fab4e5-90a8-4185-8013-1562ea78cb2b',
    filename: 'figma_signup_keyboard.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/7d8116c7-44f9-4e46-be63-b4aa27c9ba00',
    filename: 'figma_signup_action_button.png',
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
