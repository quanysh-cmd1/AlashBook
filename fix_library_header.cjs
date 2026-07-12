const fs = require('fs');
let content = fs.readFileSync('src/pages/Library.tsx', 'utf8');

const oldHeader = `      <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-white">
        <AnimatePresence>
          {showGreeting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0 }}
              className="mr-4"
            >
              <h1 className="text-[28px] font-sans font-medium text-gray-900 leading-tight pb-1 flex items-center gap-2">
                Сәлем, {currentUser ? (currentUser.name || 'Оқырман') : 'Оқырман'} <span>👋</span>
              </h1>
              {currentUser?.telegramUsername && (
                <p className="text-sm font-medium text-blue-600/80 mt-0.5">
                  {currentUser.telegramUsername}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center relative group"
        >
          <motion.div 
            
            className="bg-orange-100/80 rounded-2xl px-3 py-2 shadow-sm border border-orange-200 flex items-center gap-2"
          >
            <Flame size={22} className={streakCount > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
            <span className={streakCount > 0 ? "text-orange-600 font-bold" : "text-gray-500 font-medium"}>
              {streakCount} {streakCount > 0 ? 'күн' : ''}
            </span>
          </motion.div>
          {streakCount === 0 && (
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-gray-400 absolute -bottom-4 whitespace-nowrap">
              Стрейк жоқ
            </span>
          )}
        </motion.div>
      </div>`;

const newHeader = `      <AnimatePresence>
        {showGreeting && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0 }}
            className="px-6 pt-8 pb-4 flex justify-between items-center bg-white"
          >
            <div className="mr-4">
              <h1 className="text-[28px] font-sans font-medium text-gray-900 leading-tight pb-1 flex items-center gap-2">
                Сәлем, {currentUser ? (currentUser.name || 'Оқырман') : 'Оқырман'} <span>👋</span>
              </h1>
              {currentUser?.telegramUsername && (
                <p className="text-sm font-medium text-blue-600/80 mt-0.5">
                  {currentUser.telegramUsername}
                </p>
              )}
            </div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center relative group"
            >
              <div className="bg-orange-100/80 rounded-2xl px-3 py-2 shadow-sm border border-orange-200 flex items-center gap-2">
                <Flame size={22} className={streakCount > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
                <span className={streakCount > 0 ? "text-orange-600 font-bold" : "text-gray-500 font-medium"}>
                  {streakCount} {streakCount > 0 ? 'күн' : ''}
                </span>
              </div>
              {streakCount === 0 && (
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-gray-400 absolute -bottom-4 whitespace-nowrap">
                  Стрейк жоқ
                </span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

if(content.includes(oldHeader)) {
  content = content.replace(oldHeader, newHeader);
  fs.writeFileSync('src/pages/Library.tsx', content);
  console.log("Success");
} else {
  console.log("Failed to match old content");
}
