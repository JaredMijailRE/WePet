const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://www.figma.com/api/mcp/asset/547c19ff-ae44-42fb-8aa2-487b6c3a0f46',
    name: 'figma_68_360.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/18fe98af-5a16-4305-8524-5a2ff12523ae',
    name: 'figma_68_icon.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/03e1c5f7-4e29-4de2-8047-bb1064bfab26',
    name: 'figma_68_frame.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/eb6baa49-56ff-4fcf-83fe-515c2b293eba',
    name: 'figma_68_rightside.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/54ab6bce-354c-481e-a6b1-7a8e43d707ec',
    name: 'figma_68_time.png',
  },
];

async function download() {
  const outDir = path.join(__dirname, '..', 'assets', 'images');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const asset of assets) {
    const dest = path.join(outDir, asset.name);
    try {
      console.log('Downloading', asset.url, '->', dest);
      const res = await fetch(asset.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log('Saved', dest);
    } catch (err) {
      console.error('Failed to download', asset.url, err.message);
    }
  }
}

download().catch((e) => {
  console.error(e);
  process.exit(1);
});
