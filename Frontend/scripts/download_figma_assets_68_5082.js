const fs = require('fs');
const path = require('path');

const assets = [
  { url: 'https://www.figma.com/api/mcp/asset/5f90da1a-8962-43ad-867e-68fa8bfab300', name: 'figma_68_5082_blur.png' },
  { url: 'https://www.figma.com/api/mcp/asset/9dc8224b-ffe0-41d0-826d-1938332ae4e1', name: 'figma_68_5082_icon.png' },
  { url: 'https://www.figma.com/api/mcp/asset/93aac8ad-c3e9-459a-89aa-23bdaba2c65d', name: 'figma_68_5082_frame.png' },
  { url: 'https://www.figma.com/api/mcp/asset/c9f2127a-89c1-4f03-9a6a-69ea51cd2b14', name: 'figma_68_5082_keyboard.png' },
  { url: 'https://www.figma.com/api/mcp/asset/dfcab268-e008-4324-9829-85b1f01930e0', name: 'figma_68_5082_group9.png' },
  { url: 'https://www.figma.com/api/mcp/asset/a255e698-23ef-4975-9892-5b254ac3cddc', name: 'figma_68_5082_group11.png' },
  { url: 'https://www.figma.com/api/mcp/asset/f8e1b545-0ce3-4c95-b605-5a6f1b561e06', name: 'figma_68_5082_rect4.png' },
  { url: 'https://www.figma.com/api/mcp/asset/b33cca01-f559-491d-b8e4-e521105a7cce', name: 'figma_68_5082_rect5.png' },
  { url: 'https://www.figma.com/api/mcp/asset/dcca6206-49fe-4107-bb0f-df2f27005b43', name: 'figma_68_5082_rect6.png' },
  { url: 'https://www.figma.com/api/mcp/asset/20ba0dec-fcb2-450a-8b48-741831a11af6', name: 'figma_68_5082_rect7.png' },
  { url: 'https://www.figma.com/api/mcp/asset/bcd8dd27-d63c-44b2-92bd-6ff1f388542a', name: 'figma_68_5082_rect8.png' },
  { url: 'https://www.figma.com/api/mcp/asset/e8387b00-55ec-4ae8-8794-258fc964dd69', name: 'figma_68_5082_rect9.png' },
  { url: 'https://www.figma.com/api/mcp/asset/99abbe21-e8df-4a67-b2b8-ef147655f607', name: 'figma_68_5082_action.png' },
  { url: 'https://www.figma.com/api/mcp/asset/bb637c4d-1071-40af-ab3e-642ea65e64d0', name: 'figma_68_5082_blur1.png' },
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
