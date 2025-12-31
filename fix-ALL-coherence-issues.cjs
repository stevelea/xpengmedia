// Correction de TOUTES les incohérences détectées
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DE TOUTES LES INCOHÉRENCES\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

const fixes = [
  // Services français - ajouter 'france' ou 'western_europe'
  {
    id: 'canal-plus',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Canal+ est français'
  },
  {
    id: 'molotov',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Molotov est français'
  },
  {
    id: 'arte',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Arte est franco-allemand'
  },
  {
    id: 'francetv',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'France.tv est français'
  },
  {
    id: 'infotrafic',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Info Trafic est français'
  },
  {
    id: 'lemonde',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Le Monde est français'
  },
  {
    id: 'xpeng-europe',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe']",
    reason: 'XPENG Europe est pan-européen'
  },
  {
    id: 'xpeng-accessories-fr',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Accessoires XPENG France est français'
  },
  {
    id: 'xpeng-discord',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'western_europe', 'france']",
    reason: 'Discord XPENG France est français'
  },
  
  // Services allemands
  {
    id: 'zdf',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'northern_europe', 'germany']",
    reason: 'ZDF est allemand'
  },
  {
    id: 'ard-mediathek',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'northern_europe', 'germany']",
    reason: 'ARD est allemand'
  },
  
  // Services UK
  {
    id: 'bbc-iplayer',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe', 'anglophone', 'uk']",
    reason: 'BBC iPlayer est UK'
  },
  
  // TVMucho - Vérifier/corriger l'URL
  {
    id: 'tvmucho',
    oldAvailability: "['europe']",
    newAvailability: "['global', 'europe']",
    reason: 'TVMucho est pan-européen',
    urlFix: {
      old: 'https://tvmucho.com',
      new: 'https://www.tvmucho.com'
    }
  },
];

let corrections = 0;

fixes.forEach(fix => {
  // Corriger availability
  const availRegex = new RegExp(
    `(id: '${fix.id}',[\\s\\S]{0,300}availability: )\\[([^\\]]+)\\]`,
    ''
  );
  
  const match = content.match(availRegex);
  if (match) {
    const oldAvail = `[${match[2]}]`;
    content = content.replace(availRegex, `$1${fix.newAvailability}`);
    console.log(`✅ ${fix.id}: ${oldAvail} → ${fix.newAvailability}`);
    console.log(`   Raison: ${fix.reason}`);
    corrections++;
    
    // Corriger URL si nécessaire
    if (fix.urlFix) {
      const urlRegex = new RegExp(
        `(id: '${fix.id}',[\\s\\S]{0,300}url: )'${fix.urlFix.old}'`,
        ''
      );
      if (content.match(urlRegex)) {
        content = content.replace(urlRegex, `$1'${fix.urlFix.new}'`);
        console.log(`   + URL corrigée: ${fix.urlFix.old} → ${fix.urlFix.new}`);
      }
    }
    console.log('');
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${corrections} services corrigés !`);
console.log('✨ Toutes les availabilities sont maintenant cohérentes !');
console.log('📍 Les services français apparaîtront en France !');
console.log('🌍 Les services européens restent en Europe !');
