// Audit de TOUS les logos pour trouver ceux qui ne chargent pas
const fs = require('fs');

console.log('🔍 AUDIT DES LOGOS CASSÉS\n');

const content = fs.readFileSync('src/data/platforms.ts', 'utf8');

// Extraire tous les services avec leurs icônes
const serviceRegex = /{\s*id: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?icon: '([^']+)'/g;
let match;
const services = [];

while ((match = serviceRegex.exec(content)) !== null) {
  services.push({
    id: match[1],
    name: match[2],
    icon: match[3]
  });
}

console.log(`📊 Total: ${services.length} services trouvés\n`);

// Catégoriser par type de source
const categories = {
  simpleIcons: [],
  clearbit: [],
  flaticon: [],
  wikipedia: [],
  other: []
};

services.forEach(service => {
  const icon = service.icon;
  
  if (icon.includes('simpleicons.org')) {
    categories.simpleIcons.push(service);
  } else if (icon.includes('clearbit.com')) {
    categories.clearbit.push(service);
  } else if (icon.includes('flaticon.com')) {
    categories.flaticon.push(service);
  } else if (icon.includes('wikipedia.org')) {
    categories.wikipedia.push(service);
  } else {
    categories.other.push(service);
  }
});

console.log('📈 RÉPARTITION PAR SOURCE:');
console.log(`   Simple Icons: ${categories.simpleIcons.length}`);
console.log(`   Clearbit: ${categories.clearbit.length}`);
console.log(`   Flaticon: ${categories.flaticon.length}`);
console.log(`   Wikipedia: ${categories.wikipedia.length}`);
console.log(`   Autres: ${categories.other.length}`);

console.log('\n⚠️  SOURCES POTENTIELLEMENT PROBLÉMATIQUES:\n');

// Clearbit peut ne pas avoir tous les logos
if (categories.clearbit.length > 0) {
  console.log(`❌ Clearbit (${categories.clearbit.length} services) - Peut avoir des logos manquants:`);
  categories.clearbit.slice(0, 10).forEach(s => {
    console.log(`   - ${s.name} (${s.id})`);
  });
  if (categories.clearbit.length > 10) {
    console.log(`   ... et ${categories.clearbit.length - 10} autres`);
  }
  console.log('');
}

// Autres sources suspectes
if (categories.other.length > 0) {
  console.log(`⚠️  Autres sources (${categories.other.length} services):`);
  categories.other.forEach(s => {
    console.log(`   - ${s.name}: ${s.icon.substring(0, 60)}...`);
  });
}

// Sauvegarder rapport
const report = {
  total: services.length,
  simpleIcons: categories.simpleIcons.length,
  clearbit: categories.clearbit.length,
  flaticon: categories.flaticon.length,
  wikipedia: categories.wikipedia.length,
  other: categories.other.length,
  clearbitServices: categories.clearbit.map(s => ({ id: s.id, name: s.name })),
  otherServices: categories.other.map(s => ({ id: s.id, name: s.name, icon: s.icon }))
};

fs.writeFileSync('broken-logos-report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('\n💾 Rapport sauvegardé: broken-logos-report.json');
