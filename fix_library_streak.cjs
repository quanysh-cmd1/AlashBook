const fs = require('fs');
let content = fs.readFileSync('src/pages/Library.tsx', 'utf8');

content = content.replace(
  /import \{ Search, X \} from 'lucide-react';/,
  `import { Search, X, Flame } from 'lucide-react';\nimport { motion } from 'motion/react';`
);

content = content.replace(
  /const \{ books \} = useAppContext\(\);/,
  `const { books, currentUser, readingDays } = useAppContext();
  
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

content = content.replace(
  /<div className="pb-20 bg-white min-h-screen">\s*\{\/\* Search Bar \*\/\}/,
  `<div className="pb-20 bg-white min-h-screen">
      {/* Header with Streak */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Сәлем, {currentUser ? (currentUser.name || 'Оқырман') : 'Оқырман'} 👋
          </h1>
          {currentUser?.telegramUsername && (
            <p className="text-sm font-medium text-blue-600/80 mt-0.5">
              {currentUser.telegramUsername}
            </p>
          )}
        </div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center relative group"
        >
          <motion.div 
            animate={streakCount > 0 ? { 
              y: [0, -3, 0],
              scale: [1, 1.05, 1],
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-orange-100/80 rounded-2xl px-3 py-2 shadow-sm border border-orange-200 flex items-center gap-2"
          >
            <Flame size={22} className={streakCount > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
            <span className={streakCount > 0 ? "text-orange-600 font-bold" : "text-gray-500 font-medium"}>
              {streakCount} {streakCount > 0 ? 'күн' : ''}
            </span>
          </motion.div>
          {streakCount === 0 && (
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-gray-400 absolute -bottom-4 whitespace-nowrap">
              Стрейк жоқ
            </span>
          )}
        </motion.div>
      </div>
      
      {/* Search Bar */}`
);

fs.writeFileSync('src/pages/Library.tsx', content);
