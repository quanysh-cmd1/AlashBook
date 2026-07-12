const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf-8');

content = content.replace(
  "const { currentUser, logout, books } = useAppContext();",
  "const { currentUser, logout, books, readingDays } = useAppContext();"
);

content = content.replace(
  /<div className=\{\`flex items-center gap-4 border p-4 rounded-xl shadow-sm \${stats.minutesRead > 60 \? 'bg-white border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-60'}\`\}>[\s\S]*?<\/p>\n                  <\/div>\n                <\/div>/m,
  `<div className={\`flex items-center gap-4 border p-4 rounded-xl shadow-sm \${(readingDays?.length || 0) >= 7 ? 'bg-white border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-60'}\`}>
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 \${(readingDays?.length || 0) >= 7 ? 'bg-orange-50' : 'bg-gray-200'}\`}>
                    <span className="text-2xl">{(readingDays?.length || 0) >= 7 ? '🔥' : '🔒'}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Аптаның үздік оқырманы</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Қатарынан 7 күн оқыған</p>
                  </div>
                </div>`
);

fs.writeFileSync('src/pages/Profile.tsx', content);
