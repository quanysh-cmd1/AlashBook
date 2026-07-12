const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/html, body \{\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-weight: 500;/g, 'html, body {');
css = css.replace(/body \{\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-weight: 500;/g, 'body {');

// Just add it to body once
css = css.replace(/body \{/, 'body {\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-weight: 500;');

fs.writeFileSync('src/index.css', css);
