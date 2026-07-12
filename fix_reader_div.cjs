const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

content = content.replace(
  /\{\/\* Content \*\/\}/,
  `<div 
      onClick={handleScreenClick}
      className={clsx(
      "transition-colors duration-300 flex flex-col relative w-full",
      readerSettings.pagingMode === 'horizontal' ? 'flex-1 overflow-hidden' : 'min-h-full',
      themeClasses[readerSettings.theme]
    )}>
      {/* Content */}`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
