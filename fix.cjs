const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace the end part with properly balanced tags.
const fixedEnd = `
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}`;

content = content.replace(/          \)\}        <\/div>      <\/div>      <\/>      \)\}    <\/div>  \);}/, fixedEnd);
fs.writeFileSync('src/pages/Admin.tsx', content);
