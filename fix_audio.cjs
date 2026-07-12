const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

content = content.replace(
  /<audio \n        ref=\{audioRef\} \n        src="https:\/\/actions.google.com\/sounds\/v1\/water\/rain_on_roof.ogg" \n        loop \n      \/>/,
  `<audio 
        ref={audioRef} 
        loop 
      >
        <source src="https://actions.google.com/sounds/v1/water/rain_on_roof.ogg" type="audio/ogg" />
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>`
);

fs.writeFileSync('src/pages/Reader.tsx', content);
