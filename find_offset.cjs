const fs = require('fs');
const { PNG } = require('pngjs');

const bgBuf = fs.readFileSync('public/background.png');
const stageBuf = fs.readFileSync('public/stage.png');

const bg = PNG.sync.read(bgBuf);
const stage = PNG.sync.read(stageBuf);

console.log(`bg: ${bg.width}x${bg.height}`);
console.log(`stage: ${stage.width}x${stage.height}`);

// We want to find the best (x, y) offset for stage in bg.
// Since it's huge, let's just sample a few distinct non-transparent pixels from stage.
const samples = [];
for (let y = 0; y < stage.height; y += 50) {
  for (let x = 0; x < stage.width; x += 50) {
    const idx = (stage.width * y + x) << 2;
    if (stage.data[idx + 3] > 200) { // opaque
      samples.push({
        x, y,
        r: stage.data[idx],
        g: stage.data[idx + 1],
        b: stage.data[idx + 2]
      });
    }
  }
}

console.log(`Got ${samples.length} samples`);

let bestOffset = null;
let minDiff = Infinity;

// We expect the stage to be somewhere in the bottom half.
// Let's search x from 0 to bg.width - stage.width
// y from 0 to bg.height - stage.height
for (let offsetY = 0; offsetY <= bg.height - stage.height; offsetY += 2) {
  for (let offsetX = 0; offsetX <= bg.width - stage.width; offsetX += 2) {
    let diff = 0;
    for (const s of samples) {
      const bgX = offsetX + s.x;
      const bgY = offsetY + s.y;
      const bgIdx = (bg.width * bgY + bgX) << 2;
      
      diff += Math.abs(s.r - bg.data[bgIdx]) +
              Math.abs(s.g - bg.data[bgIdx + 1]) +
              Math.abs(s.b - bg.data[bgIdx + 2]);
              
      if (diff > minDiff) break; // early exit
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      bestOffset = { x: offsetX, y: offsetY };
      console.log(`New best: ${offsetX}, ${offsetY} with diff ${diff}`);
    }
  }
}

console.log(`Best offset:`, bestOffset);
