const fs = require('fs');
let content = fs.readFileSync('src/store.tsx', 'utf-8');

content = content.replace(
  /      logout,\n      getAllUsers,/g,
  "      logout,\n      toggleFavorite,\n      toggleReadLater,\n      updateReadingStats,\n      getAllUsers,"
);

fs.writeFileSync('src/store.tsx', content);
