const fs = require('fs');
let content = fs.readFileSync('src/pages/Library.tsx', 'utf8');

content = content.replace(
  /import React, \{ useState, useMemo \} from 'react';/,
  "import React, { useState, useMemo, useEffect } from 'react';"
);

fs.writeFileSync('src/pages/Library.tsx', content);
