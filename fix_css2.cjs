const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/html, body \{\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-weight: 500;/g, 'html, body {');

fs.writeFileSync('src/index.css', css);
