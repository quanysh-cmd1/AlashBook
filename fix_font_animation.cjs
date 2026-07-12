const fs = require('fs');
let content = fs.readFileSync('src/pages/Library.tsx', 'utf8');

// Change font of the greeting
content = content.replace(
  /<h1 className="text-2xl font-bold text-gray-900 leading-tight">\s*Сәлем, \{currentUser \? \(currentUser\.name \|\| 'Оқырман'\) : 'Оқырман'\} 👋\s*<\/h1>/,
  `<h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
            Сәлем, {currentUser ? (currentUser.name || 'Оқырман') : 'Оқырман'} 👋
          </h1>`
);

// Remove the continuous animation of the streak
content = content.replace(
  /animate=\{streakCount > 0 \? \{\s*y: \[0, -3, 0\],\s*scale: \[1, 1\.05, 1\],\s*filter: \["brightness\(1\)", "brightness\(1\.1\)", "brightness\(1\)"\]\s*\} : \{\}\}\s*transition=\{\{ duration: 1\.5, repeat: Infinity, ease: "easeInOut" \}\}/,
  ``
);

fs.writeFileSync('src/pages/Library.tsx', content);
