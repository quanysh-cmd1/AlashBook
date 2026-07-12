const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// 1. Import Flame and motion
content = content.replace(
  /import { User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight } from 'lucide-react';/,
  `import { User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight, Flame } from 'lucide-react';\nimport { motion } from 'motion/react';`
);

// 2. Add streak calculation logic
content = content.replace(
  /const stats = currentUser\.readingStats \|\| \{ booksRead: 0, minutesRead: 0 \};/,
  `const stats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };
  
  const getStreak = () => {
    if (!readingDays || readingDays.length === 0) return 0;
    
    // Sort descending
    const sortedDays = [...readingDays].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // today
    
    // Check if the latest read day is today or yesterday
    const latestDay = new Date(sortedDays[0]);
    latestDay.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - latestDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return 0; // Streak broken
    }
    
    let checkDate = latestDay;
    for (const dayStr of sortedDays) {
      const d = new Date(dayStr);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  
  const streakCount = getStreak();`
);

// 3. Render streak in the Header
content = content.replace(
  /<div className="flex items-center gap-4">\s*<div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">\s*\{\(currentUser\.name \|\| 'Қ'\)\.charAt\(0\)\.toUpperCase\(\)\}\s*<\/div>\s*<div>\s*<h1 className="text-xl font-bold text-gray-900">\{currentUser\.name \|\| 'Қолданушы'\}<\/h1>\s*<p className="text-sm text-gray-500">\{currentUser\.telegramUsername \|\| currentUser\.email \|\| 'Қолданушы'\}<\/p>\s*<\/div>\s*<\/div>/,
  `<div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {(currentUser.name || 'Қ').charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between w-full pr-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{currentUser.name || 'Қолданушы'}</h1>
                <p className="text-sm font-medium text-blue-600/80">{currentUser.telegramUsername || currentUser.email}</p>
              </div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div 
                  animate={streakCount > 0 ? { 
                    y: [0, -4, 0],
                    scale: [1, 1.1, 1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-orange-100/80 rounded-full p-2.5 shadow-inner border border-orange-200"
                >
                  <Flame size={26} className={streakCount > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
                </motion.div>
                <span className="text-[11px] font-black uppercase tracking-wider mt-1.5 text-gray-800">
                  {streakCount > 0 ? \`\${streakCount} күн\` : 'Стрейк'}
                </span>
              </motion.div>
            </div>
          </div>
        </div>`
);

fs.writeFileSync('src/pages/Profile.tsx', content);
