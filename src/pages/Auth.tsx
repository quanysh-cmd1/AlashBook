import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

function TelegramLoginWidget({ onAuth }: { onAuth: (user: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length === 0) {
      window.onTelegramAuth = (user) => {
        onAuth(user);
      };

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'AlashBook_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '20');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      
      containerRef.current.appendChild(script);
    }
  }, [onAuth]);

  return <div ref={containerRef} className="flex justify-center w-full min-h-[40px] items-center" />;
}

export function Auth() {
  const { login, signup } = useAppContext();
  
  // Steps: 'splash' -> 'auth'
  const [step, setStep] = useState<'splash' | 'auth'>('splash');
  const [isLogin, setIsLogin] = useState(false); // Default to signup as requested
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Барлық өрістерді толтырыңыз');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError('Электрондық пошта немесе құпия сөз қате');
      }
    } else {
      if (!email || !password) {
        setError('Барлық өрістерді толтырыңыз');
        return;
      }
      // Using part of email as name since Name field was omitted per design
      const name = email.split('@')[0];
      const success = signup(name, email, password);
      if (!success) {
        setError('Бұл электрондық пошта тіркелген');
      }
    }
  };

  const handleTelegramUserAuth = (user: any) => {
    const mockPassword = `tg_${user.id}_${user.auth_date}`;
    const mockEmail = `${user.username || user.id}@telegram.local`;
    
    const telegramUsername = user.username ? `@${user.username}` : undefined;
    const success = signup(user.first_name, mockEmail, mockPassword, telegramUsername);
    if (!success) {
      login(mockEmail, mockPassword, telegramUsername);
    }
  };

  return (
    <div className="h-full min-h-full bg-[#faf9f6] flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeInOut" } }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-center"
              >
                <h1 className="text-5xl font-bold tracking-tighter text-gray-900 mb-6 font-serif">
                  ALASH.
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                  className="text-4xl text-gray-600 font-handwriting tracking-wide max-w-[320px] leading-relaxed mx-auto"
                >
                  Кітап құмар қауымға қош келдіңіз!
                </motion.p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
              className="p-6 pb-12"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('auth')}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-full text-lg font-medium shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-colors hover:bg-black overflow-hidden relative"
              >
                Жалғастыру
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col px-8 py-12 justify-center"
          >
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 mb-4">
                  Қош келдіңіз!
                </h2>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  ALASH қауымдастығына қосылып, сүйікті кітаптарыңызды оқып, жеке кітапханаңызды қалыптастырыңыз. Жалғастыру үшін Telegram арқылы кіріңіз.
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <TelegramLoginWidget onAuth={handleTelegramUserAuth} />
                <button
                  onClick={() => {
                    const success = login('guest@alash.local', 'guest123');
                    if (!success) {
                      signup('Қонақ', 'guest@alash.local', 'guest123');
                    }
                  }}
                  className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-900 underline transition-colors"
                >
                  Әзірше телеграмсыз өту
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
