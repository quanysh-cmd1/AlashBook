const fs = require('fs');
let content = fs.readFileSync('src/pages/MyShelf.tsx', 'utf8');

// Remove streak calculation
content = content.replace(
  /const getStreak = \(\) => \{[\s\S]*?return streak;\n  \};\n  \n  const streakCount = getStreak\(\);\n  /,
  ""
);

// Remove streak from UI
content = content.replace(
  /<motion\.div \n          initial=\{\{ scale: 0\.8, opacity: 0 \}\}\n          animate=\{\{ scale: 1, opacity: 1 \}\}\n          transition=\{\{ type: "spring", bounce: 0\.6, delay: 0\.2 \}\}\n          className="absolute top-6 right-6 flex flex-col items-center justify-center"\n        >[\s\S]*?<\/motion\.div>/,
  ""
);

// Remove Flame import
content = content.replace(
  /import \{ ChevronLeft, ChevronRight, Flame \} from 'lucide-react';/,
  `import { ChevronLeft, ChevronRight } from 'lucide-react';`
);

// Fix hook usage
content = content.replace(
  /const \{ books, readingDays \} = useAppContext\(\);/,
  `const { books } = useAppContext();`
);

fs.writeFileSync('src/pages/MyShelf.tsx', content);
