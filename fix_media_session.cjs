const fs = require('fs');
let content = fs.readFileSync('src/pages/Reader.tsx', 'utf8');

const oldToggle = `  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };`;

const newToggle = `  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Alash. фондық әуен',
            artist: 'ALASH.',
            artwork: [
              { src: '/logo.png', sizes: '512x512', type: 'image/png' }
            ]
          });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };`;

if(content.includes('const toggleMusic = () => {')) {
    content = content.replace(oldToggle, newToggle);
    fs.writeFileSync('src/pages/Reader.tsx', content);
    console.log("Updated toggleMusic");
} else {
    console.log("Could not find toggleMusic");
}
