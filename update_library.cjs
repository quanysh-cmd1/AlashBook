const fs = require('fs');

let content = fs.readFileSync('src/pages/Library.tsx', 'utf-8');

// Add Genre type import
content = content.replace("import { useAppContext } from '../store';", "import { useAppContext } from '../store';\nimport { Genre } from '../types';");

// Replace categoryImages logic
content = content.replace(
  /  const categoryImages: Record<string, string> = {[\s\S]*?  const categories = Object.keys\(categoryImages\);/m,
  `  const genres: Genre[] = ['Design', 'Psychology', 'Novels', 'Science', 'Fantasy', 'Other'];
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
  }, [books]);`
);

// Update recent search click
content = content.replace(
  /<div key=\{search\} className="flex items-center gap-2 bg-gray-50\/80 px-4 py-2 rounded-full border border-gray-100">/g,
  '<div key={search} className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full border border-gray-100 cursor-pointer" onClick={() => setSearchQuery(search)}>'
);

// Update recent search delete button
content = content.replace(
  /<button onClick=\{\(\) => removeSearch\(search\)\} className="text-gray-400 hover:text-gray-700">/g,
  '<button onClick={(e) => { e.stopPropagation(); removeSearch(search); }} className="text-gray-400 hover:text-gray-700">'
);

// Update category render
content = content.replace(
  /\{categories\.map\(category => \([\s\S]*?<\/div>[\s\S]*?<\/Link>[\s\S]*?\)\)}/m,
  `{categoriesWithImage.map(category => (
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
              ))}`
);

fs.writeFileSync('src/pages/Library.tsx', content);
