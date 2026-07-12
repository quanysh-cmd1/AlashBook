const fs = require('fs');
let content = fs.readFileSync('src/store.tsx', 'utf-8');

// Replace setUsers with localStorage updates
content = content.replace(
  /setUsers\(prev => prev\.map\(u => u\.id === currentUser\.id \? \{ \.\.\.u, favorites: newFavorites \} : u\)\);/g,
  `const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, favorites: newFavorites } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));`
);

content = content.replace(
  /setUsers\(prev => prev\.map\(u => u\.id === currentUser\.id \? \{ \.\.\.u, readLater: newReadLater \} : u\)\);/g,
  `const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readLater: newReadLater } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));`
);

content = content.replace(
  /setUsers\(prev => prev\.map\(u => u\.id === currentUser\.id \? \{ \.\.\.u, readingStats: newStats \} : u\)\);/g,
  `const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readingStats: newStats } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));`
);

content = content.replace(
  /setUsers\(users => users\.map\(u => u\.id === currentUser\.id \? \{ \.\.\.u, readingStats: newStats \} : u\)\);/g,
  `const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
        const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readingStats: newStats } : u);
        localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));`
);

// We also need to fix `users,` inside the return of AppProvider, which we added by mistake
content = content.replace(
  /updateReadingStats,\n      users,/g,
  "updateReadingStats,"
);

fs.writeFileSync('src/store.tsx', content);
