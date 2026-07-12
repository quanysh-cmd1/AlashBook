const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf-8');

// Import updateReadingStats
content = content.replace(
  "const { books, readerSettings, updateReaderSettings, readingProgress, updateReadingProgress, highlights, addHighlight, deleteHighlight, addReadingDay } = useAppContext();",
  "const { books, readerSettings, updateReaderSettings, readingProgress, updateReadingProgress, highlights, addHighlight, deleteHighlight, addReadingDay, updateReadingStats } = useAppContext();\n  const [startTime] = useState<number>(Date.now());"
);

// Add unmount effect to update reading stats
content = content.replace(
  "useEffect(() => {",
  `useEffect(() => {
    return () => {
      // Unmount logic to update time read
      const endTime = Date.now();
      const minutesSpent = Math.floor((endTime - startTime) / 60000);
      if (minutesSpent > 0 && updateReadingStats) {
        updateReadingStats(minutesSpent);
      }
    };
  }, [startTime, updateReadingStats]);

  useEffect(() => {`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
