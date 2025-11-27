const fs = require('fs');
const path = require('path');

const fonts = [
  {
    url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf',
    name: 'Roboto-Regular.ttf',
  },
  {
    url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Medium.ttf',
    name: 'Roboto-Medium.ttf',
  },
  {
    url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf',
    name: 'Roboto-Bold.ttf',
  },
  {
    url: 'https://github.com/google/fonts/raw/main/ofl/grandifloraone/GrandifloraOne-Regular.ttf',
    name: 'GrandifloraOne-Regular.ttf',
  },
];

async function download() {
  const outDir = path.join(__dirname, '..', 'assets', 'fonts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const f of fonts) {
    const dest = path.join(outDir, f.name);
    try {
      console.log('Downloading', f.url, '->', dest);
      const res = await fetch(f.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log('Saved', dest);
    } catch (err) {
      console.error('Failed to download', f.url, err.message);
    }
  }
}

download().catch((e) => {
  console.error(e);
  process.exit(1);
});
