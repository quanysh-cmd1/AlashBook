const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  "import { Settings2, Moon, Sun, Type, Clock, PenTool, MessageSquare, X, ChevronLeft } from 'lucide-react';",
  "import { Settings2, Moon, Sun, Type, Clock, PenTool, MessageSquare, X, ChevronLeft, Timer, Music, Bell, Play, Pause } from 'lucide-react';"
);

// 2. Add states for timer and music
content = content.replace(
  "const [statsMode, setStatsMode] = useState<'time' | 'progress' | 'left'>('time');",
  `const [statsMode, setStatsMode] = useState<'time' | 'progress' | 'left'>('time');
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRemaining !== null && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerEnded(true);
      setTimerRemaining(null);
      setTimerDuration(null);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    }
    return () => clearInterval(interval);
  }, [timerRemaining]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const startTimer = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTimerRemaining(minutes * 60);
    setShowTimerSettings(false);
  };
  
  const cancelTimer = () => {
    setTimerDuration(null);
    setTimerRemaining(null);
    setShowTimerSettings(false);
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
  };`
);

// 3. Add audio element right after return (
content = content.replace(
  "return (",
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
`
);

// We need to close the <> at the end of the return statement
// Let's find the end of the return. It usually is just the last </div>
let lastDivMatch = content.lastIndexOf('</div>');
content = content.substring(0, lastDivMatch + 6) + '\n    </>\n  );' + content.substring(content.indexOf('}', lastDivMatch + 6) || content.length);
// Wait, the file ends with:
//         </div>
//       )}
//     </div>
//   );
// }

// Let's do it safer.
content = content.replace(
  /    <\/div>\n  \);\n\}/,
  "    </div>\n    </>\n  );\n}"
);

// 4. Add the Timer and Music buttons in the top navbar (which is inside <div className={clsx("fixed top-0 inset-x-0 ...)}> )
// Find:
/*
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <Settings2 size={24} />
          </button>
*/
content = content.replace(
  /<button onClick=\{\(\) => setShowSettings\(!showSettings\)\} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">/,
  `
          <div className="flex items-center gap-1">
            {timerRemaining !== null && (
              <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 mr-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                {formatTime(timerRemaining)}
              </span>
            )}
            <button onClick={() => setShowTimerSettings(!showTimerSettings)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative">
              <Timer size={22} />
            </button>
            <button onClick={toggleMusic} className={clsx("p-2 transition-colors relative", isMusicPlaying ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white")}>
              {isMusicPlaying ? <Pause size={22} /> : <Music size={22} />}
              {isMusicPlaying && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">`
);

// 5. Add Timer Settings Overlay (next to regular Settings)
// Look for showSettings modal logic. 
content = content.replace(
  /        \{showSettings && \([\s\S]*?className="fixed bottom-0 inset-x-0[\s\S]*?<\/div>\n        \)\}/,
  `$&
        {showTimerSettings && (
          <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 z-50 animate-in slide-in-from-bottom border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Timer size={20} className="text-blue-600" />
                Фокус таймері
              </h3>
              <button onClick={() => setShowTimerSettings(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[15, 30, 45, 60, 90, 120].map(mins => (
                <button
                  key={mins}
                  onClick={() => startTimer(mins)}
                  className="py-3 px-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                >
                  {mins} мин
                </button>
              ))}
            </div>
            
            {timerRemaining !== null && (
              <button 
                onClick={cancelTimer}
                className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Таймерді өшіру
              </button>
            )}
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Таймер барысында фондық музыканы қосып, кітапқа толық назар аударыңыз.
            </p>
          </div>
        )}`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
