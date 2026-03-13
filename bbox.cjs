const fs = require('fs');
const { PNG } = require('pngjs');

const stageBuf = fs.readFileSync('public/stage.png');
const stage = PNG.sync.read(stageBuf);

let minX = stage.width, maxX = 0, minY = stage.height, maxY = 0;

for (let y = 0; y < stage.height; y++) {
  for (let x = 0; x < stage.width; x++) {
    const idx = (stage.width * y + x) << 2;
    if (stage.data[idx + 3] > 0) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Stage bounding box: X: ${minX}-${maxX}, Y: ${minY}-${maxY}`);
console.log(`Width: ${maxX - minX + 1}, Height: ${maxY - minY + 1}`);
