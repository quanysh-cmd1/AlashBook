const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/body \{\n  display: flex;/g, 'body {\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-weight: 500;\n  display: flex;');

fs.writeFileSync('src/index.css', css);
