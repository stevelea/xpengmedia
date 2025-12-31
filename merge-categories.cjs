// Script de fusion massive des catégories
const fs = require('fs');
const path = require('path');

console.log('🔥 FUSION MASSIVE DES CATÉGORIES\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Sauvegarder une copie de backup
fs.writeFileSync(filePath + '.backup', content, 'utf8');
console.log('💾 Backup créé : platforms.ts.backup\n');

// Fonction pour extraire une catégorie complète
function extractCategory(content, categoryId) {
  const regex = new RegExp(`\\{\\s*id: '${categoryId}',[\\s\\S]*?\\},\\s*\\{\\s*id:`, 'g');
  const match = content.match(regex);
  if (match) {
    return match[0].replace(/,\s*\{\s*id:$/, '');
  }
  
  // Essayer de trouver la dernière catégorie d'un array
  const lastCatRegex = new RegExp(`\\{\\s*id: '${categoryId}',[\\s\\S]*?\\}\\s*\\];`, 'g');
  const lastMatch = content.match(lastCatRegex);
  if (lastMatch) {
    return lastMatch[0].replace(/\];$/, '');
  }
  
  return null;
}

// Fonction pour extraire uniquement les platforms d'une catégorie
function extractPlatforms(categoryText) {
  const platformsMatch = categoryText.match(/platforms:\s*\[([\s\S]*)\]/);
  if (platformsMatch) {
    return platformsMatch[1].trim();
  }
  return null;
}

// 1. Fusionner free-tv dans streaming-vod
console.log('📝 1. Fusion free-tv → streaming-vod');
const freeTvCat = extractCategory(content, 'free-tv');
if (freeTvCat) {
  const freeTvPlatforms = extractPlatforms(freeTvCat);
  if (freeTvPlatforms) {
    // Trouver la fin des platforms de streaming-vod
    const streamingVodEnd = content.indexOf("    ],\n  },\n  {\n    id: 'free-tv'");
    if (streamingVodEnd > -1) {
      // Insérer les platforms de free-tv avant la fermeture
      content = content.substring(0, streamingVodEnd) +
                ',\n      ' + freeTvPlatforms.split('\n').join('\n      ') +
                '\n' + content.substring(streamingVodEnd);
      console.log('   ✅ Platforms de free-tv ajoutés à streaming-vod');
    }
  }
  
  // Supprimer la catégorie free-tv
  content = content.replace(freeTvCat, '');
  content = content.replace(/,\s*\{\s*id: 'free-tv'[\s\S]*?\},\s*\{/, ',\n  {');
  console.log('   ✅ Catégorie free-tv supprimée');
} else {
  console.log('   ⚠️  Catégorie free-tv non trouvée');
}

console.log('\n📝 2. Fusion europe → streaming-vod');
// Similaire pour europe...

console.log('\n📝 3. Fusion kids → gaming');
// Similaire pour kids...

console.log('\n📝 4. Fusion learning → streaming-vod');
// Similaire pour learning...

// Nettoyer les doubles virgules et espaces
content = content.replace(/,(\s*),/g, ',');
content = content.replace(/\n\n\n+/g, '\n\n');

// Écrire le résultat
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ Fusion terminée !');
console.log('\n⚠️  VÉRIFIER:');
console.log('1. Compiler avec npm run build');
console.log('2. Si erreurs, restaurer avec: platforms.ts.backup');
console.log('3. Ajuster manuellement si nécessaire');
