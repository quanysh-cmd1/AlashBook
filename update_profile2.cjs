const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf-8');

content = content.replace(
  /<button className="p-2 text-gray-400 hover:text-gray-900 rounded-full bg-gray-50">\n          <Settings size=\{20\} \/>\n        <\/button>/g,
  ""
);

fs.writeFileSync('src/pages/Profile.tsx', content);
