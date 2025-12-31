// Script de refactorisation massive des catégories
const fs = require('fs');
const path = require('path');

console.log('🔧 Début de la refactorisation...\n');

// Lire le fichier
const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Renommer global-streaming en streaming-vod
console.log('📝 1. Renommer global-streaming → streaming-vod');
content = content.replace(/id: 'global-streaming'/g, "id: 'streaming-vod'");
content = content.replace(/Streaming international/g, 'Streaming & VOD');
content = content.replace(/Vos plateformes vidéo favorites accessibles partout/g, 'Films, séries, TV en direct et contenus à la demande');

// 2. Marquer free-tv pour fusion (on va le faire manuellement après)
console.log('📝 2. Identifier free-tv à fusionner');

// 3. Renommer quick-play en gaming
console.log('📝 3. Renommer quick-play → gaming');
content = content.replace(/id: 'quick-play'/g, "id: 'gaming'");
content = content.replace(/Jeux instantanés/g, 'Jeux & Divertissement');
content = content.replace(/Divertissement rapide pendant la recharge/g, 'Cloud gaming, jeux instantanés et divertissement familial');

// 4. Renommer web-services en web-social
console.log('📝 4. Renommer web-services → web-social');
content = content.replace(/id: 'web-services'/g, "id: 'web-social'");
content = content.replace(/Services Web & Productivité/g, 'Web, Social & Productivité');
content = content.replace(/Applications web populaires accessibles depuis votre XPENG/g, 'Email, messagerie, réseaux sociaux et applications web');

// 5. Marquer les catégories à supprimer/fusionner
const categoriesToRemoveOrMerge = [
  'free-tv',
  'europe', 
  'kids',
  'ev-entertainment',
  'ev-tools',
  'news-info',
  'shopping',
  'social-media'
];

console.log('📝 5. Catégories à traiter manuellement:');
categoriesToRemoveOrMerge.forEach(cat => {
  console.log(`   - ${cat}`);
});

// Écrire le fichier modifié
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ Refactorisation terminée !');
console.log('\n⚠️  ÉTAPES MANUELLES RESTANTES:');
console.log('1. Fusionner les plateformes de free-tv dans streaming-vod');
console.log('2. Fusionner les plateformes de europe dans streaming-vod');
console.log('3. Fusionner les plateformes de kids dans gaming');
console.log('4. Fusionner ev-entertainment + ev-tools → ev-tools');
console.log('5. Fusionner news-info + shopping + social-media → web-social');
console.log('6. Supprimer les catégories vides');
console.log('7. Tester et déployer');
