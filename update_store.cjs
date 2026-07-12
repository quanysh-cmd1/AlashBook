const fs = require('fs');
let content = fs.readFileSync('src/store.tsx', 'utf-8');

// Update addComment signature
content = content.replace(
  "addComment: (bookId: string, text: string) => void;",
  "addComment: (bookId: string, text: string, rating?: number) => void;"
);

content = content.replace(
  "const addComment = (bookId: string, text: string) => {",
  "const addComment = (bookId: string, text: string, rating?: number) => {"
);

content = content.replace(
  "userName: currentUser.name,\n      text,\n      createdAt: Date.now(),",
  "userName: currentUser.name,\n      text,\n      createdAt: Date.now(),\n      rating,"
);

// Add toggle functions to AppContextType
content = content.replace(
  "logout: () => void;",
  `logout: () => void;
  toggleFavorite: (bookId: string) => void;
  toggleReadLater: (bookId: string) => void;
  updateReadingStats: (minutes: number) => void;`
);

// Add the implementations
content = content.replace(
  "const logout = () => {",
  `const toggleFavorite = (bookId: string) => {
    if (!currentUser) return;
    const isFav = currentUser.favorites?.includes(bookId);
    const newFavorites = isFav 
      ? (currentUser.favorites || []).filter(id => id !== bookId)
      : [...(currentUser.favorites || []), bookId];
    
    setCurrentUser({ ...currentUser, favorites: newFavorites });
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, favorites: newFavorites } : u));
  };

  const toggleReadLater = (bookId: string) => {
    if (!currentUser) return;
    const isReadLater = currentUser.readLater?.includes(bookId);
    const newReadLater = isReadLater 
      ? (currentUser.readLater || []).filter(id => id !== bookId)
      : [...(currentUser.readLater || []), bookId];
    
    setCurrentUser({ ...currentUser, readLater: newReadLater });
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, readLater: newReadLater } : u));
  };

  const updateReadingStats = (minutes: number) => {
    if (!currentUser) return;
    const currentStats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };
    const newStats = {
      ...currentStats,
      minutesRead: currentStats.minutesRead + minutes
    };
    setCurrentUser({ ...currentUser, readingStats: newStats });
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, readingStats: newStats } : u));
  };

  const logout = () => {`
);

// Expose them in the provider
content = content.replace(
  "logout,\n      users,",
  "logout,\n      toggleFavorite,\n      toggleReadLater,\n      updateReadingStats,\n      users,"
);

fs.writeFileSync('src/store.tsx', content);
