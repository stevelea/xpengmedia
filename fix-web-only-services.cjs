// Correction des URLs pour pointer vers les versions WEB PLAYER uniquement
const fs = require('fs');
const path = require('path');

console.log('🌐 CORRECTION - VERSIONS WEB UNIQUEMENT\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Corrections d'URLs vers versions web player
const webPlayerUrls = {
  // Gaming Cloud - Versions WEB PLAYER
  'geforce-now': {
    url: 'https://play.geforcenow.com',
    description: 'Cloud gaming NVIDIA accessible depuis votre navigateur.',
  },
  'xbox-cloud': {
    url: 'https://www.xbox.com/play',
    description: 'Xbox Cloud Gaming - Jouez via navigateur avec Game Pass Ultimate.',
  },
  'boosteroid': {
    url: 'https://cloud.boosteroid.com',
    description: 'Cloud gaming européen accessible via navigateur web.',
  },
};

let corrections = 0;

Object.entries(webPlayerUrls).forEach(([id, data]) => {
  // Corriger l'URL
  const urlRegex = new RegExp(`(id: '${id}',[\\s\\S]*?url: ')[^']*(')`);
  if (content.match(urlRegex)) {
    content = content.replace(urlRegex, `$1${data.url}$2`);
    corrections++;
    console.log(`✅ ${id} → ${data.url}`);
  }
  
  // Corriger la description
  const descRegex = new RegExp(`(id: '${id}',[\\s\\S]*?description: ')[^']*(')`);
  if (content.match(descRegex)) {
    content = content.replace(descRegex, `$1${data.description}$2`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${corrections} services corrigés vers versions WEB !`);
console.log('\n✨ Tous les services sont maintenant accessibles via navigateur !');
