import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { ChevronLeft, Star, MessageSquare, Heart, BookmarkPlus, BookmarkMinus } from 'lucide-react';

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, comments, addComment, deleteComment, currentUser, readingProgress, toggleFavorite, toggleReadLater } = useAppContext();
  const [rating, setRating] = useState<number>(0);
  
  const [commentText, setCommentText] = useState('');
  
  const book = books.find(b => b.id === id);
  const bookComments = comments.filter(c => c.bookId === id).sort((a, b) => b.createdAt - a.createdAt);
  const progress = id ? (readingProgress[id] || 0) : 0;
  const isFavorite = currentUser?.favorites?.includes(id || '') || false;
  const isReadLater = currentUser?.readLater?.includes(id || '') || false;

  if (!book) {
    return <div className="p-6">Кітап табылмады</div>;
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(book.id, commentText, rating);
      setRating(0);
      setCommentText('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  const genreTranslations: Record<string, string> = {
    'Design': 'Дизайн',
    'Psychology': 'Психология',
    'Novels': 'Романдар',
    'Science': 'Ғылым',
    'Fantasy': 'Фэнтези',
    'Other': 'Басқа'
  };

  return (
    <div className="pb-4">
      {/* Top Banner & Cover */}
      <div className="relative h-72 bg-gray-900 w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url(${book.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 text-white backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute -bottom-16 left-6 flex items-end">
          <div className="w-32 rounded-lg shadow-2xl overflow-hidden border-2 border-white bg-white">
            <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-20 px-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
        <Link to={`/author/${encodeURIComponent(book.author)}`} className="inline-block text-blue-600 hover:text-blue-800 mt-1 hover:underline">{book.author}</Link>
        
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center text-yellow-500 font-medium">
            <Star size={16} className="fill-current mr-1" />
            {book.rating.toFixed(1)}
          </div>
          <div className="text-gray-400">
            {genreTranslations[book.genre] || book.genre}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => id && toggleFavorite(id)}
            className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isFavorite ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            {isFavorite ? 'Сүйіктілерде' : 'Сүйікті'}
          </button>
          <button 
            onClick={() => id && toggleReadLater(id)}
            className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isReadLater ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            {isReadLater ? <BookmarkMinus size={18} /> : <BookmarkPlus size={18} />}
            {isReadLater ? 'Тізімде' : 'Кейін оқу'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-gray-900 mb-2">Кітап туралы</h3>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {book.content.substring(0, 300)}...
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={18} />
            Пікірлер ({bookComments.length})
          </h3>
          
          <form onSubmit={handleAddComment} className="mb-6 flex flex-col gap-3 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Бағалау:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Пікір қалдырыңыз..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Жіберу
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {bookComments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-xl group relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                    {comment.rating && (
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded"
                      >
                        Өшіру
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div className="sticky bottom-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-10 flex gap-2 w-full mt-4">
        <Link 
          to={`/read/${book.id}`}
          className="w-full block text-center py-4 rounded-xl bg-blue-600 text-white font-bold tracking-wide transition-transform hover:scale-[1.02] active:scale-95"
        >
          {progress > 0 ? (
            <span className="flex items-center justify-center gap-2">
              ЖАЛҒАСТЫРУ <span className="text-blue-200 text-sm font-normal">({Math.round(progress * 100)}%)</span>
            </span>
          ) : (
            'ҚАЗІР ОҚУ'
          )}
        </Link>
      </div>
    </div>
  );
}
