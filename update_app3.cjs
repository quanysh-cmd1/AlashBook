const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /<button \n              onClick=\{toggleRole\}\n              title="Рөлді ауыстыру"\n              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"\n            >\n              <Settings size=\{18\} className="text-gray-600" \/>\n            <\/button>/g,
  ""
);

fs.writeFileSync('src/App.tsx', content);
