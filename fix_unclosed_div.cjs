const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf-8');

content = content.replace(
  /<Settings2 size=\{24\} \/>\n\s*<\/button>/,
  '<Settings2 size={24} />\n            </button>\n          </div>'
);

fs.writeFileSync('src/pages/Reader.tsx', content);
