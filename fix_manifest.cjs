const fs = require('fs');
let manifest = fs.readFileSync('public/manifest.json', 'utf8');

manifest = manifest.replace(/"src": "\/icon-192.png"/g, '"src": "/logo.png"');
manifest = manifest.replace(/"src": "\/icon-512.png"/g, '"src": "/logo.png"');

fs.writeFileSync('public/manifest.json', manifest);
console.log("Updated manifest.json");
