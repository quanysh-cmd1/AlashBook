const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf-8');

// 1. Remove the incorrectly placed audio and timer modal from renderBionic
content = content.replace(
  /return \(\s*<>\s*<audio[\s\S]*?ЖАЛҒАСТЫРУ\n            <\/button>\n          <\/div>\n        <\/div>\n      \)\}\s*<span key=\{i\} className="bionic-word">/m,
  'return (\n        <span key={i} className="bionic-word">'
);

// 2. Find the start of the Reader component's return
// It looks like `return (\n    <div className={clsx(` or similar. Let's just do a specific replace.
// Wait, the regular Reader return starts with `return (\n    <div className={clsx(\n      "h-full w-full flex flex-col relative transition-colors duration-300",`
content = content.replace(
  /return \(\s*<div className=\{clsx\(\s*"h-full w-full flex flex-col relative transition-colors duration-300",/m,
  `return (
    <>
      <audio 
        ref={audioRef} 
        src="https://actions.google.com/sounds/v1/water/rain_on_roof.ogg" 
        loop 
      />
      {timerEnded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="text-6xl mb-4 animate-bounce">
              ⏰
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Таймер бітті!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Сіз жоспарлаған оқу уақытыңызды сәтті аяқтадыңыз. Жарайсыз!</p>
            <button 
              onClick={() => setTimerEnded(false)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold tracking-wide hover:bg-blue-700 transition-colors"
            >
              ЖАЛҒАСТЫРУ
            </button>
          </div>
        </div>
      )}
    <div className={clsx(
      "h-full w-full flex flex-col relative transition-colors duration-300",`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
