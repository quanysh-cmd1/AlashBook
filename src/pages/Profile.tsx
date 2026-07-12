import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../store";
import {
  User,
  Settings,
  Heart,
  Bookmark,
  Award,
  Clock,
  BookOpen,
  ChevronRight,
  Flame,
  Shield,
} from "lucide-react";

export function Profile() {
  const { currentUser, setCurrentUser, logout, books, readingDays } =
    useAppContext();

  const getStreak = () => {
    if (!readingDays || readingDays.length === 0) return 0;

    const sortedDays = [...readingDays].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const latestDay = new Date(sortedDays[0]);
    latestDay.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - latestDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return 0;
    }

    streak = 1;
    let prevDate = new Date(sortedDays[0]);
    prevDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sortedDays.length; i++) {
      const d = new Date(sortedDays[i]);
      d.setHours(0, 0, 0, 0);

      const diff = prevDate.getTime() - d.getTime();
      const diffD = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (diffD === 1) {
        streak++;
        prevDate = d;
      } else if (diffD === 0) {
      } else {
        break;
      }
    }
    return streak;
  };

  const streakCount = getStreak();

  const [activeTab, setActiveTab] = useState<
    "stats" | "favorites" | "readLater" | "admin"
  >("stats");

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6">
        <User size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 mb-6 text-center">
          Профильді көру үшін жүйеге кіріңіз
        </p>
        <Link
          to="/auth"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl"
        >
          Кіру немесе Тіркелу
        </Link>
      </div>
    );
  }

  const favoriteBooks = currentUser.favorites
    ? books.filter((b) => currentUser.favorites?.includes(b.id))
    : [];

  const readLaterBooks = currentUser.readLater
    ? books.filter((b) => currentUser.readLater?.includes(b.id))
    : [];

  const stats = currentUser.readingStats || { booksRead: 0, minutesRead: 0 };

  const hoursRead = Math.floor(stats.minutesRead / 60);
  const minutesRead = stats.minutesRead % 60;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {(currentUser.name || "Қ").charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between w-full pr-4">
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900 leading-tight"
                >
                  {currentUser.name || "Қолданушы"}
                </h1>
                <p className="text-sm font-medium text-blue-600/80">
                  {currentUser.telegramUsername || currentUser.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex bg-gray-100/50 p-1 rounded-xl mb-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "stats" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Статистика
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "favorites" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Сүйікті
          </button>
          <button
            onClick={() => setActiveTab("readLater")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "readLater" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Кейін
          </button>
          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${activeTab === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              <Shield
                size={14}
                className={
                  activeTab === "admin" ? "text-blue-600" : "text-gray-400"
                }
              />
              Әкімші
            </button>
          )}
        </div>

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Gamification Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <BookOpen size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.booksRead}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">
                  Оқылған кітап
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                  <Clock size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {hoursRead > 0
                    ? `${hoursRead}с ${minutesRead}м`
                    : `${minutesRead}м`}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">
                  Жұмсалған уақыт
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={18} className="text-yellow-500" />
                Жетістіктер
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      Алғашқы қадам
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Қосымшаға тіркелдіңіз
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 border p-4 rounded-xl shadow-sm ${(readingDays?.length || 0) >= 7 ? "bg-white border-yellow-200" : "bg-gray-50 border-gray-100 opacity-60"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${(readingDays?.length || 0) >= 7 ? "bg-orange-50" : "bg-gray-200"}`}
                  >
                    <span className="text-2xl">
                      {(readingDays?.length || 0) >= 7 ? "🔥" : "🔒"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      Аптаның үздік оқырманы
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Қатарынан 7 күн оқыған
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 border p-4 rounded-xl shadow-sm ${stats.booksRead >= 1 ? "bg-white border-purple-200" : "bg-gray-50 border-gray-100 opacity-60"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${stats.booksRead >= 1 ? "bg-purple-50" : "bg-gray-200"}`}
                  >
                    <span className="text-2xl">
                      {stats.booksRead >= 1 ? "📚" : "🔒"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      Кітапқұмар
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Алғашқы кітапты аяқтадыңыз
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {favoriteBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {favoriteBooks.map((book) => (
                  <Link key={book.id} to={`/book/${book.id}`} className="group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-sm bg-gray-100 relative mb-3 border border-gray-100">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500">
                        <Heart size={16} className="fill-current" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed mt-4">
                <Heart size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  Сүйікті кітаптар жоқ
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Кітап бетінде жүрекшені басып сақтаңыз
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "readLater" && (
          <div>
            {readLaterBooks.length > 0 ? (
              <div className="space-y-4">
                {readLaterBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-md shadow-sm"
                    />
                    <div className="flex-1 py-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {book.author}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-400 pr-2">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed mt-4">
                <Bookmark size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Тізім бос</p>
                <p className="text-sm text-gray-400 mt-1">
                  Кейін оқу үшін кітаптарды сақтап қойыңыз
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "admin" && currentUser?.role === "admin" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <Shield size={32} className="mx-auto text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Әкімші панелі</h3>
              <p className="text-sm text-gray-600 mb-4">
                Жүйеге кітап қосу және қолданушыларды басқару
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center justify-center bg-blue-600 text-white font-medium rounded-xl px-6 py-2.5 shadow-sm hover:bg-blue-700 transition-colors w-full"
              >
                Әкімші панеліне өту
              </Link>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Шығу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
