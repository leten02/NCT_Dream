const fs = require('fs');
const { PNG } = require('pngjs');

const bgBuf = fs.readFileSync('public/background.png');
const bg = PNG.sync.read(bgBuf);

let minX = bg.width, maxX = 0, minY = bg.height, maxY = 0;

for (let y = 0; y < bg.height; y+=5) {
  for (let x = 0; x < bg.width; x+=5) {
    const idx = (bg.width * y + x) << 2;
    const r = bg.data[idx];
    const g = bg.data[idx + 1];
    const b = bg.data[idx + 2];
    
    // Stage colors are mostly light cyan/blue: e.g. 191, 240, 244 (bff0f4)
    // Let's check if the color is close to this
    if (Math.abs(r - 191) < 30 && Math.abs(g - 240) < 30 && Math.abs(b - 244) < 30) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Stage bounding box in bg: X: ${minX}-${maxX}, Y: ${minY}-${maxY}`);
console.log(`Width: ${maxX - minX + 1}, Height: ${maxY - minY + 1}`);
