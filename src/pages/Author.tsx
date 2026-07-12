import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { ChevronLeft, BookOpen } from 'lucide-react';

export function Author() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { books } = useAppContext();
  
  const decodedName = name ? decodeURIComponent(name) : '';
  const authorBooks = books.filter(b => b.author === decodedName);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg text-gray-900 truncate flex-1 text-center pr-8">{decodedName}</h1>
      </div>

      <div className="px-6 mt-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            {decodedName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{decodedName}</h2>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <BookOpen size={14} />
              {authorBooks.length} кітап
            </p>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4">Автордың кітаптары</h3>
        
        {authorBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {authorBooks.map(book => (
              <Link key={book.id} to={`/book/${book.id}`} className="group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-sm bg-gray-100 relative mb-3 border border-gray-100">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{book.genre}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Кітаптар табылмады.</p>
        )}
      </div>
    </div>
  );
}
