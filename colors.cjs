const fs = require('fs');
const { PNG } = require('pngjs');

const stageBuf = fs.readFileSync('public/stage.png');
const stage = PNG.sync.read(stageBuf);

const colors = {};
for (let y = 951; y <= 1351; y+=10) {
  for (let x = 821; x <= 1797; x+=10) {
    const idx = (stage.width * y + x) << 2;
    if (stage.data[idx + 3] > 200) {
      const r = stage.data[idx];
      const g = stage.data[idx + 1];
      const b = stage.data[idx + 2];
      const hex = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colors[hex] = (colors[hex] || 0) + 1;
    }
  }
}

const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]);
console.log(sorted.slice(0, 10));
