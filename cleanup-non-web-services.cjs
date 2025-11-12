// Script pour identifier et supprimer les services NON-WEB (qui nécessitent installation)
const fs = require('fs');

console.log('🔍 AUDIT DES SERVICES NON-WEB\n');

const content = fs.readFileSync('src/data/platforms.ts', 'utf8');

// Services qui nécessitent installation (APK, app native) - À SUPPRIMER
const nonWebServices = [
  'iptv-smarters-pro',    // APK Android uniquement
  'tivimate',             // APK Android uniquement
  'gse-smart-iptv',       // App iOS/Android, pas de web
  'perfect-player',       // App Android uniquement
  'vlc-iptv',            // App desktop, pas de version web
  'kodi-iptv',           // App desktop, pas de version web
  'steam-link',          // App, pas web
  'shadow',              // App desktop, pas web pure
  'boosteroid',          // A une version web ? À vérifier
  'aircons',             // App uniquement
  'newgrounds',          // A une version web ✓
  'poki',                // Web ✓
  'miniclip',            // Web ✓
];

console.log('Services à supprimer (nécessitent installation) :');
nonWebServices.forEach(id => {
  const regex = new RegExp(`id: '${id}'`, 'g');
  if (content.match(regex)) {
    console.log(`❌ ${id}`);
  }
});

// Services qui ont des versions WEB à corriger
const webVersions = {
  // Gaming - Versions web
  'geforce-now': 'https://play.geforcenow.com',
  'xbox-cloud': 'https://www.xbox.com/play',
  'playstation-now': 'https://www.playstation.com/en-us/ps-plus/', // Remote Play web
  
  // Les autres sont déjà web-based
};

console.log('\n✅ Services WEB à garder :');
console.log('- Tous les streaming (Netflix, Disney+, etc.)');
console.log('- Tous les services musique avec web player');
console.log('- Gaming cloud qui ont version web');
console.log('- Tous les services web/social');
console.log('- Services de recharge (tous web)');
