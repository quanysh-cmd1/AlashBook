const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const newImports = `import * as pdfjsLib from 'pdfjs-dist';\npdfjsLib.GlobalWorkerOptions.workerSrc = \`https://unpkg.com/pdfjs-dist@\${pdfjsLib.version}/build/pdf.worker.min.mjs\`;\n`;

code = code.replace(/import JSZip from 'jszip';/, "import JSZip from 'jszip';\n" + newImports);

const oldExtract = `const result = await mammoth.extractRawText({ arrayBuffer });`;
const newExtract = `const result = await mammoth.extractRawText({ arrayBuffer });`;

const epubBlock = `} else if (name.endsWith('.epub')) {`;
const newPdfBlock = `} else if (name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + '\\n\\n';
        }
        setContent(fullText);
      } else if (name.endsWith('.epub')) {`;

code = code.replace(epubBlock, newPdfBlock);

fs.writeFileSync('src/pages/Admin.tsx', code);
