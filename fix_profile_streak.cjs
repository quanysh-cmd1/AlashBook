const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Remove streak calculation
content = content.replace(
  /const getStreak = \(\) => \{[\s\S]*?return streak;\n  \};\n  \n  const streakCount = getStreak\(\);\n  /,
  ""
);

// Remove streak from UI
content = content.replace(
  /<motion\.div \n                initial=\{\{ scale: 0\.8, opacity: 0 \}\}\n                animate=\{\{ scale: 1, opacity: 1 \}\}\n                transition=\{\{ type: "spring", bounce: 0\.6 \}\}\n                className="flex flex-col items-center justify-center"\n              >[\s\S]*?<\/motion\.div>/,
  ""
);

// Remove Flame from lucide-react and motion/react
content = content.replace(
  /import \{ User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight, Flame \} from 'lucide-react';\nimport \{ motion \} from 'motion\/react';/,
  `import { User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight } from 'lucide-react';`
);

fs.writeFileSync('src/pages/Profile.tsx', content);
