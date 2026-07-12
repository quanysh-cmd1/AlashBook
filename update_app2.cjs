const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /<button \n              onClick=\{logout\}\n              title="Шығу"\n              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"\n            >\n              <LogOut size=\{16\} \/>\n            <\/button>/g,
  ""
);

fs.writeFileSync('src/App.tsx', content);
