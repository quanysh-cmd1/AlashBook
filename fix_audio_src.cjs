const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

content = content.replace(
  /<audio \n        ref=\{audioRef\} \n        loop \n      >\n        <source src="https:\/\/actions\.google\.com\/sounds\/v1\/water\/rain_on_roof\.ogg" type="audio\/ogg" \/>\n        <source src="https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-Song-1\.mp3" type="audio\/mpeg" \/>\n      <\/audio>/,
  `<audio 
        ref={audioRef} 
        src="https://mp3tourl.com/audio/1783801178983-50435520-09aa-43fa-821c-d6596af6a76e.m4a"
        loop 
      />`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
