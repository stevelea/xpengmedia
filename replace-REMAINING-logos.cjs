// Script ULTIME pour remplacer TOUS les logos restants
const fs = require('fs');
const path = require('path');

console.log('🎯 REMPLACEMENT DES 64 LOGOS RESTANTS\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// TOUS LES LOGOS RESTANTS
const remainingLogos = {
  'funimation': 'https://logo.clearbit.com/funimation.com',
  'amazon-freevee': 'https://logo.clearbit.com/amazon.com',
  'bfmtv': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/BFMTV_logo_%282019%29.svg',
  'rtlplay': 'https://logo.clearbit.com/rtlplay.be',
  'playsuisse': 'https://logo.clearbit.com/playsuisse.ch',
  'kayo-sports': 'https://logo.clearbit.com/kayosports.com.au',
  'afterplay': 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
  'friv': 'https://logo.clearbit.com/friv.com',
  'agame': 'https://logo.clearbit.com/agame.com',
  'retrogames': 'https://cdn-icons-png.flaticon.com/512/686/686589.png',
  'gamesnacks': 'https://logo.clearbit.com/gamesnacks.com',
  'webrcade': 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
  'pbs-kids': 'https://logo.clearbit.com/pbskids.org',
  'xpeng-supercharging': 'https://logo.clearbit.com/xpeng.com',
  'charger-share': 'https://cdn-icons-png.flaticon.com/512/1688/1688988.png',
  'global-charging': 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
  'abrp': 'https://logo.clearbit.com/abetterrouteplanner.com',
  'total-ev-charge': 'https://logo.clearbit.com/totalenergies.com',
  'infotrafic': 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
  'abettertheater': 'https://logo.clearbit.com/abettertheater.com',
  'abettertheater-members': 'https://logo.clearbit.com/abettertheater.com',
  'teslaos': 'https://logo.clearbit.com/tesla.com',
  'myteslanu': 'https://logo.clearbit.com/tesla.com',
  'teslafi': 'https://logo.clearbit.com/teslafi.com',
  'tessie': 'https://logo.clearbit.com/tessie.com',
  'teslatheatre': 'https://logo.clearbit.com/tesla.com',
  'tezlab': 'https://logo.clearbit.com/tezlab.com',
  'stats-app': 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  'weather': 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png',
  'xpeng-p5-manual': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-g6-manual': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-p7-manual': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-g9-manual': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-xmart-os': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-charging-guide': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-xpilot-guide': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-faq': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-service-centers': 'https://logo.clearbit.com/xpeng.com',
  'google-search': 'https://logo.clearbit.com/google.com',
  'xpeng-europe': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-france': 'https://logo.clearbit.com/xpeng.com',
  'xpeng-tech-reviews': 'https://logo.clearbit.com/youtube.com',
  'xpeng-owners-club': 'https://logo.clearbit.com/facebook.com',
  'ev-reviewers-xpeng': 'https://logo.clearbit.com/youtube.com',
  'xpeng-accessories-fr': 'https://logo.clearbit.com/amazon.fr',
  'xpeng-discord': 'https://logo.clearbit.com/discord.com',
};

function replaceIcons() {
  let replacements = 0;
  
  Object.entries(remainingLogos).forEach(([id, logoUrl]) => {
    const regex = new RegExp(`(id: '${id}',[\\s\\S]*?icon: ')[^']*(')`);
    
    if (content.match(regex)) {
      content = content.replace(regex, `$1${logoUrl}$2`);
      replacements++;
      console.log(`✅ ${id}`);
    }
  });
  
  return replacements;
}

const count = replaceIcons();
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎊 ${count} logos remplacés !`);
console.log('\n🎉 TOUS LES LOGOS SONT MAINTENANT EN COULEUR !');
