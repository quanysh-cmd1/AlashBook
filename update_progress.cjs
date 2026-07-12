const fs = require('fs');
let content = fs.readFileSync('src/store.tsx', 'utf-8');

content = content.replace(
  `  const updateReadingProgress = (bookId: string, percentage: number) => {
    setReadingProgress(prev => ({ ...prev, [bookId]: percentage }));
  };`,
  `  const updateReadingProgress = (bookId: string, percentage: number) => {
    setReadingProgress(prev => {
      // Check if it just crossed 90%
      const oldPercentage = prev[bookId] || 0;
      if (oldPercentage < 0.9 && percentage >= 0.9 && currentUser) {
        // Increment books read
        const currentStats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };
        const newStats = {
          ...currentStats,
          booksRead: currentStats.booksRead + 1
        };
        setCurrentUser({ ...currentUser, readingStats: newStats });
        setUsers(users => users.map(u => u.id === currentUser.id ? { ...u, readingStats: newStats } : u));
      }
      return { ...prev, [bookId]: percentage };
    });
  };`
);

fs.writeFileSync('src/store.tsx', content);
