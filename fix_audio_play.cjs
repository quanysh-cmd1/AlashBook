const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

content = content.replace(
  /audioRef\.current\.play\(\);/,
  `audioRef.current.play().catch(e => console.error("Audio play failed:", e));`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
