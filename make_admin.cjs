const fs = require('fs');
let storeContent = fs.readFileSync('src/store.tsx', 'utf8');

const oldState = `const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('galam_user');
    return saved ? JSON.parse(saved) : null;
  });`;

const newState = `const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('galam_user');
    if (saved) {
      const user = JSON.parse(saved);
      // Auto-upgrade guest to admin
      if (user.email === 'guest@alash.local' && user.role !== 'admin') {
        user.role = 'admin';
        localStorage.setItem('galam_user', JSON.stringify(user));
        
        // Also update the DB array
        try {
          const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
          const userIndex = usersDB.findIndex((u: any) => u.email === 'guest@alash.local');
          if (userIndex !== -1) {
            usersDB[userIndex].role = 'admin';
            localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
          }
        } catch (e) {}
      }
      return user;
    }
    return null;
  });`;

storeContent = storeContent.replace(oldState, newState);
fs.writeFileSync('src/store.tsx', storeContent);
