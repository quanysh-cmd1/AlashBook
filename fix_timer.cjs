const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

// Insert Timer button and Music button
content = content.replace(
  /<button onClick=\{cycleTheme\}/,
  `<button onClick={() => setShowTimerSettings(true)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Timer size={14} className="opacity-90" />
            </button>
            <button onClick={toggleMusic} className={clsx("w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors", isMusicPlaying && "bg-white/20 text-blue-400 border-blue-400/30")}>
              {isMusicPlaying ? <Pause size={14} className="opacity-90" /> : <Music size={14} className="opacity-90" />}
            </button>
            <button onClick={cycleTheme}`
);

// Insert Timer Settings Modal
content = content.replace(
  /\{\/\* Backdrop for settings \*\/\}/,
  `{/* Timer Settings */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50",
          showTimerSettings ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-widest uppercase">Фокус таймері</h3>
            <button onClick={() => setShowTimerSettings(false)} className="text-gray-400 p-2 -mr-2">✕</button>
          </div>
          
          <div className="flex gap-3 mb-6">
            <button onClick={() => startTimer(15)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center hover:border-blue-500 hover:text-blue-500 transition-colors">
              <span className="text-2xl font-bold mb-1">15</span>
              <span className="text-xs uppercase tracking-wider text-gray-500">мин</span>
            </button>
            <button onClick={() => startTimer(30)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center hover:border-blue-500 hover:text-blue-500 transition-colors">
              <span className="text-2xl font-bold mb-1">30</span>
              <span className="text-xs uppercase tracking-wider text-gray-500">мин</span>
            </button>
            <button onClick={() => startTimer(60)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <span className="text-2xl font-bold mb-1">1</span>
              <span className="text-xs uppercase tracking-wider opacity-70">сағат</span>
            </button>
          </div>
          
          {timerRemaining !== null && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
              <p className="text-sm text-gray-500 mb-1">Қалған уақыт:</p>
              <p className="text-3xl font-mono font-bold text-blue-600">{formatTime(timerRemaining)}</p>
              <button onClick={cancelTimer} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600">Болдырмау</button>
            </div>
          )}
        </div>
      </div>

      {/* Timer Ended Modal */}
      {timerEnded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
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

      {/* Backdrop for settings */}`
);

// If there's an old timerEnded block near the bottom from a previous patch, remove it.
content = content.replace(/      \{timerEnded && \(\n        <div className="fixed inset-0[\s\S]*?\{\/\* Content \*\/\}/g, "{/* Content */}");

fs.writeFileSync('src/pages/Reader.tsx', content);
