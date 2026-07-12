const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
content = content.replace(
  /import \{ Settings, LogOut, Search, Library as LibraryIcon, UserCircle \} from 'lucide-react';/,
  "import { Settings, LogOut, Search, Library as LibraryIcon, UserCircle, X } from 'lucide-react';\nimport { useState, useEffect } from 'react';"
);

// Add Logo component
const logoComponent = `
const Logo = ({ className = '' }: { className?: string }) => (
  <div className={\`flex items-baseline font-serif tracking-[0.15em] \${className}\`} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span className="mr-0.5">L</span>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span>SH</span>
    <span className="font-sans text-[1.2em] ml-0.5 -mt-1 font-bold">.</span>
  </div>
);

const InstallPrompt = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if dismissed before
    const dismissed = localStorage.getItem('galam_install_dismissed');
    
    if (!isStandalone && isMobile && !dismissed) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('galam_install_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-top-4 duration-500 fade-in">
      <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-gray-800">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
          <Logo className="text-gray-900 text-xs" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">ALASH. орнату</h3>
          <p className="text-xs text-gray-300 mt-0.5 leading-tight">Қолданба жақсы жұмыс жасауы үшін негізгі экранға қосып алыңыз</p>
        </div>
        <button 
          onClick={dismiss}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
`;

content = content.replace(/function Layout\(\{ children \}: \{ children: React\.ReactNode \}\) \{/, logoComponent + '\nfunction Layout({ children }: { children: React.ReactNode }) {');

// Replace text ALASH. with Logo component
content = content.replace(
  /<Link to="\/" className="text-2xl font-bold tracking-tight text-gray-900">\s*ALASH\.\s*<\/Link>/,
  `<Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
            <Logo className="text-2xl" />
          </Link>`
);

// Add InstallPrompt in the Layout (inside the main wrapper, before header)
content = content.replace(
  /<div className="h-full w-full bg-gray-50 flex flex-col font-sans relative overflow-hidden">/,
  `<div className="h-full w-full bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      {!isReader && <InstallPrompt />}`
);

fs.writeFileSync('src/App.tsx', content);
