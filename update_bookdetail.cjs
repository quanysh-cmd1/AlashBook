const fs = require('fs');
let content = fs.readFileSync('src/pages/BookDetail.tsx', 'utf-8');

// Add icons
content = content.replace(
  "import { ChevronLeft, Star, MessageSquare, Download } from 'lucide-react';",
  "import { ChevronLeft, Star, MessageSquare, Heart, BookmarkPlus, BookmarkMinus } from 'lucide-react';"
);

// Destructure from store
content = content.replace(
  "const { books, comments, addComment, deleteComment, currentUser, readingProgress } = useAppContext();",
  "const { books, comments, addComment, deleteComment, currentUser, readingProgress, toggleFavorite, toggleReadLater } = useAppContext();\n  const [rating, setRating] = useState<number>(0);"
);

// Update add comment to include rating
content = content.replace(
  "addComment(book.id, commentText);",
  "addComment(book.id, commentText, rating);\n      setRating(0);"
);

// Check if favorite/read later
content = content.replace(
  "const progress = id ? (readingProgress[id] || 0) : 0;",
  `const progress = id ? (readingProgress[id] || 0) : 0;
  const isFavorite = currentUser?.favorites?.includes(id || '') || false;
  const isReadLater = currentUser?.readLater?.includes(id || '') || false;`
);

// Render star selector for comments
content = content.replace(
  /<form onSubmit=\{handleAddComment\} className="mb-6 flex gap-2">[\s\S]*?<\/form>/m,
  `<form onSubmit={handleAddComment} className="mb-6 flex flex-col gap-3 bg-gray-50 p-4 rounded-xl">
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
          </form>`
);

// Render star rating in comments list
content = content.replace(
  /<span className="font-medium text-sm text-gray-900">\{comment\.userName\}<\/span>/m,
  `<div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                    {comment.rating && (
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    )}
                  </div>`
);

// Render Favorite and Read Later buttons below "Кітап туралы"
content = content.replace(
  /<div className="mt-8">[\s\S]*?<h3 className="font-bold text-gray-900 mb-2">Кітап туралы<\/h3>/m,
  `<div className="flex gap-3 mt-6">
          <button 
            onClick={() => id && toggleFavorite(id)}
            className={\`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors \${isFavorite ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}\`}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            {isFavorite ? 'Сүйіктілерде' : 'Сүйікті'}
          </button>
          <button 
            onClick={() => id && toggleReadLater(id)}
            className={\`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors \${isReadLater ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}\`}
          >
            {isReadLater ? <BookmarkMinus size={18} /> : <BookmarkPlus size={18} />}
            {isReadLater ? 'Тізімде' : 'Кейін оқу'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-gray-900 mb-2">Кітап туралы</h3>`
);

// Also add a link to the Author's page
content = content.replace(
  /<p className="text-gray-500 mt-1">\{book\.author\}<\/p>/m,
  `<Link to={\`/author/\${encodeURIComponent(book.author)}\`} className="inline-block text-blue-600 hover:text-blue-800 mt-1 hover:underline">{book.author}</Link>`
);

fs.writeFileSync('src/pages/BookDetail.tsx', content);
