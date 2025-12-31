// Audit complet des logos - vérifier les URLs qui ne fonctionnent pas
const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('src/data/platforms.ts', 'utf8');

// Extraire tous les logos
const regex = /icon: '([^']+)'/g;
let match;
const logos = new Map();

while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  if (url.startsWith('http')) {
    logos.set(url, (logos.get(url) || 0) + 1);
  }
}

console.log(`🔍 ${logos.size} URLs uniques trouvées\n`);

// Vérifier chaque URL
let checked = 0;
let errors = 0;

logos.forEach((count, url) => {
  checked++;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('clearbit') || 
        urlObj.hostname.includes('wikipedia') || 
        urlObj.hostname.includes('flaticon')) {
      console.log(`✅ OK: ${url.substring(0, 60)}...`);
    } else {
      console.log(`⚠️  Vérifier: ${url}`);
    }
  } catch (e) {
    console.log(`❌ ERREUR: ${url}`);
    errors++;
  }
});

console.log(`\n📊 Total: ${checked} URLs, ${errors} erreurs potentielles`);
