const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const linkStr = '<link rel="manifest" href="/manifest.json">';
const newLinkStr = '<link rel="icon" type="image/png" href="/logo.png">\n    <link rel="manifest" href="/manifest.json">';

if(!html.includes('logo.png')) {
    html = html.replace(linkStr, newLinkStr);
    fs.writeFileSync('index.html', html);
    console.log("Updated index.html");
}
