import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { Genre, Book } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const shelfColorsRgb: Record<Genre, string> = {
  'Design': '245, 166, 35',
  'Psychology': '77, 169, 255',
  'Novels': '255, 107, 107',
  'Science': '74, 222, 128',
  'Fantasy': '192, 132, 252',
  'Other': '161, 161, 170'
};

export function MyShelf() {
  const { books } = useAppContext();
  
  
  // Group by genre
  const booksByGenre = useMemo(() => {
    const grouped = {} as Record<Genre, Book[]>;
    books.forEach(book => {
      if (!grouped[book.genre]) {
        grouped[book.genre] = [];
      }
      grouped[book.genre].push(book);
    });
    return grouped;
  }, [books]);

  // Define the order to match the screenshot or have a fixed order
  const orderedGenres: Genre[] = ['Design', 'Psychology', 'Novels', 'Science', 'Fantasy', 'Other'];
  
  const activeGenres = orderedGenres.filter(genre => booksByGenre[genre]?.length > 0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-16 pb-10 text-center"
      >
        
          
        <h2 className="text-[16px] font-medium text-gray-800 mb-1">My Favourite</h2>
        <h1 className="text-[48px] font-serif font-medium tracking-tight text-gray-900 leading-none">BOOKS</h1>
      </motion.div>

      <div className="space-y-12">
        {activeGenres.map((genre, index) => (
          <GenreShelf 
            key={genre} 
            genre={genre} 
            title={genre} 
            books={booksByGenre[genre]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function GenreShelf({ genre, title, books, index }: { genre: Genre, title: string, books: Book[], index: number }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const colorRgb = shelfColorsRgb[genre] || shelfColorsRgb['Other'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
    >
      <div className="flex justify-between items-end mb-5 px-6">
        <h3 className="text-[22px] font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-gray-400">{books.length} books</span>
          <div className="flex items-center gap-1 text-gray-400">
            <button onClick={() => scroll('left')} className="hover:text-gray-900 transition-colors p-1">
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => scroll('right')} className="hover:text-gray-900 transition-colors p-1">
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Books container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-[20px] overflow-x-auto hide-scrollbar relative z-0 pb-[30px] pt-4 px-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book) => (
            <Link 
              key={book.id} 
              to={`/book/${book.id}`}
              className="flex-shrink-0 w-[140px] transition-transform hover:-translate-y-2 duration-300 relative z-10"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-[210px] object-cover shadow-[0_8px_20px_rgba(0,0,0,0.15)] rounded-sm"
              />
            </Link>
          ))}
          
          {/* Add extra padding element at the end to ensure the last book can be scrolled fully */}
          <div className="flex-shrink-0 w-2" />
        </div>

        {/* Shelf background */}
        <div 
          className="absolute bottom-[0px] left-[3.5%] right-[3.5%] h-[100px] rounded-[30px] z-20 pointer-events-none flex items-center justify-between px-6 overflow-hidden"
          style={{
            backgroundColor: `rgba(${colorRgb}, 0.45)`,
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.2)',
            border: '1.5px solid rgba(255,255,255,0.4)'
          }}
        >
           {/* Top edge highlight for chamfered look */}
           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/10 via-white/80 to-white/10"></div>
           {/* Bottom edge highlight for thickness */}
           <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-white/5 via-white/40 to-white/5"></div>
           {/* Left and right inner highlights */}
           <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-white/60 to-transparent"></div>
           <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-white/60 to-transparent"></div>
           
           {/* Screws */}
           <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#999999] shadow-[inset_0_1px_3px_rgba(255,255,255,1),inset_0_-1px_3px_rgba(0,0,0,0.6),0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center relative z-10 border-[0.5px] border-[#666]">
             <div className="w-2.5 h-[1.5px] bg-[#444] rotate-45 shadow-[0_0.5px_0_rgba(255,255,255,0.8)]" />
           </div>
           <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#999999] shadow-[inset_0_1px_3px_rgba(255,255,255,1),inset_0_-1px_3px_rgba(0,0,0,0.6),0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center relative z-10 border-[0.5px] border-[#666]">
             <div className="w-2.5 h-[1.5px] bg-[#444] -rotate-45 shadow-[0_0.5px_0_rgba(255,255,255,0.8)]" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}
