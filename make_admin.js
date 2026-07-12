const fs = require('fs');
let storeContent = fs.readFileSync('src/store.tsx', 'utf8');

if (!storeContent.includes('if (email === "guest@alash.local")')) {
  // Let's modify login function to automatically upgrade guest to admin
  const loginMatch = /const login = \(email: string, password: string, telegramUsername\?: string\) => \{[\s\S]*?if \(userIndex !== -1\) \{/;
  
  const newLogin = `const login = (email: string, password: string, telegramUsername?: string) => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    let userIndex = usersDB.findIndex((u: any) => u.email === email && u.password === password);
    
    // Auto-upgrade guest to admin
    if (userIndex !== -1 && email === 'guest@alash.local' && usersDB[userIndex].role !== 'admin') {
      usersDB[userIndex].role = 'admin';
      localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
    }
    
    if (userIndex !== -1) {`;
  
  storeContent = storeContent.replace(loginMatch, newLogin);
  fs.writeFileSync('src/store.tsx', storeContent);
}
