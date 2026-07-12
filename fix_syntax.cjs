const fs = require('fs');
let myShelf = fs.readFileSync('src/pages/MyShelf.tsx', 'utf8');

myShelf = myShelf.replace(
  /<span className="text-\[12px\] font-black uppercase tracking-wider mt-2 text-gray-800">\s*\{streakCount > 0 \? `\$\{streakCount\} күн` : 'Стрейк'\}\s*<\/span>\s*<\/motion\.div>/,
  ""
);
myShelf = myShelf.replace(
  /className="pt-16 pb-10 text-center relative"/,
  'className="pt-16 pb-10 text-center"'
);

fs.writeFileSync('src/pages/MyShelf.tsx', myShelf);

let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
profile = profile.replace(
  /<span className="text-\[11px\] font-black uppercase tracking-wider mt-1\.5 text-gray-800">\s*\{streakCount > 0 \? `\$\{streakCount\} күн` : 'Стрейк'\}\s*<\/span>\s*<\/motion\.div>\s*<\/div>/,
  "</div>"
);
fs.writeFileSync('src/pages/Profile.tsx', profile);

