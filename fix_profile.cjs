const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const streakLogic = `  const { currentUser, logout, readingDays, books } = useAppContext();
  
  const getStreak = () => {
    if (!readingDays || readingDays.length === 0) return 0;
    
    const sortedDays = [...readingDays].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const latestDay = new Date(sortedDays[0]);
    latestDay.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - latestDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return 0;
    }
    
    streak = 1;
    let prevDate = new Date(sortedDays[0]);
    prevDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedDays.length; i++) {
      const d = new Date(sortedDays[i]);
      d.setHours(0, 0, 0, 0);
      
      const diff = prevDate.getTime() - d.getTime();
      const diffD = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (diffD === 1) {
        streak++;
        prevDate = d;
      } else if (diffD === 0) {
      } else {
        break;
      }
    }
    return streak;
  };

  const streakCount = getStreak();
`;

content = content.replace(/const \{ currentUser, logout, readingDays, books \} = useAppContext\(\);/, streakLogic);

// Add Flame icon import if needed
if (!content.includes('Flame')) {
  content = content.replace(/import \{ BookOpen, Clock, Settings, Heart, Bookmark, Award, ChevronRight \} from 'lucide-react';/, "import { BookOpen, Clock, Settings, Heart, Bookmark, Award, ChevronRight, Flame } from 'lucide-react';");
}

const userBadgeOld = `            <div className="flex items-center gap-2">
              <div className="bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold text-blue-600 tracking-wide uppercase">Бастаушы</div>
              <p className="text-sm font-medium text-blue-600/80">{currentUser.telegramUsername || currentUser.email}</p>
            </div>`;

const userBadgeNew = `            <div className="flex items-center gap-2">
              <div className="bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold text-blue-600 tracking-wide uppercase">Бастаушы</div>
              <div className="bg-orange-50 px-2 py-0.5 rounded text-xs font-semibold text-orange-600 tracking-wide flex items-center gap-1 border border-orange-100">
                <Flame size={12} className={streakCount > 0 ? "fill-orange-500 text-orange-500" : "text-orange-400"} />
                {streakCount} {streakCount > 0 ? 'күн стрейк' : 'күн'}
              </div>
            </div>
            <p className="text-sm font-medium text-blue-600/80 mt-1">{currentUser.telegramUsername || currentUser.email}</p>`;

content = content.replace(userBadgeOld, userBadgeNew);

fs.writeFileSync('src/pages/Profile.tsx', content);
