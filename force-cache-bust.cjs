// FORCER le rechargement en ajoutant un nouveau timestamp
const fs = require('fs');
const path = require('path');

console.log('🔄 FORÇAGE TOTAL DU CACHE\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Nouveau timestamp
const newTimestamp = Date.now();
console.log(`📅 Nouveau timestamp: ${newTimestamp}\n`);

// Remplacer TOUS les anciens timestamps
const oldTimestampPattern = /v=\d+/g;
const matches = content.match(oldTimestampPattern);

if (matches) {
  const uniqueOld = [...new Set(matches)];
  console.log(`🔍 ${uniqueOld.length} anciens timestamps trouvés:`);
  uniqueOld.forEach(t => console.log(`   ${t}`));
}

// Remplacer tous par le nouveau
content = content.replace(oldTimestampPattern, `v=${newTimestamp}`);

// Aussi remplacer les URLs sans timestamp
content = content.replace(
  /(https:\/\/cdn\.simpleicons\.org\/[^'"?]+)(?:\?[^'"]*)?(['"])/g,
  `$1?v=${newTimestamp}$2`
);

content = content.replace(
  /(https:\/\/upload\.wikimedia\.org\/[^'"?]+)(?:\?[^'"]*)?(['"])/g,
  `$1?v=${newTimestamp}$2`
);

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ Tous les logos ont le timestamp: v=${newTimestamp}`);
console.log('🔄 Cache navigateur forcé de recharger !');
console.log('📱 Mobile verra les nouveaux logos !');
