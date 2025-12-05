const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://www.figma.com/api/mcp/asset/a512622c-eed1-4f06-b842-eebbebfc9b24',
    filename: 'figma_verify_360.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/c467e25b-2a85-410b-ada4-ef9a0f062d2b',
    filename: 'figma_verify_rightside.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/0288d2a2-6b71-45f2-9acd-f6fe4ea09795',
    filename: 'figma_verify_time.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/9fdf4260-c00c-4878-8a01-f161f7207863',
    filename: 'figma_verify_icon.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/97b270c0-208b-4a32-8d7b-4f6a4b77bc48',
    filename: 'figma_verify_mail_icon.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/34a487c5-7a7f-4334-b65d-407388274a5e',
    filename: 'figma_verify_back_icon.png',
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
