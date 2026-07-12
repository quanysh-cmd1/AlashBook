const fs = require('fs');
let content = fs.readFileSync('src/pages/MyShelf.tsx', 'utf8');

// 1. Add Flame icon and readingDays
content = content.replace(
  /import \{ ChevronLeft, ChevronRight \} from 'lucide-react';/,
  `import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';`
);

content = content.replace(
  /const \{ books \} = useAppContext\(\);/,
  `const { books, readingDays } = useAppContext();
  
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

// 2. Add streak to UI
content = content.replace(
  /className="pt-16 pb-10 text-center"\s*>/,
  `className="pt-16 pb-10 text-center relative"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
          className="absolute top-6 right-6 flex flex-col items-center justify-center"
        >
          <motion.div 
            animate={streakCount > 0 ? { 
              y: [0, -4, 0],
              scale: [1, 1.1, 1],
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-orange-100/80 rounded-full p-3 shadow-inner border border-orange-200"
          >
            <Flame size={28} className={streakCount > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
          </motion.div>
          <span className="text-[12px] font-black uppercase tracking-wider mt-2 text-gray-800">
            {streakCount > 0 ? \`\${streakCount} күн\` : 'Стрейк'}
          </span>
        </motion.div>`
);

fs.writeFileSync('src/pages/MyShelf.tsx', content);
