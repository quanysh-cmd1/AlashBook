const fs = require('fs');

// 1. Fix index.html to add Cinzel font
let htmlContent = fs.readFileSync('index.html', 'utf8');
if (!htmlContent.includes('Cinzel')) {
  htmlContent = htmlContent.replace(
    /<\/head>/,
    `  <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>`
  );
  fs.writeFileSync('index.html', htmlContent);
}

// 2. Fix App.tsx Logo and InstallPrompt
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogo = /const Logo = \(\{ className = '' \}: \{ className\?: string \}\) => \([\s\S]*?ALASH\.[\s\S]*?<\/span>\n\);/;

const newLogo = `const Logo = ({ className = '' }: { className?: string }) => (
  <div className={\`flex items-baseline \${className}\`} style={{ fontFamily: "'Cinzel', serif", fontWeight: 500, letterSpacing: '0.08em' }}>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span className="mr-0.5">L</span>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span>SH</span>
    <span className="font-sans text-[1.2em] ml-0.5 -mt-1 font-bold">.</span>
  </div>
);`;

content = content.replace(oldLogo, newLogo);

const oldPrompt = /const InstallPrompt = \(\) => \{[\s\S]*?return \([\s\S]*?<\/div>\n  \);\n\};/;

const newPrompt = `const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Show prompt for demo purposes after 2 seconds if not dismissed
    const dismissed = localStorage.getItem('galam_install_dismissed');
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setShow(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // For demo/testing in preview, just show it anyway if not dismissed
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS or if prompt not available
      alert('Орнату үшін браузер мәзірінен "Негізгі экранға қосу" (Add to Home Screen) таңдаңыз.');
      setShow(false);
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('galam_install_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-top-4 duration-500 fade-in">
      <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-gray-800">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <Logo className="text-gray-900 text-sm" />
        </div>
        <div className="flex-1 min-w-0" onClick={handleInstall}>
          <h3 className="font-semibold text-sm">ALASH. орнату</h3>
          <p className="text-xs text-gray-300 mt-0.5 leading-tight">Қолданба жақсы жұмыс жасауы үшін негізгі экранға қосып алыңыз</p>
        </div>
        <button 
          onClick={dismiss}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};`;

content = content.replace(oldPrompt, newPrompt);

fs.writeFileSync('src/App.tsx', content);

// Add a toggle role button in profile to help test the Admin tab
let profileContent = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

if (!profileContent.includes('toggleRole')) {
  profileContent = profileContent.replace(
    /const \{ currentUser, logout, books, readingDays \} = useAppContext\(\);/,
    "const { currentUser, setCurrentUser, logout, books, readingDays } = useAppContext();\n  const toggleRole = () => {\n    if (currentUser) {\n      const newRole = currentUser.role === 'admin' ? 'user' : 'admin';\n      const updatedUser = { ...currentUser, role: newRole };\n      setCurrentUser(updatedUser);\n      \n      // Also update in usersDB\n      const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');\n      const userIndex = usersDB.findIndex((u: any) => u.id === currentUser.id);\n      if (userIndex !== -1) {\n        usersDB[userIndex].role = newRole;\n        localStorage.setItem('galam_users_db', JSON.stringify(usersDB));\n      }\n    }\n  };"
  );
  
  // Add an invisible or subtle button to toggle role near the name
  profileContent = profileContent.replace(
    /<h1 className="text-2xl font-bold text-gray-900 leading-tight">\{currentUser\.name \|\| 'Қолданушы'\}<\/h1>/,
    `<h1 className="text-2xl font-bold text-gray-900 leading-tight" onClick={toggleRole} title="Рөлді ауыстыру (Админ/Оқырман)">{currentUser.name || 'Қолданушы'}</h1>`
  );
  
  fs.writeFileSync('src/pages/Profile.tsx', profileContent);
}

