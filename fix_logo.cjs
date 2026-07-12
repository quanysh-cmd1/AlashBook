const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogo = `const Logo = ({ className = '' }: { className?: string }) => (
  <div className={\`flex items-baseline font-serif tracking-[0.15em] \${className}\`} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span className="mr-0.5">L</span>
    <span className="text-[1.1em] -mr-0.5">Λ</span>
    <span>SH</span>
    <span className="font-sans text-[1.2em] ml-0.5 -mt-1 font-bold">.</span>
  </div>
);`;

const newLogo = `const Logo = ({ className = '' }: { className?: string }) => (
  <span className={\`font-bold tracking-wider \${className}\`} style={{ letterSpacing: '0.1em' }}>
    ALASH.
  </span>
);`;

content = content.replace(oldLogo, newLogo);

// Also let's fix the Logo styling in the install prompt so it looks good.
// In the install prompt, it has <Logo className="text-gray-900 text-xs" />
// We can change it to <Logo className="text-gray-900 text-sm" />
content = content.replace(/<Logo className="text-gray-900 text-xs" \/>/g, '<Logo className="text-gray-900 text-sm" />');

fs.writeFileSync('src/App.tsx', content);
