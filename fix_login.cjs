const fs = require('fs');
let storeContent = fs.readFileSync('src/store.tsx', 'utf8');

const loginMatch = /const login = \(email: string, password: string, telegramUsername\?: string\) => \{[\s\S]*?setCurrentUser\(user\);\s*return true;\s*\}\s*return false;\s*\};/;

const newLogin = `const login = (email: string, password: string, telegramUsername?: string) => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const userIndex = usersDB.findIndex((u: any) => u.email === email && u.password === password);
    if (userIndex !== -1) {
      const user = usersDB[userIndex];
      // Force correct role on login
      if (email === 'guest@alash.local' && user.role !== 'admin') {
        user.role = 'admin';
        usersDB[userIndex] = user;
        localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
      } else if (email !== 'guest@alash.local' && user.role === 'admin') {
        user.role = 'user';
        usersDB[userIndex] = user;
        localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
      }
      
      if (telegramUsername && user.telegramUsername !== telegramUsername) {
        user.telegramUsername = telegramUsername;
        usersDB[userIndex] = user;
        localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  };`;

storeContent = storeContent.replace(loginMatch, newLogin);
fs.writeFileSync('src/store.tsx', storeContent);
