// AUDIT COMPLET de TOUS les services pour vérifier qu'ils sont WEB-ONLY
const fs = require('fs');

console.log('🔍 AUDIT COMPLET DE TOUS LES SERVICES\n');

const content = fs.readFileSync('src/data/platforms.ts', 'utf8');

// Extraire tous les services avec leurs URLs
const serviceRegex = /id: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?url: '([^']+)'/g;
let match;
const services = [];

while ((match = serviceRegex.exec(content)) !== null) {
  services.push({
    id: match[1],
    name: match[2],
    url: match[3]
  });
}

console.log(`📊 Total: ${services.length} services trouvés\n`);

// Catégoriser les services
const categories = {
  web: [],
  suspect: [],
  needsCheck: []
};

services.forEach(service => {
  const url = service.url.toLowerCase();
  
  // Services clairement WEB
  if (
    url.includes('/play') ||
    url.includes('web.') ||
    url.includes('online') ||
    url.includes('.com') && !url.includes('store.') &&
    !url.includes('download') &&
    !url.includes('apps/') &&
    !url.includes('.apk')
  ) {
    categories.web.push(service);
  }
  // Services suspects (stores, downloads)
  else if (
    url.includes('store.') ||
    url.includes('apps/') ||
    url.includes('download') ||
    url.includes('.apk')
  ) {
    categories.suspect.push(service);
  }
  // À vérifier
  else {
    categories.needsCheck.push(service);
  }
});

console.log('✅ SERVICES WEB CONFIRMÉS:');
console.log(`   ${categories.web.length} services\n`);

console.log('⚠️  SERVICES SUSPECTS (stores/downloads):');
if (categories.suspect.length > 0) {
  categories.suspect.forEach(s => {
    console.log(`   ❌ ${s.name} → ${s.url}`);
  });
} else {
  console.log('   Aucun service suspect trouvé ✅\n');
}

console.log('\n🔎 SERVICES À VÉRIFIER MANUELLEMENT:');
if (categories.needsCheck.length > 0) {
  categories.needsCheck.forEach(s => {
    console.log(`   ⚠️  ${s.name} (${s.id}) → ${s.url}`);
  });
  console.log(`\n   Total: ${categories.needsCheck.length} services à vérifier`);
} else {
  console.log('   Aucun service à vérifier ✅');
}

// Sauvegarder les résultats
const report = {
  total: services.length,
  web: categories.web.length,
  suspect: categories.suspect.length,
  needsCheck: categories.needsCheck.length,
  suspectServices: categories.suspect,
  needsCheckServices: categories.needsCheck
};

fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('\n💾 Rapport sauvegardé dans audit-report.json');
