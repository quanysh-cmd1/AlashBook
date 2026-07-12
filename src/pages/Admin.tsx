import mammoth from 'mammoth';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { Genre, Book } from '../types';
import { PlusCircle, Image as ImageIcon, Edit2, Trash2, File as FileIcon, Upload, X, Users, BookOpen, MessageSquare, Crown } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const { currentUser, books, comments, addBook, updateBook, deleteBook, getAllUsers, updateUserRole } = useAppContext();
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');
  const allUsers = getAllUsers();
  
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const usersDB = JSON.parse(localStorage.getItem('galam_users_db') || '[]');
    setTotalUsers(usersDB.length);
  }, []);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Genre>('Novels');
  const [coverUrl, setCoverUrl] = useState('');
  const [content, setContent] = useState('');
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Protect route
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Қолжетімділік жоқ</h2>
        <p className="text-gray-500 mb-6">Бұл бетке тек админдер кіре алады.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 font-medium">Басты бетке қайту</button>
      </div>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setGenre('Novels');
    setCoverUrl('');
    setContent('');
    setFileBlob(null);
    setFileName('');
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setCoverUrl(book.coverUrl);
    setContent(book.content);
    setFileBlob(book.fileBlob || null);
    setFileName(book.fileName || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    deleteBook(id);
    if (editingId === id) resetForm();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileBlob(file);
    const name = file.name.toLowerCase();
    
    try {
      if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.tex')) {
        const text = await file.text();
        setContent(text);
      } else if (name.endsWith('.html') || name.endsWith('.xml') || name.endsWith('.fb2')) {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, (name.endsWith('.fb2') || name.endsWith('.xml')) ? 'text/xml' : 'text/html');
        const body = doc.getElementsByTagName("body")[0];
        setContent(body ? body.textContent || '' : text);
      } else if (name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setContent(result.value);
      } else if (name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + '\n\n';
        }
        setContent(fullText);
      } else if (name.endsWith('.epub')) {
        const zip = await JSZip.loadAsync(file);
        let fullText = '';
        const htmlFiles = [];
        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir && (relativePath.endsWith('.html') || relativePath.endsWith('.xhtml') || relativePath.endsWith('.htm'))) {
            htmlFiles.push(zipEntry);
          }
        });
        
        for (const entry of htmlFiles) {
          const htmlText = await entry.async('text');
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');
          const body = doc.getElementsByTagName("body")[0];
          fullText += (body ? body.textContent : '') + '\n\n';
        }
        setContent(fullText);
      } else {
        if (!content) {
          setContent(`Кешіріңіз, ${file.name.split('.').pop()?.toUpperCase()} форматынан мәтінді автоматты түрде шығару мүмкін болмады. Оның орнына мәтінді осында қолмен көшіріп қойыңыз.`);
        }
      }
    } catch (err) {
      console.error("Error parsing file:", err);
      if (!content) {
        setContent(`Файлды оқу кезінде қате кетті. Мәтінді қолмен енгізіңіз.`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author && coverUrl && content) {
      if (editingId) {
        updateBook(editingId, { title, author, genre, coverUrl, content, fileBlob, fileName });
      } else {
        addBook({ title, author, genre, coverUrl, content, fileBlob, fileName });
      }
      resetForm();
    }
  };

  const genres: Genre[] = ['Design', 'Psychology', 'Novels', 'Science', 'Fantasy', 'Other'];
  const genreTranslations: Record<Genre, string> = {
    'Design': 'Дизайн',
    'Psychology': 'Психология',
    'Novels': 'Романдар',
    'Science': 'Ғылым',
    'Fantasy': 'Фэнтези',
    'Other': 'Басқа'
  };

  return (
    <div className="p-6 pb-20 bg-gray-50 min-h-screen">
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <BookOpen className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{books.length}</p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">Кітаптар</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
            <Users className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">Пайдаланушы</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-2">
            <MessageSquare className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{comments.length}</p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">Пікірлер</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === 'books' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Кітаптар
          {activeTab === 'books' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Пайдаланушылар
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Пайдаланушыларды басқару</h2>
            <p className="text-sm text-gray-500 mt-1">Осы жерден пайдаланушыларға админ құқығын бере аласыз.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {allUsers.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {user.role === 'admin' ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 shadow-sm border border-yellow-300">
                      <Crown size={12} className="text-yellow-800" />
                      Админ
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      Пайдаланушы
                    </span>
                  )}
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {user.role === 'admin' ? 'Админ құқығын алу' : 'Админ ету'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Кітапты өңдеу' : 'Жаңа кітап қосу'}</h1>
          <p className="text-sm text-gray-500 mt-1">Кітапты жүктеп, барлық форматтарды қолданыңыз.</p>
        </div>
        {editingId && (
          <button onClick={resetForm} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <X size={16} /> Болдырмау
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-center mb-2">
          <div className="w-32 aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center relative shadow-sm">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-300" size={32} />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Кітап атауы</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            placeholder="Мысалы: Абай жолы"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Авторы</label>
          <input
            type="text"
            required
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            placeholder="Мысалы: Мұхтар Әуезов"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Жанр</label>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value as Genre)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none text-sm"
          >
            {genres.map(g => <option key={g} value={g}>{genreTranslations[g]}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Мұқаба суреті</label>
          <div className="flex gap-2 mb-2">
             <input
              type="url"
              required={!coverUrl}
              value={coverUrl.startsWith('data:') ? '' : coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="https://... немесе сурет жүктеңіз"
            />
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setCoverUrl(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors shrink-0"
              title="Сурет жүктеу"
            >
              <Upload size={18} />
            </button>
          </div>
          {coverUrl.startsWith('data:') && (
            <div className="text-xs text-green-600 flex items-center justify-between">
              Сурет сәтті жүктелді 
              <button type="button" onClick={() => setCoverUrl('')} className="text-red-500 ml-2">Өшіру</button>
            </div>
          )}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Кітап файлы (кез-келген формат)</label>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl border border-blue-100 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Upload size={18} />
              {fileName ? 'Файлды ауыстыру' : 'Файл таңдау'}
            </button>
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-3 rounded-xl flex-1 truncate">
                <FileIcon size={16} className="flex-shrink-0" />
                <span className="truncate">{fileName}</span>
                <button type="button" onClick={() => { setFileBlob(null); setFileName(''); }} className="ml-auto text-gray-400 hover:text-red-500"><X size={16}/></button>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".epub,.docx,.doc,.pdf,.mobi,.azw,.azw3,.kfx,.fb2,.rtf,.txt,.odt,.html,.md,.tex,.xml,.cbz,.cbr"
          />
          <p className="text-xs text-gray-500 mt-2">Қолдау көрсетілетін форматтар: EPUB, DOCX, PDF, MOBI, FB2, TXT, MD, т.б.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Мәтіні (немесе сипаттамасы)</label>
          <textarea
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none font-mono text-sm"
            placeholder="Мәтін..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          {editingId ? <Edit2 size={20} /> : <PlusCircle size={20} />}
          {editingId ? 'Өзгерістерді сақтау' : 'Кітапты жүктеу'}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Барлық кітаптар</h2>
        <div className="space-y-4">
          {books.map(book => (
            <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded-md bg-gray-100" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 truncate">{book.author}</p>
                {book.fileName && <p className="text-xs text-blue-500 mt-1 flex items-center gap-1"><FileIcon size={12}/> {book.fileName}</p>}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(book)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <p className="text-center text-gray-500 py-8">Кітаптар әлі қосылмаған.</p>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
