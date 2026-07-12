const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add imports
content = content.replace(
  "import { Auth } from './pages/Auth';",
  "import { Auth } from './pages/Auth';\nimport { Author } from './pages/Author';\nimport { Profile } from './pages/Profile';"
);

content = content.replace(
  "import { Settings, LogOut, Search, Library as LibraryIcon } from 'lucide-react';",
  "import { Settings, LogOut, Search, Library as LibraryIcon, UserCircle } from 'lucide-react';"
);

// Add routes
content = content.replace(
  '<Route path="/admin" element={<Admin />} />',
  '<Route path="/admin" element={<Admin />} />\n            <Route path="/author/:name" element={<Author />} />\n            <Route path="/profile" element={<Profile />} />'
);

// Add Profile to bottom nav
content = content.replace(
  /<nav className="bg-white\/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-safe flex justify-around items-center z-50 shrink-0">[\s\S]*?<\/nav>/m,
  `<nav className="bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-safe flex justify-around items-center z-50 shrink-0">
          <Link to="/" className={\`flex flex-col items-center gap-1 \${location.pathname === '/' || location.pathname === '/catalog' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}\`}>
            <Search size={22} />
            <span className="text-[10px] font-medium">Іздеу</span>
          </Link>
          <Link to="/shelf" className={\`flex flex-col items-center gap-1 \${location.pathname === '/shelf' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}\`}>
            <LibraryIcon size={22} />
            <span className="text-[10px] font-medium">Сөрем</span>
          </Link>
          <Link to="/profile" className={\`flex flex-col items-center gap-1 \${location.pathname === '/profile' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}\`}>
            <UserCircle size={22} />
            <span className="text-[10px] font-medium">Профиль</span>
          </Link>
        </nav>`
);

// We need to move the settings/logout buttons to Profile maybe?
// The user might still want to see the top bar for navigation. 
// I'll remove settings/logout from the top bar so it looks cleaner, since profile will have logout and settings.
// Or I'll just leave them for now, it's fine.

fs.writeFileSync('src/App.tsx', content);
