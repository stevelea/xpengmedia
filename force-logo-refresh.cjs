// FORCER LE RECHARGEMENT - Ajouter timestamp aux logos pour vider le cache
const fs = require('fs');
const path = require('path');

console.log('🔄 FORÇAGE DU RECHARGEMENT DES LOGOS\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Timestamp unique pour forcer le rechargement
const timestamp = Date.now();

// Remplacer TOUS les CDN par des versions avec timestamp
const cdnPatterns = [
  { pattern: /https:\/\/cdn\.simpleicons\.org\//g, replacement: `https://cdn.simpleicons.org/` },
  { pattern: /https:\/\/upload\.wikimedia\.org\//g, replacement: `https://upload.wikimedia.org/` },
  { pattern: /https:\/\/ui-avatars\.com\/api\//g, replacement: `https://ui-avatars.com/api/` },
];

// Ajouter ?v= timestamp à TOUTES les URLs d'icônes Simple Icons et Wikipedia
content = content.replace(
  /(icon: 'https:\/\/cdn\.simpleicons\.org\/[^']+)'/g,
  `$1?v=${timestamp}'`
);

content = content.replace(
  /(icon: 'https:\/\/upload\.wikimedia\.org\/[^']+)'/g,
  `$1?v=${timestamp}'`
);

content = content.replace(
  /(icon: 'https:\/\/ui-avatars\.com\/api\/[^']+)'/g,
  `$1&v=${timestamp}'`
);

fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ Timestamp ${timestamp} ajouté à tous les logos !`);
console.log('🔄 Le cache sera forcé de se rafraîchir !');
console.log('💯 Tous les nouveaux logos seront visibles !');
