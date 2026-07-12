import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { Settings2, Moon, Sun, Type, Clock, PenTool, MessageSquare, X, ChevronLeft, Timer, Music, Bell, Play, Pause } from 'lucide-react';
import clsx from 'clsx';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';







const renderBionic = (children: React.ReactNode): React.ReactNode => {
  if (typeof children === 'string') {
    return children.split(/(\s+)/).map((word, i) => {
      if (/\s+/.test(word) || word.length === 0) return word;
      
      // Calculate how many letters to bold based on word length
      let boldLength = 1;
      if (word.length >= 8) boldLength = Math.ceil(word.length * 0.4);
      else if (word.length >= 4) boldLength = Math.ceil(word.length * 0.5);
      else if (word.length > 1) boldLength = 1;

      return (
        <span key={i} className="bionic-word">
          <strong>{word.slice(0, boldLength)}</strong>{word.slice(boldLength)}
        </span>
      );
    });
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => <React.Fragment key={i}>{renderBionic(child)}</React.Fragment>);
  }
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {}, renderBionic((children.props as any).children));
  }
  return children;
};

export function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, readerSettings, updateReaderSettings, readingProgress, updateReadingProgress, highlights, addHighlight, deleteHighlight, addReadingDay, updateReadingStats } = useAppContext();
  const [startTime] = useState<number>(Date.now());
  const [showSettings, setShowSettings] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [statsMode, setStatsMode] = useState<'time' | 'progress' | 'left'>('time');
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRemaining !== null && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerEnded(true);
      setTimerRemaining(null);
      setTimerDuration(null);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    }
    return () => clearInterval(interval);
  }, [timerRemaining]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Alash. фондық әуен',
            artist: 'ALASH.',
            artwork: [
              { src: '/logo.png', sizes: '512x512', type: 'image/png' }
            ]
          });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const startTimer = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTimerRemaining(minutes * 60);
    setShowTimerSettings(false);
  };
  
  const cancelTimer = () => {
    setTimerDuration(null);
    setTimerRemaining(null);
    setShowTimerSettings(false);
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateReadingStatsRef = useRef(updateReadingStats);
  useEffect(() => {
    updateReadingStatsRef.current = updateReadingStats;
  }, [updateReadingStats]);

  useEffect(() => {
    return () => {
      // Unmount logic to update time read
      const endTime = Date.now();
      const minutesSpent = Math.floor((endTime - startTime) / 60000);
      if (minutesSpent > 0 && updateReadingStatsRef.current) {
        updateReadingStatsRef.current(minutesSpent);
      }
    };
  }, [startTime]);

  useEffect(() => {
    addReadingDay();
  }, []);

  // Highlight state
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-yellow-200');
  const [activeHighlight, setActiveHighlight] = useState<any>(null); // any to avoid complex imports if not needed, or use Highlight


  const book = books.find(b => b.id === id);
  
  

  

  
  
  

  

  const CHUNK_SIZE = 5000;
  
  const textChunks = useMemo(() => {
    const text = book?.content || '';
    if (text.length <= CHUNK_SIZE) return [text];
    
    const paragraphs = text.split(/\n\s*\n/);
    const result = [];
    let currentChunk = '';
    for (const p of paragraphs) {
      if (currentChunk.length + p.length > CHUNK_SIZE && currentChunk.length > 0) {
        result.push(currentChunk);
        currentChunk = p;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + p;
      }
    }
    if (currentChunk) result.push(currentChunk);
    return result;
  }, [book?.content]);

  const [currentChunkIndex, setCurrentChunkIndex] = useState(() => {
     if (!id || !readingProgress[id]) return 0;
     const p = readingProgress[id];
     const maxIdx = Math.max(0, textChunks.length - 1);
     return Math.min(Math.floor(p * textChunks.length), maxIdx);
  });

  const goToNextChunk = () => {
    if (currentChunkIndex < textChunks.length - 1) {
      setCurrentChunkIndex(i => i + 1);
      updateReadingProgress(id!, (currentChunkIndex + 1) / textChunks.length);
      setTimeout(() => {
        window.scrollTo(0,0);
        if (containerRef.current) containerRef.current.scrollTo(0,0);
      }, 50);
    }
  };

  const goToPrevChunk = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(i => i - 1);
      updateReadingProgress(id!, (currentChunkIndex - 1) / textChunks.length);
      setTimeout(() => {
        window.scrollTo(0,0);
        if (containerRef.current) containerRef.current.scrollTo(0,0);
      }, 50);
    }
  };

  const currentProgress = id ? (readingProgress[id] || 0) : 0;

  
  // Calculate reading stats
  const totalWords = book ? book.content.trim().split(/\s+/).length : 0;
  const minutesToRead = Math.ceil(totalWords / 200); // 200 wpm average
  const minutesLeft = Math.max(1, Math.ceil(minutesToRead * (1 - currentProgress)));
  const percentComplete = Math.min(100, Math.round(currentProgress * 100));


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleSelection = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          let isInsideReader = false;
          if (container.nodeType === Node.TEXT_NODE) {
            isInsideReader = !!container.parentElement?.closest('.markdown-body');
          } else {
            isInsideReader = !!(container as HTMLElement).closest('.markdown-body');
          }
          
          if (isInsideReader) {
            const rect = range.getBoundingClientRect();
            setSelectionRect(rect);
            setSelectedText(selection.toString());
          } else {
            setSelectionRect(null);
          }
        } else {
          setSelectionRect(prev => showNoteInput ? prev : null);
        }
      }, 50);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      clearTimeout(timeoutId);
    };
  }, [showNoteInput]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Restore scroll position ONLY ON MOUNT
    if (currentProgress > 0) {
      setTimeout(() => {
        const chunkFraction = (currentProgress * textChunks.length) - currentChunkIndex;
        if (chunkFraction > 0 && chunkFraction < 1) {
          if (readerSettings.pagingMode === 'horizontal' && containerRef.current) {
            const container = containerRef.current;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            container.scrollTo(scrollWidth * chunkFraction, 0);
          } else {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo(0, docHeight * chunkFraction);
          }
        }
      }, 300);
    }
  }, [id, readerSettings.pagingMode]); // Run only on id or mode change

  useEffect(() => {
    const handleScroll = () => {
      if (!id) return;
      
      let chunkFraction = 0;
      if (readerSettings.pagingMode === 'horizontal' && containerRef.current) {
        const container = containerRef.current;
        const scrollX = container.scrollLeft;
        const scrollWidth = container.scrollWidth - container.clientWidth;
        if (scrollWidth > 0) {
          chunkFraction = scrollX / scrollWidth;
        }
      } else {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          chunkFraction = scrollY / docHeight;
        }
      }
      const overallProgress = (currentChunkIndex + chunkFraction) / textChunks.length;
      updateReadingProgress(id, overallProgress);
    };

    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleScroll();
      }, 500); 
    };

    const scrollTarget = readerSettings.pagingMode === 'horizontal' && containerRef.current ? containerRef.current : window;
    scrollTarget.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      scrollTarget.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [id, readerSettings.pagingMode, currentChunkIndex, textChunks.length]);

  useEffect(() => {
    if (!readerSettings.autoScrollSpeed) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // 0 to 10 speed mapping to pixels per second
      // e.g. speed 5 => 50 pixels per second
      const pixelsToScroll = (readerSettings.autoScrollSpeed * 15 * delta) / 1000;
      
      if (readerSettings.pagingMode === 'horizontal') {
        if (containerRef.current) {
          containerRef.current.scrollBy(pixelsToScroll, 0);
        }
      } else {
        window.scrollBy(0, pixelsToScroll);
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [readerSettings.autoScrollSpeed, readerSettings.pagingMode]);

  const handleScreenClick = (e: React.MouseEvent) => {
    setActiveHighlight(null);
    if (showSettings) {
      setShowSettings(false);
      return;
    }
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    
    // Middle 40% toggles settings/UI
    if (clickX > screenWidth * 0.3 && clickX < screenWidth * 0.7 && clientY > innerHeight * 0.2 && clientY < innerHeight * 0.8) {
      setShowUI(!showUI);
    } else if (readerSettings.pagingMode === 'horizontal') {
      // Horizontal paging via clicks
      if (containerRef.current) {
        const offset = containerRef.current.clientWidth;
        const scrollX = containerRef.current.scrollLeft;
        const scrollWidth = containerRef.current.scrollWidth - offset;
        
        if (clickX <= screenWidth * 0.3) {
          if (scrollX <= 5 && currentChunkIndex > 0) {
            goToPrevChunk();
            setTimeout(() => {
              if (containerRef.current) {
                const newOffset = containerRef.current.clientWidth;
                const newScrollWidth = containerRef.current.scrollWidth - newOffset;
                containerRef.current.scrollTo({ left: newScrollWidth, behavior: 'instant' });
              }
            }, 100);
          } else {
            containerRef.current.scrollBy({ left: -offset, behavior: 'smooth' });
          }
        } else {
          if (scrollX >= scrollWidth - 5 && currentChunkIndex < textChunks.length - 1) {
            goToNextChunk();
          } else {
            containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
          }
        }
      }
    } else {
      // Edge zones in vertical mode
      const isEdge = 
        clientX < innerWidth * 0.15 || 
        clientX > innerWidth * 0.85 ||
        clientY < innerHeight * 0.15 ||
        clientY > innerHeight * 0.85;

      if (!isEdge) {
        setShowUI(false);
      } else if (e.nativeEvent && (e.nativeEvent as PointerEvent).pointerType === 'mouse') {
        setShowUI(true);
      }
    }
  };

  useEffect(() => {
    // Hide UI initially after 2 seconds
    const timer = setTimeout(() => {
      setShowUI(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!id || !containerRef.current) return;
    
    const container = containerRef.current;

    // Remove existing marks to prevent duplicates/exponential growth on re-render
    const existingMarks = container.querySelectorAll('mark');
    existingMarks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      }
    });
    // Normalize text nodes to merge them back
    container.normalize();

    const currentHighlights = highlights.filter(h => h.bookId === id);
    if (currentHighlights.length === 0) return;
    
    currentHighlights.forEach(highlight => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      let node;
      const textToFind = highlight.text.trim();
      if (!textToFind || textToFind.length < 2) return;
      
      const nodesToReplace: {node: Text, index: number}[] = [];
      
      let matchCount = 0;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes(textToFind)) {
           nodesToReplace.push({node: node as Text, index: node.nodeValue.indexOf(textToFind)});
           matchCount++;
           if (matchCount >= 3) break; // Limit to 3 matches max to prevent freezing on common words
        }
      }
      
      nodesToReplace.forEach(({node, index}) => {
         const mark = document.createElement('mark');
         mark.className = `${highlight.color} bg-opacity-60 text-inherit rounded-sm cursor-pointer relative transition-colors active:bg-opacity-80`;
         mark.textContent = textToFind;
         
         if (highlight.note) {
            mark.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              // Deselect if any selection exists
              window.getSelection()?.removeAllRanges();
              setActiveHighlight(highlight);
            };
         }
         
         const text = node.nodeValue!;
         const beforeText = document.createTextNode(text.substring(0, index));
         const afterText = document.createTextNode(text.substring(index + textToFind.length));
         
         const parent = node.parentNode;
         if (parent && parent.nodeName !== 'MARK') {
           parent.insertBefore(beforeText, node);
           parent.insertBefore(mark, node);
           parent.insertBefore(afterText, node);
           parent.removeChild(node);
         }
      });
    });
  }, [highlights, id, readerSettings.theme, currentChunkIndex, textChunks.length]);

  // Edge swipe detection
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = Math.abs(endX - startX);
      const diffY = Math.abs(endY - startY);
      
      // If it's a significant swipe
      if (diffX > 40 || diffY > 40) {
        const { innerWidth, innerHeight } = window;
        const isEdgeStart = 
          startX < innerWidth * 0.15 || 
          startX > innerWidth * 0.85 ||
          startY < innerHeight * 0.15 ||
          startY > innerHeight * 0.85;
          
        if (isEdgeStart) {
          setShowUI(true);
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  if (!book) return <div className="p-6">Табылмады</div>;

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setSelectionRect(null);
    setShowNoteInput(false);
    setNoteText('');
  };

  const handleSaveHighlight = () => {
    if (!selectedText || !id) return;
    
    addHighlight({
      bookId: id,
      text: selectedText,
      color: selectedColor,
      note: noteText || undefined,
    });
    
    // We would need to implement DOM manipulation here if we wanted to color it immediately.
    // For now we'll just save it and close the popover.
    clearSelection();
  };

  const cycleTheme = () => {
    const themes: ('light' | 'sepia' | 'dark' | 'charcoal')[] = ['light', 'sepia', 'dark', 'charcoal'];
    const currentIndex = themes.indexOf(readerSettings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateReaderSettings({ theme: themes[nextIndex] });
  };

  const themeClasses = {
    light: 'bg-[#faf9f6] text-gray-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    dark: 'bg-black text-gray-300',
    charcoal: 'bg-gray-800 text-gray-200'
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const marginClasses = {
    narrow: 'px-4',
    medium: 'px-6',
    wide: 'px-10'
  };

  const markdownComponents = useMemo(() => ({
    p: ({node, children, ...props}: any) => <p className="whitespace-pre-wrap break-words break-anywhere" {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</p>,
    h1: ({node, children, ...props}: any) => <h1 className="break-words break-anywhere" {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h1>,
    h2: ({node, children, ...props}: any) => <h2 className="break-words break-anywhere" {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h2>,
    h3: ({node, children, ...props}: any) => <h3 className="break-words break-anywhere" {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h3>,
    li: ({node, children, ...props}: any) => <li className="break-words break-anywhere" {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</li>,
  }), [readerSettings.bionicReading]);

  const renderedMarkdown = useMemo(() => {
    return (
      <Markdown 
        key={readerSettings.bionicReading ? 'bionic' : 'normal'}
        remarkPlugins={[remarkBreaks]}
        components={markdownComponents}
      >
        {textChunks[currentChunkIndex]}
      </Markdown>
    );
  }, [textChunks, currentChunkIndex, readerSettings.bionicReading, markdownComponents]);

  return (
    <>
      <audio 
        ref={audioRef} 
        src="https://mp3tourl.com/audio/1783801178983-50435520-09aa-43fa-821c-d6596af6a76e.m4a"
        loop 
      />
<div 
      onClick={handleScreenClick}
      className={clsx(
      "transition-colors duration-300 flex flex-col relative w-full",
      readerSettings.pagingMode === 'horizontal' ? 'flex-1 overflow-hidden' : 'min-h-full',
      themeClasses[readerSettings.theme]
    )}>
      {/* Content */}
      <div 
        className={clsx(
          "prose max-w-none transition-all duration-300 cursor-pointer relative z-10 @container",
          readerSettings.pagingMode === 'horizontal' ? 'flex-1 w-full min-h-0' : `pb-32 ${marginClasses[readerSettings.margins]}`,
          fontClasses[readerSettings.fontFamily]
        )}
        style={{ fontSize: `${readerSettings.fontSize}px`, lineHeight: 1.8 }}
      >
        <div 
          ref={containerRef} 
          className={clsx(
            "prose-headings:font-bold prose-headings:mb-6 prose-p:mb-6 break-words whitespace-pre-wrap max-w-full",
            readerSettings.pagingMode === 'horizontal' ? 'horizontal-paging' : ''
          )}
          style={readerSettings.pagingMode === 'horizontal' ? {
            columnWidth: readerSettings.margins === 'narrow' ? 'calc(100cqw - 2rem)' : readerSettings.margins === 'medium' ? 'calc(100cqw - 3rem)' : 'calc(100cqw - 5rem)',
            columnGap: readerSettings.margins === 'narrow' ? '2rem' : readerSettings.margins === 'medium' ? '3rem' : '5rem',
            padding: readerSettings.margins === 'narrow' ? '4rem 1rem' : readerSettings.margins === 'medium' ? '4rem 1.5rem' : '4rem 2.5rem'
          } : undefined}
        >
          <div className={clsx(
            "text-center", 
            readerSettings.pagingMode === 'horizontal' ? 'pt-8 pb-12' : 'pt-16 pb-12'
          )}>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-3">{book.author}</p>
            <h1 className="text-3xl font-bold font-serif leading-tight max-w-[280px] mx-auto opacity-90">{book.title}</h1>
          </div>
          
          <div className="markdown-body whitespace-pre-wrap break-words w-full">
            {renderedMarkdown}
          </div>

          {/* Pagination or End of book marker */}
          <div className="mt-16 mb-20 text-center flex flex-col items-center justify-center transition-opacity break-inside-avoid" style={{ breakInside: 'avoid' }}>
            {textChunks.length > 1 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                {currentChunkIndex > 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToPrevChunk(); }}
                    className="px-6 py-2 border border-current rounded-full text-xs font-bold uppercase tracking-widest hover:bg-current hover:text-white dark:hover:text-black transition-colors"
                  >
                    Алдыңғы бөлім
                  </button>
                )}
                {currentChunkIndex < textChunks.length - 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToNextChunk(); }}
                    className="px-6 py-2 border border-current rounded-full text-xs font-bold uppercase tracking-widest hover:bg-current hover:text-white dark:hover:text-black transition-colors"
                  >
                    Келесі бөлім
                  </button>
                )}
              </div>
            )}
            
            {currentChunkIndex === textChunks.length - 1 && (
              <div className="opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-12 h-px bg-current mb-8 mx-auto"></div>
                <p className="font-serif italic text-xl mb-2">Аяқталды</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-8">{totalWords} сөз оқылды</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentChunkIndex(0);
                    if (readerSettings.pagingMode === 'horizontal' && containerRef.current) {
                      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    updateReadingProgress(id!, 0);
                  }}
                  className="px-6 py-2 border border-current rounded-full text-xs font-bold uppercase tracking-widest hover:bg-current hover:text-white dark:hover:text-black transition-colors mx-auto"
                >
                  Басынан бастау
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Popover */}
      {selectionRect && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[60] bottom-24 left-1/2 transform -translate-x-1/2 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {showNoteInput ? (
            <div className="bg-[#111111] text-white p-3 rounded-2xl flex flex-col gap-3 min-w-[250px] border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Жазба қосу</span>
                <button onClick={() => setShowNoteInput(false)} className="opacity-50 hover:opacity-100">
                  <X size={14} />
                </button>
              </div>
              <textarea 
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ойыңызбен бөлісіңіз..."
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm w-full outline-none resize-none focus:border-white/30 transition-colors"
                rows={3}
              />
              <button 
                onClick={handleSaveHighlight}
                className="bg-white text-black text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Сақтау
              </button>
            </div>
          ) : (
            <div className="bg-[#111111] text-white p-2 rounded-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
                {[
                  { bg: 'bg-yellow-200', border: 'border-yellow-400' },
                  { bg: 'bg-green-200', border: 'border-green-400' },
                  { bg: 'bg-blue-200', border: 'border-blue-400' },
                  { bg: 'bg-rose-200', border: 'border-rose-400' }
                ].map(color => (
                  <button
                    key={color.bg}
                    onClick={() => setSelectedColor(color.bg)}
                    className={clsx(
                      "w-6 h-6 rounded-full transition-transform hover:scale-110",
                      color.bg,
                      selectedColor === color.bg ? `border-2 ${color.border} scale-110` : 'border border-black/10'
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 pl-1 pr-2">
                <button 
                  onClick={() => setShowNoteInput(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                >
                  <MessageSquare size={16} />
                </button>
                <button 
                  onClick={handleSaveHighlight}
                  className="px-3 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors"
                >
                  Бояу
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Highlight Note Modal */}
      {activeHighlight && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[70] bottom-24 left-1/2 transform -translate-x-1/2 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="bg-[#111111] text-white p-4 rounded-2xl flex flex-col gap-3 min-w-[280px] max-w-[90vw] border border-white/10 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 mt-1">Жазба</span>
              <button onClick={() => setActiveHighlight(null)} className="opacity-50 hover:opacity-100 p-1 -mr-1 -mt-1">
                <X size={14} />
              </button>
            </div>
            <p className="text-sm font-serif italic border-l-2 pl-3 border-white/20 opacity-80 break-words">
              {activeHighlight.text}
            </p>
            <p className="text-base font-medium">
              {activeHighlight.note}
            </p>
          </div>
        </div>
      )}

      {/* Focus Mode Overlay */}
      <div className={clsx(
        "fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 ease-in-out",
        focusMode ? "opacity-100" : "opacity-0"
      )}>
        {readerSettings.pagingMode === 'horizontal' ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]"></div>
        ) : (
          <>
            {/* Top Fade */}
            <div 
              className="absolute top-0 left-0 right-0 h-[35vh] backdrop-blur-[6px] bg-gradient-to-b from-[#111111]/40 via-[#111111]/20 to-transparent dark:from-black/70 dark:via-black/40"
              style={{ maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}
            ></div>
            
            {/* Bottom Fade */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[45vh] backdrop-blur-[6px] bg-gradient-to-t from-[#111111]/40 via-[#111111]/20 to-transparent dark:from-black/70 dark:via-black/40"
              style={{ maskImage: 'linear-gradient(to top, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)' }}
            ></div>
          </>
        )}
      </div>

      {/* Top Navigation Bar */}
      <div className={clsx(
        "fixed top-0 left-0 right-0 p-4 z-40 transition-all duration-500 ease-in-out",
        showUI ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
      )}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate('/myshelf');
          }}
          className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-md hover:scale-105 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Bottom Right Minimalistic Info */}
      <div className={clsx(
        "fixed bottom-4 right-6 text-[10px] font-mono tracking-wider opacity-30 z-30 transition-all duration-500",
        showUI ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-40 translate-y-0"
      )}>
        Тараудың соңына дейін: {minutesLeft} минут
      </div>

      {/* Floating Bottom Bar */}
      <div className={clsx(
        "fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-40 w-auto transition-all duration-500 ease-in-out",
        showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}>
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111111] text-white rounded-[32px] p-1.5 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-md"
        >
          {/* Left: Stats */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setStatsMode(prev => prev === 'time' ? 'progress' : prev === 'progress' ? 'left' : 'time');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-full ml-1 hover:bg-white/10 transition-colors w-[85px] justify-center"
          >
            {statsMode === 'time' && <Clock size={12} className="opacity-70" />}
            <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">
              {statsMode === 'time' && time}
              {statsMode === 'progress' && `${percentComplete}%`}
              {statsMode === 'left' && `${minutesLeft} min`}
            </span>
          </button>
          
          {/* Middle: Read / Focus toggle */}
          <div className="flex items-center bg-[#222222] rounded-full p-0.5 mx-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setFocusMode(false); }}
              className={clsx(
                "px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm transition-all duration-300",
                !focusMode ? "bg-white text-black" : "text-gray-400 hover:text-white"
              )}>Read</button>
            <button 
              onClick={(e) => { e.stopPropagation(); setFocusMode(true); }}
              className={clsx(
                "px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300",
                focusMode ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
              )}>Focus</button>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-1 pr-0.5">
            <button onClick={() => setShowTimerSettings(true)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Timer size={14} className="opacity-90" />
            </button>
            <button onClick={toggleMusic} className={clsx("w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors", isMusicPlaying && "bg-white/20 text-blue-400 border-blue-400/30")}>
              {isMusicPlaying ? <Pause size={14} className="opacity-90" /> : <Music size={14} className="opacity-90" />}
            </button>
            <button onClick={cycleTheme} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Sun size={14} className="opacity-90" />
            </button>
            <button onClick={() => setShowSettings(true)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Type size={14} className="opacity-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Bottom Sheet */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={clsx(
        "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white text-gray-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50 overflow-y-auto max-h-[80vh]",
        showSettings ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10">
            <h3 className="font-bold text-sm tracking-widest uppercase">Оқу параметрлері</h3>
            <button onClick={() => setShowSettings(false)} className="text-gray-400 p-2 -mr-2">✕</button>
          </div>

          {/* Theme */}
          <div className="mb-8">
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Түс (Tone)</h4>
            <div className="flex gap-2">
              {[
                { id: 'light', name: 'Ашық', bg: 'bg-white text-black border-gray-200' },
                { id: 'sepia', name: 'Сарғыш', bg: 'bg-[#f4ecd8] text-[#5b4636] border-[#e6dcc6]' },
                { id: 'dark', name: 'Қараңғы', bg: 'bg-black text-gray-300 border-black' },
                { id: 'charcoal', name: 'Сұр', bg: 'bg-gray-800 text-gray-200 border-gray-800' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateReaderSettings({ theme: theme.id as any })}
                  className={clsx(
                    "flex-1 py-3 px-1 rounded-xl border-2 transition-all text-xs font-medium flex flex-col items-center gap-2",
                    readerSettings.theme === theme.id ? "border-blue-500 scale-105 shadow-sm" : "border-transparent",
                  )}
                >
                  <div className={clsx("w-6 h-6 rounded-full border", theme.bg)}></div>
                  <span className="text-gray-700">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-8">
             <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Қаріп өлшемі</h4>
            <div className="flex items-center gap-4">
              <Type size={16} className="text-gray-400" />
              <input 
                type="range" 
                min="14" max="28" 
                value={readerSettings.fontSize}
                onChange={(e) => updateReaderSettings({ fontSize: parseInt(e.target.value) })}
                className="flex-1 accent-blue-600"
              />
              <Type size={24} className="text-gray-400" />
            </div>
          </div>

          {/* Font Family */}
          <div className="mb-8">
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Қаріп (Font)</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => updateReaderSettings({ fontFamily: 'sans' })}
                className={clsx(
                  "flex-1 py-2 px-2 rounded-xl border font-sans text-sm",
                  readerSettings.fontFamily === 'sans' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
                )}
              >
                Қазіргі
              </button>
              <button 
                onClick={() => updateReaderSettings({ fontFamily: 'serif' })}
                className={clsx(
                  "flex-1 py-2 px-2 rounded-xl border font-serif text-sm",
                  readerSettings.fontFamily === 'serif' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
                )}
              >
                Классика
              </button>
              <button 
                onClick={() => updateReaderSettings({ fontFamily: 'mono' })}
                className={clsx(
                  "flex-1 py-2 px-2 rounded-xl border font-mono text-sm",
                  readerSettings.fontFamily === 'mono' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
                )}
              >
                Машина
              </button>
            </div>
          </div>

          {/* Margins */}
          <div className="mb-8">
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Шеттер (Margins)</h4>
            <div className="flex gap-2">
              {[
                { id: 'narrow', label: 'Тар' },
                { id: 'medium', label: 'Орташа' },
                { id: 'wide', label: 'Кең' }
              ].map(margin => (
                 <button 
                  key={margin.id}
                  onClick={() => updateReaderSettings({ margins: margin.id as any })}
                  className={clsx(
                    "flex-1 py-2 px-2 rounded-xl border text-sm",
                    readerSettings.margins === margin.id ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
                  )}
                >
                  {margin.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Modes */}
          <div className="mb-4 space-y-4">
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Көлденең парақтау (Swipe)</h4>
                  <p className="text-xs text-gray-500 mt-1">Оңнан солға қарай сырғытып оқу</p>
                </div>
                <button 
                  onClick={() => updateReaderSettings({ pagingMode: readerSettings.pagingMode === 'vertical' ? 'horizontal' : 'vertical' })}
                  className={clsx(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    readerSettings.pagingMode === 'horizontal' ? "bg-blue-600" : "bg-gray-300"
                  )}
                >
                  <div className={clsx(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform duration-300",
                    readerSettings.pagingMode === 'horizontal' ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
             </div>

             <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Авто-айналдыру (Титр)</h4>
                    <p className="text-xs text-gray-500 mt-1">Жылдамдық: {readerSettings.autoScrollSpeed === 0 ? 'Өшірулі' : readerSettings.autoScrollSpeed}</p>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" 
                  value={readerSettings.autoScrollSpeed || 0}
                  onChange={(e) => updateReaderSettings({ autoScrollSpeed: parseInt(e.target.value) })}
                  className="w-full accent-blue-600"
                />
             </div>

             <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Динамикалық типография</h4>
                  <p className="text-xs text-gray-500 mt-1">Bionic Reading: сөздерді тез оқу режимі</p>
                </div>
                <button 
                  onClick={() => updateReaderSettings({ bionicReading: !readerSettings.bionicReading })}
                  className={clsx(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    readerSettings.bionicReading ? "bg-blue-600" : "bg-gray-300"
                  )}
                >
                  <div className={clsx(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform duration-300",
                    readerSettings.bionicReading ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Timer Settings */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50",
          showTimerSettings ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-widest uppercase">Фокус таймері</h3>
            <button onClick={() => setShowTimerSettings(false)} className="text-gray-400 p-2 -mr-2">✕</button>
          </div>
          
          <div className="flex gap-3 mb-6">
            <button onClick={() => startTimer(15)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center hover:border-blue-500 hover:text-blue-500 transition-colors">
              <span className="text-2xl font-bold mb-1">15</span>
              <span className="text-xs uppercase tracking-wider text-gray-500">мин</span>
            </button>
            <button onClick={() => startTimer(30)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center hover:border-blue-500 hover:text-blue-500 transition-colors">
              <span className="text-2xl font-bold mb-1">30</span>
              <span className="text-xs uppercase tracking-wider text-gray-500">мин</span>
            </button>
            <button onClick={() => startTimer(60)} className="flex-1 py-4 border rounded-2xl flex flex-col items-center border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <span className="text-2xl font-bold mb-1">1</span>
              <span className="text-xs uppercase tracking-wider opacity-70">сағат</span>
            </button>
          </div>
          
          {timerRemaining !== null && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
              <p className="text-sm text-gray-500 mb-1">Қалған уақыт:</p>
              <p className="text-3xl font-mono font-bold text-blue-600">{formatTime(timerRemaining)}</p>
              <button onClick={cancelTimer} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600">Болдырмау</button>
            </div>
          )}
        </div>
      </div>

      {/* Timer Ended Modal */}
      {timerEnded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="text-6xl mb-4 animate-bounce">
              ⏰
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Таймер бітті!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Сіз жоспарлаған оқу уақытыңызды сәтті аяқтадыңыз. Жарайсыз!</p>
            <button 
              onClick={() => setTimerEnded(false)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold tracking-wide hover:bg-blue-700 transition-colors"
            >
              ЖАЛҒАСТЫРУ
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 max-w-md mx-auto"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
    </>
  );}
