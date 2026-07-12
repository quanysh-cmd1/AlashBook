export type Genre = 'Design' | 'Psychology' | 'Novels' | 'Science' | 'Fantasy' | 'Other';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  coverUrl: string;
  content: string; // The text of the book
  rating: number;
  createdAt: number;
  fileBlob?: Blob;
  fileName?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: 'admin' | 'user';
  telegramUsername?: string;
  favorites?: string[];
  readLater?: string[];
  readingStats?: {
    booksRead: number;
    minutesRead: number;
  };
}

export interface Comment {
  id: string;
  bookId: string;
  userName: string;
  text: string;
  createdAt: number;
  rating?: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  color: string;
  note?: string;
  createdAt: number;
}

export interface ReaderSettings {
  theme: 'light' | 'sepia' | 'dark' | 'charcoal';
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number;
  margins: 'narrow' | 'medium' | 'wide';
  bionicReading: boolean;
  pagingMode: 'vertical' | 'horizontal';
  autoScrollSpeed: number;
}
