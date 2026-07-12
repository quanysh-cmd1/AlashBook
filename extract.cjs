const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const imports = `import mammoth from 'mammoth';
import JSZip from 'jszip';
`;
code = code.replace(/import \{ Book, Genre \} from '\.\.\/types';/, imports + `import { Book, Genre } from '../types';`);

const newHandleFileChange = `
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
          fullText += (body ? body.textContent : '') + '\\n\\n';
        }
        setContent(fullText);
      } else {
        if (!content) {
          setContent(\`Кешіріңіз, \${file.name.split('.').pop()?.toUpperCase()} форматынан мәтінді автоматты түрде шығару мүмкін болмады. Оның орнына мәтінді осында қолмен көшіріп қойыңыз.\`);
        }
      }
    } catch (err) {
      console.error("Error parsing file:", err);
      if (!content) {
        setContent(\`Файлды оқу кезінде қате кетті. Мәтінді қолмен енгізіңіз.\`);
      }
    }
  };
`;

code = code.replace(/const handleFileChange = [\s\S]*?const handleSubmit =/m, newHandleFileChange.trim() + '\n\n  const handleSubmit =');

fs.writeFileSync('src/pages/Admin.tsx', code);
