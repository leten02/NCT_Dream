const fs = require('fs');
const { PNG } = require('pngjs');

const bgBuf = fs.readFileSync('public/background.png');
const stageBuf = fs.readFileSync('public/stage.png');

const bg = PNG.sync.read(bgBuf);
const stage = PNG.sync.read(stageBuf);

console.log(`bg: ${bg.width}x${bg.height}`);
console.log(`stage: ${stage.width}x${stage.height}`);

// Check if stage matches bg at offset x=688, y=600
let match = true;
let diffCount = 0;
let totalChecked = 0;

for (let y = 0; y < stage.height; y+=10) {
  for (let x = 0; x < stage.width; x+=10) {
    const stageIdx = (stage.width * y + x) << 2;
    const bgIdx = (bg.width * (y + 600) + (x + 688)) << 2;
    
    // Only check non-transparent pixels
    if (stage.data[stageIdx + 3] > 0) {
      totalChecked++;
      if (
        Math.abs(stage.data[stageIdx] - bg.data[bgIdx]) > 5 ||
        Math.abs(stage.data[stageIdx + 1] - bg.data[bgIdx + 1]) > 5 ||
        Math.abs(stage.data[stageIdx + 2] - bg.data[bgIdx + 2]) > 5
      ) {
        diffCount++;
      }
    }
  }
}

console.log(`Checked ${totalChecked} pixels. Differences: ${diffCount}`);
