const fs = require('fs');
let content = fs.readFileSync('src/pages/Library.tsx', 'utf8');

content = content.replace(
  /import \{ useState, useMemo \} from 'react';/,
  "import { useState, useMemo, useEffect } from 'react';"
);

content = content.replace(
  /import \{ motion \} from 'motion\/react';/,
  "import { motion, AnimatePresence } from 'motion/react';"
);

content = content.replace(
  /const \{ books, currentUser, readingDays \} = useAppContext\(\);/,
  `const { books, currentUser, readingDays } = useAppContext();
  
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);`
);

content = content.replace(
  /<div>\s*<h1 className="text-\[28px\] font-sans font-medium text-gray-900 leading-tight pb-1 flex items-center gap-2">\s*Сәлем, \{currentUser \? \(currentUser\.name \|\| 'Оқырман'\) : 'Оқырман'\} <span>👋<\/span>\s*<\/h1>\s*\{currentUser\?\.telegramUsername && \(\s*<p className="text-sm font-medium text-blue-600\/80 mt-0\.5">\s*\{currentUser\.telegramUsername\}\s*<\/p>\s*\)\}\s*<\/div>/,
  `<AnimatePresence>
          {showGreeting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0 }}
              className="mr-4"
            >
              <h1 className="text-[28px] font-sans font-medium text-gray-900 leading-tight pb-1 flex items-center gap-2">
                Сәлем, {currentUser ? (currentUser.name || 'Оқырман') : 'Оқырман'} <span>👋</span>
              </h1>
              {currentUser?.telegramUsername && (
                <p className="text-sm font-medium text-blue-600/80 mt-0.5">
                  {currentUser.telegramUsername}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>`
);

fs.writeFileSync('src/pages/Library.tsx', content);
