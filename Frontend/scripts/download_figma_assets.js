const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://www.figma.com/api/mcp/asset/783742f9-cf51-4f20-970f-ba0093a2bddc',
    name: 'figma_logo_apple.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/45f0ff1c-2d0e-4a1d-aadc-66c77f07225f',
    name: 'figma_360.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/88eddd76-602b-4a89-ab2b-2fa9abab6a52',
    name: 'figma_logo.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/928116ea-a64b-40bc-90f8-3d57fe1bda33',
    name: 'figma_rightside.png',
  },
  {
    url: 'https://www.figma.com/api/mcp/asset/b12cceb3-a7a3-40f5-bd71-1da2708010b7',
    name: 'figma_time.png',
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
