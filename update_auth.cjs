const fs = require('fs');

// 1. Update types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf-8');
typesContent = typesContent.replace(
  "role: 'admin' | 'user';",
  "role: 'admin' | 'user';\n  telegramUsername?: string;"
);
fs.writeFileSync('src/types.ts', typesContent);

// 2. Update store.tsx
let storeContent = fs.readFileSync('src/store.tsx', 'utf-8');
storeContent = storeContent.replace(
  "signup: (name: string, email: string, password: string) => boolean;",
  "signup: (name: string, email: string, password: string, telegramUsername?: string) => boolean;"
);
storeContent = storeContent.replace(
  "const signup = (name: string, email: string, password: string) => {",
  "const signup = (name: string, email: string, password: string, telegramUsername?: string) => {"
);
storeContent = storeContent.replace(
  "const newUser: User = { id: uuidv4(), name, email, password, role: isFirstUser ? 'admin' : 'user' };",
  "const newUser: User = { id: uuidv4(), name, email, password, role: isFirstUser ? 'admin' : 'user', telegramUsername };"
);
// Make sure to also update the user on login if they have a telegramUsername
storeContent = storeContent.replace(
  `  const login = (email: string, password: string) => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const user = usersDB.find((u: any) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };`,
  `  const login = (email: string, password: string, telegramUsername?: string) => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const userIndex = usersDB.findIndex((u: any) => u.email === email && u.password === password);
    if (userIndex !== -1) {
      const user = usersDB[userIndex];
      if (telegramUsername && user.telegramUsername !== telegramUsername) {
        user.telegramUsername = telegramUsername;
        usersDB[userIndex] = user;
        localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  };`
);
storeContent = storeContent.replace(
  "login: (email: string, password: string) => boolean;",
  "login: (email: string, password: string, telegramUsername?: string) => boolean;"
);
fs.writeFileSync('src/store.tsx', storeContent);

// 3. Update Auth.tsx
let authContent = fs.readFileSync('src/pages/Auth.tsx', 'utf-8');
authContent = authContent.replace(
  `    const success = signup(user.first_name, mockEmail, mockPassword);
    if (!success) {
      login(mockEmail, mockPassword);
    }`,
  `    const telegramUsername = user.username ? \`@\${user.username}\` : undefined;
    const success = signup(user.first_name, mockEmail, mockPassword, telegramUsername);
    if (!success) {
      login(mockEmail, mockPassword, telegramUsername);
    }`
);
fs.writeFileSync('src/pages/Auth.tsx', authContent);
