const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// 1. Add streak logic
const streakLogic = `  const { currentUser, logout, books, readingDays } = useAppContext();
  
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

content = content.replace(/  const \{ currentUser, logout, books, readingDays \} = useAppContext\(\);/, streakLogic);

// Add Flame and Shield import
if (!content.includes('Flame')) {
  content = content.replace(/import \{ User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight \} from 'lucide-react';/, "import { User, Settings, Heart, Bookmark, Award, Clock, BookOpen, ChevronRight, Flame, Shield } from 'lucide-react';");
}

// 2. Add streak badge
const userBadgeOld = `                <p className="text-sm font-medium text-blue-600/80">{currentUser.telegramUsername || currentUser.email}</p>
              </div>                              
            </div>
          </div>
        </div>`;

const userBadgeNew = `                <p className="text-sm font-medium text-blue-600/80">{currentUser.telegramUsername || currentUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-blue-50 px-2 py-0.5 rounded text-[10px] font-semibold text-blue-600 tracking-wide uppercase">Бастаушы</div>
                  <div className="bg-orange-50 px-2 py-0.5 rounded text-[10px] font-semibold text-orange-600 tracking-wide flex items-center gap-1 border border-orange-100">
                    <Flame size={10} className={streakCount > 0 ? "fill-orange-500 text-orange-500" : "text-orange-400"} />
                    {streakCount} {streakCount > 0 ? 'күн стрейк' : 'күн'}
                  </div>
                </div>
              </div>                              
            </div>
          </div>
        </div>`;
content = content.replace(userBadgeOld, userBadgeNew);

// 3. Add Admin tab state
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\<'stats' \| 'favorites' \| 'readLater'\>\('stats'\);/,
  "const [activeTab, setActiveTab] = useState<'stats' | 'favorites' | 'readLater' | 'admin'>('stats');"
);

// 4. Add Admin tab button
const tabsHtml = `        <div className="flex bg-gray-100/50 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setActiveTab('stats')}
            className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-colors \${activeTab === 'stats' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Статистика
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-colors \${activeTab === 'favorites' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Сүйікті
          </button>
          <button 
            onClick={() => setActiveTab('readLater')}
            className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-colors \${activeTab === 'readLater' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Кейін
          </button>`;

const tabsHtmlNew = `        <div className="flex bg-gray-100/50 p-1 rounded-xl mb-6 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('stats')}
            className={\`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap \${activeTab === 'stats' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Статистика
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={\`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap \${activeTab === 'favorites' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Сүйікті
          </button>
          <button 
            onClick={() => setActiveTab('readLater')}
            className={\`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap \${activeTab === 'readLater' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
          >
            Кейін
          </button>
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={\`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap \${activeTab === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}\`}
            >
              <Shield size={14} className={activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'} />
              Әкімші
            </button>
          )}`;

content = content.replace(tabsHtml, tabsHtmlNew);

// 5. Add Admin tab content (Redirect or Component link)
// The user asked to move the Admin section to Profile. The existing admin page is at /admin.
// We can just show a link to the admin panel or better, render the Admin component.
// Wait, Admin component is a full page. Render it might be tricky due to padding. 
// We can just put a link or render the admin page inside.
// Actually, rendering Admin inside is fine.

const adminTabContent = `
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <Shield size={32} className="mx-auto text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Әкімші панелі</h3>
              <p className="text-sm text-gray-600 mb-4">Жүйеге кітап қосу және қолданушыларды басқару</p>
              <Link to="/admin" className="inline-flex items-center justify-center bg-blue-600 text-white font-medium rounded-xl px-6 py-2.5 shadow-sm hover:bg-blue-700 transition-colors w-full">
                Әкімші панеліне өту
              </Link>
            </div>
            
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Шығу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/      <\/div>\n    <\/div>\n  \);\n\}/, adminTabContent);

// Add "Шығу" button to stats tab just in case, but let's keep it simple.
// Wait, if not admin, where is logout? I will add it to the bottom of all tabs except admin or just a universal setting icon.
const logoutButton = `
            {/* Logout button at the end of stats */}
            <button onClick={logout} className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors">
              Шығу
            </button>
          </div>
        )}
        {activeTab === 'favorites' && (`;

content = content.replace(/          <\/div>\n        \)}\n        \{activeTab === 'favorites' && \(/, logoutButton);

fs.writeFileSync('src/pages/Profile.tsx', content);

// Also remove admin link from App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<div className="flex items-center gap-4">\s*\{currentUser\.role === 'admin' && \(\s*<Link to="\/admin" className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1\.5 rounded-full">\s*Админ панелі\s*<\/Link>\s*\)\}\s*<\/div>/,
  '<div className="flex items-center gap-4"></div>'
);
fs.writeFileSync('src/App.tsx', appContent);

