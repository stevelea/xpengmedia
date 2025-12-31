// Audit complet de cohérence des services
const fs = require('fs');

console.log('🔍 AUDIT DE COHÉRENCE DES SERVICES\n');

const content = fs.readFileSync('src/data/platforms.ts', 'utf8');

// Extraire tous les services avec leurs propriétés
const serviceRegex = /{\s*id: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?description: '([^']+)',[\s\S]*?url: '([^']+)',[\s\S]*?icon: '[^']*',[\s\S]*?availability: \[([^\]]+)\]/g;

let match;
const services = [];

while ((match = serviceRegex.exec(content)) !== null) {
  const availabilityStr = match[5].replace(/'/g, '').replace(/\s/g, '');
  services.push({
    id: match[1],
    name: match[2],
    description: match[3],
    url: match[4],
    availability: availabilityStr.split(',')
  });
}

console.log(`📊 Total: ${services.length} services analysés\n`);

// Problèmes identifiés
const issues = [];

// 1. Services avec availability incohérente
console.log('🔍 ANALYSE DES INCOHÉRENCES:\n');

services.forEach(service => {
  // Vérifier si le nom/description indique une région spécifique
  // mais availability est trop large ou incorrecte
  
  const name = service.name.toLowerCase();
  const desc = service.description.toLowerCase();
  const avail = service.availability;
  
  // Services français mal configurés
  if ((name.includes('france') || name.includes('français') || 
       desc.includes('français') || desc.includes('france')) &&
      !avail.includes('france') && !avail.includes('western_europe')) {
    issues.push({
      service: service.name,
      problem: 'Service français sans availability France',
      current: avail.join(', '),
      suggested: 'france ou western_europe'
    });
  }
  
  // Services européens spécifiques sans bonne availability
  if ((name.includes('germany') || name.includes('deutsch') || desc.includes('allemand')) &&
      !avail.includes('germany') && !avail.includes('northern_europe')) {
    issues.push({
      service: service.name,
      problem: 'Service allemand sans availability Germany',
      current: avail.join(', '),
      suggested: 'germany ou northern_europe'
    });
  }
  
  // Services UK mal configurés
  if ((name.includes('bbc') || name.includes('itv') || name.includes('uk') ||
       desc.includes('britannique') || desc.includes('british')) &&
      !avail.includes('uk') && !avail.includes('anglophone')) {
    issues.push({
      service: service.name,
      problem: 'Service UK sans availability UK',
      current: avail.join(', '),
      suggested: 'uk ou anglophone'
    });
  }
  
  // Services chinois mal configurés
  if ((name.includes('bilibili') || name.includes('iqiyi') || name.includes('douyin') ||
       name.includes('qq') || name.includes('tencent') || desc.includes('chinois') ||
       desc.includes('china')) &&
      !avail.includes('china') && !avail.includes('asia')) {
    issues.push({
      service: service.name,
      problem: 'Service chinois sans availability China',
      current: avail.join(', '),
      suggested: 'china ou asia'
    });
  }
  
  // Services avec 'europe' trop large
  if (avail.includes('europe') && avail.length === 1) {
    // Vérifier si c'est vraiment pan-européen
    if (name.includes('france') || name.includes('germany') || 
        name.includes('spain') || name.includes('italy')) {
      issues.push({
        service: service.name,
        problem: 'Availability "europe" trop large pour service national',
        current: avail.join(', '),
        suggested: 'Spécifier le pays exact'
      });
    }
  }
  
  // URLs qui ne fonctionnent pas (détection basique)
  if (service.url.includes('example.com') || service.url === 'https://') {
    issues.push({
      service: service.name,
      problem: 'URL invalide ou placeholder',
      current: service.url,
      suggested: 'Vérifier et corriger l\'URL'
    });
  }
});

// Afficher les problèmes
if (issues.length > 0) {
  console.log(`❌ ${issues.length} INCOHÉRENCES TROUVÉES:\n`);
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.service}`);
    console.log(`   Problème: ${issue.problem}`);
    console.log(`   Actuel: ${issue.current}`);
    console.log(`   Suggestion: ${issue.suggested}\n`);
  });
} else {
  console.log('✅ Aucune incohérence majeure détectée!\n');
}

// Sauvegarder rapport
fs.writeFileSync('coherence-report.json', JSON.stringify({
  totalServices: services.length,
  issuesFound: issues.length,
  issues: issues
}, null, 2));

console.log('💾 Rapport sauvegardé: coherence-report.json');

// Services spécifiques mentionnés par l'utilisateur
console.log('\n🎯 VÉRIFICATION SERVICES SPÉCIFIQUES:\n');

const tvmucho = services.find(s => s.id === 'tvmucho');
if (tvmucho) {
  console.log('📺 TVMucho:');
  console.log(`   URL: ${tvmucho.url}`);
  console.log(`   Availability: ${tvmucho.availability.join(', ')}`);
  console.log(`   Description: ${tvmucho.description}`);
}

// Chercher EDF
const edf = services.find(s => s.name.toLowerCase().includes('edf') || s.id.includes('edf'));
if (edf) {
  console.log('\n⚡ EDF trouvé:');
  console.log(`   ID: ${edf.id}`);
  console.log(`   URL: ${edf.url}`);
  console.log(`   Availability: ${edf.availability.join(', ')}`);
  console.log(`   Description: ${edf.description}`);
} else {
  console.log('\n❓ EDF non trouvé dans la base');
}
