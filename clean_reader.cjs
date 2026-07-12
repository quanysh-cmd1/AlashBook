const fs = require('fs');
let code = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

code = code.replace(/import \{ ReactReader \} from 'react-reader';\n/, '');

// Remove states for fileUrl and epubLocation
code = code.replace(/const \[fileUrl, setFileUrl\] = useState<string \| null>\(null\);/, '');
code = code.replace(/const \[epubLocation, setEpubLocation\] = useState<string \| number>\(0\);/, '');

// Remove useEffect for blob conversion
code = code.replace(/useEffect\(\(\) => \{\n\s*if \(book\?\.fileBlob\) \{\n\s*if \(book\.fileName\?\.endsWith\('\.epub'\) \|\| book\.fileName\?\.endsWith\('\.pdf'\)\) \{\n\s*const url = URL\.createObjectURL\(book\.fileBlob\);\n\s*setFileUrl\(url\);\n\s*return \(\) => URL\.revokeObjectURL\(url\);\n\s*\}\n\s*\}\n\s*\}, \[book\]\);/, '');

// Replace the content renderer
const newContent = `      {/* Content */}
      <div 
        className={clsx(
          "prose max-w-none transition-all duration-300 cursor-pointer relative z-10",
          readerSettings.pagingMode === 'horizontal' ? 'h-full' : 'pb-32',
          fontClasses[readerSettings.fontFamily],
          marginClasses[readerSettings.margins]
        )}
        style={{ fontSize: \`\${readerSettings.fontSize}px\`, lineHeight: 1.8 }}
      >
        <div ref={containerRef} className={clsx(
          "prose-headings:font-bold prose-headings:mb-6 prose-p:mb-6",
          readerSettings.pagingMode === 'horizontal' ? 'horizontal-paging' : ''
        )}>
          <div className={clsx(
            "text-center", 
            readerSettings.pagingMode === 'horizontal' ? 'pt-8 pb-12' : 'pt-16 pb-12'
          )}>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-3">{book.author}</p>
            <h1 className="text-3xl font-bold font-serif leading-tight max-w-[280px] mx-auto opacity-90">{book.title}</h1>
          </div>
          
          <Markdown 
            key={highlights.length + (readerSettings.bionicReading ? 'bionic' : 'normal')}
            components={{
              p: ({node, children, ...props}) => <p {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</p>,
              h1: ({node, children, ...props}) => <h1 {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h1>,
              h2: ({node, children, ...props}) => <h2 {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h2>,
              h3: ({node, children, ...props}) => <h3 {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</h3>,
              li: ({node, children, ...props}) => <li {...props}>{readerSettings.bionicReading ? renderBionic(children) : children}</li>,
            }}
          >
            {book.content}
          </Markdown>
        </div>
      </div>`;

code = code.replace(/\{\/\* Content \*\/\}[\s\S]*?(?=\{\/\* End of book marker \*\/\})/, newContent + '\n\n      ');

fs.writeFileSync('src/pages/Reader.tsx', code);
