import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store';
import { Genre } from '../types';
import { Search, X, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Library() {
  const { books, currentUser, readingDays } = useAppContext();
  
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);
  
  const getStreak = () => {
    if (!readingDays || readingDays.length === 0) return 0;
    
    // Sort descending
    const sortedDays = [...readingDays].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // today
    
    // Check if the latest read day is today or yesterday
    const latestDay = new Date(sortedDays[0]);
    latestDay.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - latestDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return 0; // Streak broken
    }
    
    let checkDate = latestDay;
    for (const dayStr of sortedDays) {
      const d = new Date(dayStr);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  
  const streakCount = getStreak();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [recentSearches, setRecentSearches] = useState([
    'Абай жолы', 
    'Психология', 
    'Мотивация', 
    'Тарих'
  ]);
  
  const removeSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };
  
  const genres: Genre[] = ['Design', 'Psychology', 'Novels', 'Science', 'Fantasy', 'Other'];
  const genreTranslations: Record<Genre, string> = {
    'Design': 'Дизайн',
    'Psychology': 'Психология',
    'Novels': 'Романдар',
    'Science': 'Ғылым',
    'Fantasy': 'Фэнтези',
    'Other': 'Басқа'
  };

  const categoriesWithImage = useMemo(() => {
    return genres
      .map(g => {
        const book = books.find(b => b.genre === g);
        return {
          id: g,
          name: genreTranslations[g],
          imageUrl: book ? book.coverUrl : null,
        };
      })
      .filter(c => c.imageUrl !== null);
  }, [books]);

  const trendingBooks = useMemo(() => {
    return [...books].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [books]);

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header with Streak */}
      <AnimatePresence>
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
      </AnimatePresence>
      
      {/* Search Bar */}
      <div className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
          />
        </div>
      </div>

      {/* Recent Search */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="px-6 mb-10 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.1rem] font-medium text-gray-900">Соңғы іздеулер</h2>
            <button onClick={() => setRecentSearches([])} className="text-sm text-gray-500 hover:text-gray-900">Тазарту</button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recentSearches.map(search => (
              <div key={search} className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full border border-gray-100 cursor-pointer" onClick={() => setSearchQuery(search)}>
                <span className="text-sm text-gray-700">{search}</span>
                <button onClick={(e) => { e.stopPropagation(); removeSearch(search); }} className="text-gray-400 hover:text-gray-700">
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchQuery ? (
        <>
          {/* Browse By Category */}
          <div className="mb-10">
            <div className="flex justify-between items-center px-6 mb-4">
              <h2 className="text-[1.1rem] font-medium text-gray-900">Санаттар бойынша іздеу</h2>
              <Link to="/catalog" className="text-sm text-gray-500 hover:text-gray-900">
                Барлығын көру
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-2">
              {categoriesWithImage.map(category => (
                <Link key={category.id} to="/catalog" className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
                  <div className="w-[72px] h-[96px] rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">Суретсіз</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800 text-center">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Now */}
          <div className="mb-8">
            <div className="flex justify-between items-center px-6 mb-4">
              <h2 className="text-[1.1rem] font-medium text-gray-900">Қазір трендте</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4">
              {trendingBooks.map((book, index) => (
                <div key={book.id} className="flex-shrink-0 w-[240px]">
                  <Link to={`/book/${book.id}`} className="block">
                    <div className="bg-gray-50 rounded-[24px] h-[180px] relative flex items-center justify-center p-4 mb-4 overflow-hidden group border border-gray-100 transition-colors duration-500 hover:bg-gray-100/80">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10rem] font-black tracking-tighter text-gray-200/80 leading-none select-none z-0 transition-all duration-500 ease-out group-hover:-translate-x-2 group-hover:text-gray-300">
                        {index + 1}
                      </span>
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-[96px] h-[140px] object-cover rounded-[8px] shadow-md relative z-10 ml-12 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl"
                      />
                    </div>
                  </Link>
                  <div className="px-1">
                    <h3 className="font-semibold text-[15px] text-gray-900 leading-tight line-clamp-1">{book.title}</h3>
                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Search Results View */
        <div className="px-6 space-y-4">
          <h2 className="text-[1.1rem] font-medium text-gray-900 mb-4">Іздеу нәтижелері</h2>
          {books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())).map(book => (
            <Link key={book.id} to={`/book/${book.id}`} className="flex gap-4 bg-white p-2 rounded-xl">
              <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-md shadow-sm" />
              <div className="flex-1 py-1">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{book.author}</p>
              </div>
            </Link>
          ))}
          {books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <p className="text-gray-500 text-center py-8">Ештеңе табылмады.</p>
          )}
        </div>
      )}
    </div>
  );
}
