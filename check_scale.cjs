const fs = require('fs');
const { PNG } = require('pngjs');

const bgBuf = fs.readFileSync('public/background.png');
const stageBuf = fs.readFileSync('public/stage.png');

const bg = PNG.sync.read(bgBuf);
const stage = PNG.sync.read(stageBuf);

let diffCount = 0;
let totalChecked = 0;

const scale = 1.5;
const offsetX = 1029;
const offsetY = 393;

for (let y = 0; y < stage.height; y+=10) {
  for (let x = 0; x < stage.width; x+=10) {
    const stageIdx = (stage.width * y + x) << 2;
    
    // Scale coordinates
    const bgX = offsetX + Math.floor(x * scale);
    const bgY = offsetY + Math.floor(y * scale);
    const bgIdx = (bg.width * bgY + bgX) << 2;
    
    if (stage.data[stageIdx + 3] > 0) {
      totalChecked++;
      if (
        Math.abs(stage.data[stageIdx] - bg.data[bgIdx]) > 15 ||
        Math.abs(stage.data[stageIdx + 1] - bg.data[bgIdx + 1]) > 15 ||
        Math.abs(stage.data[stageIdx + 2] - bg.data[bgIdx + 2]) > 15
      ) {
        diffCount++;
      }
    }
  }
}

console.log(`Checked ${totalChecked} pixels. Differences: ${diffCount}`);
