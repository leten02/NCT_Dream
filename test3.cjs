const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { margin: 0; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: url('background.png');
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div class="bg"></div>
  <div class="absolute inset-0 w-full h-full overflow-hidden flex justify-center items-end pointer-events-none">
    <div class="relative min-w-full min-h-full aspect-[6000/3348] flex-shrink-0 border-4 border-red-500">
      <div class="absolute border-4 border-blue-500" style="left: 28.2%; top: 31.959%; width: 43.733%; height: 48.745%;"></div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('public/test3.html', html);
