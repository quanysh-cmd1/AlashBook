/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { AppProvider, useAppContext } from "./store";
import { Library } from "./pages/Library";
import { Catalog } from "./pages/Catalog";
import { MyShelf } from "./pages/MyShelf";
import { BookDetail } from "./pages/BookDetail";
import { Reader } from "./pages/Reader";
import { Admin } from "./pages/Admin";
import { Auth } from "./pages/Auth";
import { Author } from "./pages/Author";
import { Profile } from "./pages/Profile";
import {
  Settings,
  LogOut,
  Search,
  Library as LibraryIcon,
  UserCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`font-serif font-bold tracking-tight ${className}`}>
    Alash.
  </div>
);

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Show prompt for demo purposes after 2 seconds if not dismissed
    const dismissed = localStorage.getItem("galam_install_dismissed");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For demo/testing in preview, just show it anyway if not dismissed
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS or if prompt not available
      alert(
        'Орнату үшін браузер мәзірінен "Негізгі экранға қосу" (Add to Home Screen) таңдаңыз.',
      );
      setShow(false);
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("galam_install_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-top-4 duration-500 fade-in">
      <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-gray-800">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <Logo className="text-gray-900 text-sm" />
        </div>
        <div className="flex-1 min-w-0" onClick={handleInstall}>
          <h3 className="font-semibold text-sm">ALASH. орнату</h3>
          <p className="text-xs text-gray-300 mt-0.5 leading-tight">
            Қолданба жақсы жұмыс жасауы үшін негізгі экранға қосып алыңыз
          </p>
        </div>
        <button
          onClick={dismiss}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, logout } = useAppContext();
  const location = useLocation();
  const isReader = location.pathname.includes("/read/");

  if (!currentUser) {
    return (
      <div className="h-full w-full bg-gray-50 flex flex-col font-sans relative overflow-hidden">
        {!isReader && <InstallPrompt />}
        <main className="flex-1 overflow-y-auto bg-white relative">
          <Auth />
        </main>
      </div>
    );
  }

  


  return (
    <div className="h-full w-full bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      {!isReader && (
        <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 z-10">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            <Logo className="text-2xl" />
          </Link>
          <div className="flex items-center gap-4"></div>
        </header>
      )}

      <main
        className={`flex-1 flex flex-col min-h-0 relative ${isReader ? "bg-transparent overflow-hidden" : "bg-white overflow-y-auto"}`}
      >
        {children}
      </main>

      {!isReader && (
        <nav className="bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-safe flex justify-around items-center z-50 shrink-0">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 ${location.pathname === "/" || location.pathname === "/catalog" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Search size={22} />
            <span className="text-[10px] font-medium">Іздеу</span>
          </Link>
          <Link
            to="/shelf"
            className={`flex flex-col items-center gap-1 ${location.pathname === "/shelf" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LibraryIcon size={22} />
            <span className="text-[10px] font-medium">Сөрем</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 ${location.pathname === "/profile" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <UserCircle size={22} />
            <span className="text-[10px] font-medium">Профиль</span>
          </Link>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/shelf" element={<MyShelf />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/read/:id" element={<Reader />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/author/:name" element={<Author />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
