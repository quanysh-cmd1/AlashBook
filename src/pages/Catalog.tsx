import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store';
import { Genre, Book } from '../types';
import { Search, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export function Catalog() {
  const { books, readingProgress } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const genres: Genre[] = ['Design', 'Psychology', 'Novels', 'Science', 'Fantasy', 'Other'];
  
  const genreTranslations: Record<Genre, string> = {
    'Design': 'Дизайн',
    'Psychology': 'Психология',
    'Novels': 'Романдар',
    'Science': 'Ғылым',
    'Fantasy': 'Фэнтези',
    'Other': 'Басқа'
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        genreTranslations[book.genre].toLowerCase().includes(searchLower);
            
      const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
      
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  // Group books by genre
  const booksByGenre = genres.reduce((acc, genre) => {
    const genreBooks = filteredBooks.filter(b => b.genre === genre);
    if (genreBooks.length > 0) {
      acc[genre] = genreBooks;
    }
    return acc;
  }, {} as Record<Genre, Book[]>);

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="px-6 pt-6 pb-4 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Каталог</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Кітап, автор немесе жанр іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
          />
        </div>

        {/* Genre Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
          <button
            onClick={() => setSelectedGenre('All')}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedGenre === 'All' 
                ? "bg-gray-900 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Барлығы
          </button>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedGenre === genre 
                  ? "bg-gray-900 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {genreTranslations[genre]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 mt-4">
        {Object.entries(booksByGenre).length === 0 ? (
          <div className="text-center py-10 px-6">
            <p className="text-gray-500">Кітаптар табылмады.</p>
          </div>
        ) : (
          Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <div key={genre} className="pl-6">
            <div className="flex justify-between items-end pr-6 mb-4">
              <h3 className="text-[1.1rem] font-bold text-gray-900">{genreTranslations[genre as Genre]}</h3>
              <span className="text-sm text-gray-400">{genreBooks.length} кітап</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 pr-6">
              {genreBooks.map(book => {
                const progress = readingProgress[book.id] || 0;
                return (
                <Link key={book.id} to={`/book/${book.id}`} className="group relative w-32 flex-shrink-0">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow bg-gray-100">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    {progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div className="h-full bg-blue-500" style={{ width: `${progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 px-0.5">
                    <h4 className="font-semibold text-[14px] text-gray-900 leading-tight line-clamp-2">{book.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-1">{book.author}</p>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
