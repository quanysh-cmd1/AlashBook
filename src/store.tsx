import localforage from 'localforage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Book, Comment, User, ReaderSettings, Genre, Highlight } from './types';
import { v4 as uuidv4 } from 'uuid';

// Initial mock data based on the designs
const INITIAL_BOOKS: Book[] = [
  {
    id: '3',
    title: 'Сандық Қазақстан және жасанды интеллект',
    author: 'АИ зерттеушісі',
    genre: 'Science',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    content: `# Сандық Қазақстан және жасанды интеллект

## Кіріспе

Қазіргі таңда әлем өте жылдам қарқынмен дамып келеді. Технологиялар біздің күнделікті өміріміздің ажырамас бөлігіне айналды. Сандық трансформация тек технологиялық процесс емес, ол бүкіл қоғамды, экономиканы және мәдениетті өзгертетін үлкен құбылыс. Қазақстан да бұл үрдістен қалыс қалмай, өзінің сандық экожүйесін құруда белсенді жұмыс атқарып жатыр.

Жасанды интеллект (ЖИ) – бұл адамның ойлау қабілеттерін имитациялайтын, оқуға және шешім қабылдауға қабілетті компьютерлік жүйелер. Бұл мақалада біз Қазақстандағы сандық трансформация мен жасанды интеллектінің даму кезеңдерін, олардың экономикаға және қоғамға тигізетін әсерін тереңірек қарастырамыз.

## Жасанды интеллектінің негізгі бағыттары

Жасанды интеллект бірнеше үлкен бағыттарға бөлінеді:
1. Машиналық оқыту (Machine Learning)
2. Терең оқыту (Deep Learning)
3. Табиғи тілді өңдеу (NLP)
4. Компьютерлік көру (Computer Vision)

Бұл бағыттардың әрқайсысы әртүрлі салада қолданылады. Мысалы, табиғи тілді өңдеу технологиялары арқылы қазақ тіліндегі мәтіндерді талдау, аудару және автоматты түрде жауап беру жүйелері жасалуда. Бұл біздің тіліміздің сандық кеңістікте өмір сүруіне үлкен мүмкіндік береді.

## Экономикаға тигізетін әсері

Жасанды интеллект экономиканың көптеген салаларында тиімділікті арттыруға көмектеседі. Мысалы, ауыл шаруашылығында дрондар мен сенсорлар арқылы жиналған мәліметтерді талдау арқылы егіннің шығымын болжауға болады. Бұл фермерлерге суды, тыңайтқыштарды және басқа да ресурстарды үнемдеуге көмектеседі.

Медицина саласында ЖИ ауруларды ерте бастан анықтауға, медициналық суреттерді талдауға және әрбір пациентке жеке емдеу жоспарын құруға мүмкіндік береді. Қазақстанда да осындай стартаптар пайда болып, өз шешімдерін ұсынуда.

## Білім берудегі ЖИ

Білім беру саласы да үлкен өзгерістер алдында тұр. Оқушылар мен студенттерге арналған жекелендірілген оқу бағдарламалары, виртуалды ассистенттер және автоматты бағалау жүйелері білім сапасын көтеруге көмектеседі. Мұғалімдердің қағазбастылықтан арылып, оқушылармен көбірек шығармашылық жұмыс істеуіне жағдай жасалады.

Алайда, жаңа технологияларды енгізумен қатар, біз оларды дұрыс қолдана білетін мамандарды дайындауымыз керек. Сондықтан мектептер мен университеттерде бағдарламалау, деректерді талдау және ЖИ негіздерін оқыту өте маңызды.

## Келешекке көзқарас

Сандық Қазақстан бағдарламасы аясында көптеген мемлекеттік қызметтер цифрлық форматқа көшті. Бұл халыққа қызмет көрсету сапасын жақсартып, сыбайлас жемқорлық қаупін азайтты. Ендігі кезекте бұл деректерді талдап, халыққа одан да сапалы, проактивті қызметтер ұсыну үшін жасанды интеллектіні кеңінен қолдану қажет.

Болашақта жасанды интеллект біздің күнделікті көмекшімізге айналады. Ол бізге күрделі есептерді шешуге, жаңа идеялар табуға және өмірімізді жеңілдетуге көмектеседі. Бірақ технология қаншалықты дамыса да, адамның шығармашылығы, эмпатиясы және моральдық құндылықтары әрқашан бірінші орында қалуы тиіс.

Қорытындылай келе, Қазақстанның сандық болашағы жарқын. Біз тек технологияларды тұтынушы ғана емес, оларды жасаушы елге айналуымыз керек. Бұл жолда әрбір азаматтың үлесі маңызды. Оқу, іздену және жаңа технологияларды меңгеру - біздің басты мақсатымыз болуы тиіс.

## 2-бөлім. Дамудың жаңа кезеңі

Осы жетістіктермен тоқтап қалмай, келесі он жылдықта жаңа технологиялардың интеграциясы арқылы мемлекеттік басқару мен өндірістік процестерді одан әрі автоматтандыру жоспарлануда. Көптеген сарапшылардың пікірінше, блокчейн, заттар интернеті (IoT) және 5G желілері сияқты технологиялар ЖИ-мен біріге отырып, экономиканың өсімін жаңа деңгейге шығарады. 

Инвестиция тарту мен стартаптарды қолдау мақсатында Astana Hub сияқты технопарктердің рөлі артып келеді. Ондағы резиденттердің көбісі ЖИ бағытындағы жобаларды жүзеге асыруда және олардың кейбірі халықаралық нарыққа шығу мүмкіндігіне ие болды. Бұл дегеніміз, біздің жастардың әлеуеті өте жоғары. 

## 3-бөлім. Қауіпсіздік және этика

ЖИ дамыған сайын, оның этикалық және қауіпсіздік мәселелері де алдыңғы қатарға шығады. Дербес деректерді қорғау, алгоритмдердің әділдігі мен мөлдірлігі, сондай-ақ киберқауіпсіздік саласындағы жаңа сын-қатерлерге дайын болуымыз керек. Мемлекет тарапынан бұл салаға қатысты арнайы заңнамалық актілер қабылданып, реттеу механизмдері жетілдірілуде.

Тек технологияны дамыту емес, оның қоғамға зиян келтірмейтіндей етіп қолданылуын қамтамасыз ету – басты басымдықтардың бірі. Бұл бағытта халықаралық ұйымдармен және дамыған елдермен тәжірибе алмасудың маңызы зор. Жалпы алғанда, Қазақстан сандық экономиканы қауіпсіз әрі орнықты дамыту жолын таңдады.`,
    rating: 5.0,
    createdAt: Date.now(),
  },
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    genre: 'Design',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
    content: `# Chapter 1\n\nThe Psychopathology of Everyday Things\n\nSignifiers are the most important addition to the chapter, a concept first introduced in my book Living with Complexity. The first edition had a focus upon affordances, but although affordances make sense for interaction with physical objects, they are confusing when dealing with virtual ones. As a result, affordances have created much confusion in the world of design.\n\nAffordances define what actions are possible. Signifiers specify how people discover those possibilities: signifiers are signs, perceptible signals of what can be done. Signifiers are of far more importance to designers than are affordances. Hence, the extended treatment. I added a very brief section on HCD, a term that didn't yet exist when the first edition was published, although looking back, we see that the entire book was about HCD.`,
    rating: 4.8,
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    title: 'Read People Like a Book',
    author: 'Patrick King',
    genre: 'Psychology',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop',
    content: `# Introduction\n\nWhy learning is important?\n\nWhen you think about the things you do everyday, you probably wouldn't put learning new things on the list. Living busy and hectic lifestyles makes it difficult to think about learning new things and trying something new, but you could be really missing out both personally and professionally.\n\nIt is so important to try new things and push yourself out of your comfort zone. The potential benefits are really huge and to be honest, there is nothing to lose, so you should start today and learn something new!`,
    rating: 4.5,
    createdAt: Date.now() - 50000,
  }
];

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string, telegramUsername?: string) => boolean;
  signup: (name: string, email: string, password: string, telegramUsername?: string) => boolean;
  logout: () => void;
  toggleFavorite: (bookId: string) => void;
  toggleReadLater: (bookId: string) => void;
  updateReadingStats: (minutes: number) => void;
  getAllUsers: () => User[];
  updateUserRole: (userId: string, role: 'admin' | 'user') => void;
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'rating'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  comments: Comment[];
  addComment: (bookId: string, text: string, rating?: number) => void;
  deleteComment: (commentId: string) => void;
  readerSettings: ReaderSettings;
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  readingProgress: Record<string, number>;
  updateReadingProgress: (bookId: string, percentage: number) => void;
  highlights: Highlight[];
  addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  deleteHighlight: (highlightId: string) => void;
  readingDays: string[];
  addReadingDay: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage for persistence to keep it 100% free and local
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('galam_user');
    if (saved) {
      const user = JSON.parse(saved);
      // Ensure only guest@alash.local is admin
      if (user.email === 'guest@alash.local') {
        if (user.role !== 'admin') {
          user.role = 'admin';
          localStorage.setItem('galam_user', JSON.stringify(user));
        }
      } else {
        if (user.role === 'admin') {
          user.role = 'user';
          localStorage.setItem('galam_user', JSON.stringify(user));
        }
      }
      
      // Sync DB
      try {
        const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
        let modified = false;
        usersDB.forEach((u: any) => {
          if (u.email === 'guest@alash.local' && u.role !== 'admin') {
            u.role = 'admin';
            modified = true;
          } else if (u.email !== 'guest@alash.local' && u.role === 'admin') {
            u.role = 'user';
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
        }
      } catch (e) {}

      return user;
    }
    return null;
  });

  const login = (email: string, password: string, telegramUsername?: string) => {
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
  };

  const signup = (name: string, email: string, password: string, telegramUsername?: string) => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    if (usersDB.some((u: any) => u.email === email)) {
      return false; // Email already exists
    }
    const isFirstUser = usersDB.length === 0;
    const newUser: User = { id: uuidv4(), name, email, password, role: email === 'guest@alash.local' ? 'admin' : 'user', telegramUsername };
    usersDB.push(newUser);
    localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
    setCurrentUser(newUser);
    return true;
  };

  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('galam_users_db') || '[]') as User[];
  };

  const updateUserRole = (userId: string, role: 'admin' | 'user') => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const userIndex = usersDB.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      usersDB[userIndex].role = role;
      localStorage.setItem('galam_users_db', JSON.stringify(usersDB));
      if (currentUser?.id === userId) {
        setCurrentUser(usersDB[userIndex]);
      }
    }
  };


  const toggleFavorite = (bookId: string) => {
    if (!currentUser) return;
    const isFav = currentUser.favorites?.includes(bookId);
    const newFavorites = isFav 
      ? (currentUser.favorites || []).filter(id => id !== bookId)
      : [...(currentUser.favorites || []), bookId];
    
    setCurrentUser({ ...currentUser, favorites: newFavorites });
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, favorites: newFavorites } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));
  };

  const toggleReadLater = (bookId: string) => {
    if (!currentUser) return;
    const isReadLater = currentUser.readLater?.includes(bookId);
    const newReadLater = isReadLater 
      ? (currentUser.readLater || []).filter(id => id !== bookId)
      : [...(currentUser.readLater || []), bookId];
    
    setCurrentUser({ ...currentUser, readLater: newReadLater });
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readLater: newReadLater } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));
  };

  const updateReadingStats = (minutes: number) => {
    if (!currentUser) return;
    const currentStats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };
    const newStats = {
      ...currentStats,
      minutesRead: currentStats.minutesRead + minutes
    };
    setCurrentUser({ ...currentUser, readingStats: newStats });
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readingStats: newStats } : u);
    localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('galam_user');
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoaded, setBooksLoaded] = useState(false);
  
  useEffect(() => {
    async function loadBooks() {
      try {
        const savedBooks = await localforage.getItem<Book[]>('galam_books');
        const hasInitialized = localStorage.getItem('galam_initialized');
        
        if (savedBooks && savedBooks.length > 0) {
          setBooks(savedBooks);
        } else if (!hasInitialized) {
          setBooks(INITIAL_BOOKS);
          localStorage.setItem('galam_initialized', 'true');
        } else {
          setBooks(savedBooks || []);
        }
      } catch (e) {
        setBooks(INITIAL_BOOKS);
      }
      setBooksLoaded(true);
    }
    loadBooks();
  }, []);

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('galam_comments');
    return saved ? JSON.parse(saved) : [];
  });

  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('galam_settings');
    const defaults: ReaderSettings = { theme: 'light', fontFamily: 'serif', fontSize: 18, margins: 'medium', bionicReading: false, pagingMode: 'vertical', autoScrollSpeed: 0 };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('galam_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = localStorage.getItem('galam_highlights');
    return saved ? JSON.parse(saved) : [];
  });

  const [readingDays, setReadingDays] = useState<string[]>(() => {
    const saved = localStorage.getItem('galam_reading_days');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('galam_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => {
    if (booksLoaded) {
      localforage.setItem('galam_books', books).catch(console.error);
    }
  }, [books, booksLoaded]);
  useEffect(() => { localStorage.setItem('galam_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('galam_settings', JSON.stringify(readerSettings)); }, [readerSettings]);
  useEffect(() => { localStorage.setItem('galam_progress', JSON.stringify(readingProgress)); }, [readingProgress]);
  useEffect(() => { localStorage.setItem('galam_highlights', JSON.stringify(highlights)); }, [highlights]);
  useEffect(() => { localStorage.setItem('galam_reading_days', JSON.stringify(readingDays)); }, [readingDays]);

  const updateReadingProgress = (bookId: string, percentage: number) => {
    // Check if it just crossed 90% using the current readingProgress state
    const oldPercentage = readingProgress[bookId] || 0;
    if (oldPercentage < 0.9 && percentage >= 0.9 && currentUser) {
      // Increment books read
      const currentStats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };
      const newStats = {
        ...currentStats,
        booksRead: currentStats.booksRead + 1
      };
      setCurrentUser({ ...currentUser, readingStats: newStats });
      const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
      const updatedUsersDB = usersDB.map((u: any) => u.id === currentUser.id ? { ...u, readingStats: newStats } : u);
      localStorage.setItem('galam_users_db', JSON.stringify(updatedUsersDB));
    }
    
    setReadingProgress(prev => ({ ...prev, [bookId]: percentage }));
  };

  const addBook = (newBookData: Omit<Book, 'id' | 'createdAt' | 'rating'>) => {
    const newBook: Book = {
      ...newBookData,
      id: uuidv4(),
      createdAt: Date.now(),
      rating: 5.0,
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updates } : book));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addComment = (bookId: string, text: string, rating?: number) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: uuidv4(),
      bookId,
      userName: currentUser.name || 'Қолданушы',
      text,
      createdAt: Date.now(),
      rating,
    };
    setComments(prev => [newComment, ...prev]);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const updateReaderSettings = (updates: Partial<ReaderSettings>) => {
    setReaderSettings(prev => ({ ...prev, ...updates }));
  };

  const addHighlight = (highlightData: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setHighlights(prev => [newHighlight, ...prev]);
  };

  const deleteHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const addReadingDay = () => {
    const today = new Date().toISOString().split('T')[0];
    setReadingDays(prev => {
      if (!prev.includes(today)) {
        return [...prev, today];
      }
      return prev;
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      signup,
      logout,
      toggleFavorite,
      toggleReadLater,
      updateReadingStats,
      getAllUsers,
      updateUserRole,
      books,
      addBook,
      updateBook,
      deleteBook,
      comments,
      addComment,
      deleteComment,
      readerSettings,
      updateReaderSettings,
      readingProgress,
      updateReadingProgress,
      highlights,
      addHighlight,
      deleteHighlight,
      readingDays,
      addReadingDay
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
