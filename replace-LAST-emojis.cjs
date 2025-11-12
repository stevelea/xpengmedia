// Script FINAL pour éliminer les DERNIERS emojis
const fs = require('fs');
const path = require('path');

console.log('🎯 ÉLIMINATION DES 22 DERNIERS EMOJIS\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remplacements directs emoji → logo
const replacements = [
  ['🎬', 'https://cdn-icons-png.flaticon.com/512/3074/3074767.png'],
  ['📽️', 'https://cdn-icons-png.flaticon.com/512/2809/2809590.png'],
  ['1️⃣', 'https://upload.wikimedia.org/wikipedia/commons/d/da/TF1_logo_2013.svg'],
  ['🇧🇪', 'https://cdn-icons-png.flaticon.com/512/197/197583.png'],
  ['🇨🇭', 'https://cdn-icons-png.flaticon.com/512/197/197540.png'],
  ['🔟', 'https://logo.clearbit.com/network10.com.au'],
  ['🎤', 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png'],
  ['📻', 'https://cdn-icons-png.flaticon.com/512/639/639352.png'],
  ['☁️', 'https://cdn-icons-png.flaticon.com/512/414/414927.png'],
  ['🖥️', 'https://cdn-icons-png.flaticon.com/512/979/979585.png'],
  ['🎯', 'https://cdn-icons-png.flaticon.com/512/2919/2919805.png'],
  ['🦊', 'https://cdn-icons-png.flaticon.com/512/7443/7443976.png'],
  ['🧱', 'https://cdn-icons-png.flaticon.com/512/4360/4360686.png'],
  ['💰', 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png'],
  ['🌪️', 'https://cdn-icons-png.flaticon.com/512/4005/4005817.png'],
  ['🎭', 'https://cdn-icons-png.flaticon.com/512/2553/2553645.png'],
  ['📱', 'https://cdn-icons-png.flaticon.com/512/15047/15047587.png'],
  ['💼', 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'],
  ['📚', 'https://cdn-icons-png.flaticon.com/512/2702/2702134.png'],
  ['📦', 'https://cdn-icons-png.flaticon.com/512/3387/3387326.png'],
  ['📖', 'https://cdn-icons-png.flaticon.com/512/2702/2702154.png'],
  ['🚗', 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png'],
];

let count = 0;
replacements.forEach(([emoji, logoUrl]) => {
  const regex = new RegExp(`icon: '${emoji}'`, 'g');
  if (content.match(regex)) {
    content = content.replace(regex, `icon: '${logoUrl}'`);
    count++;
    console.log(`✅ Remplacé emoji: ${emoji}`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${count} emojis remplacés !`);
console.log('\n✨ VÉRIFICATION FINALE...');

// Vérifier s'il reste des emojis
const remainingEmojis = content.match(/icon: '[^h][^t]/g);
if (remainingEmojis) {
  console.log(`⚠️  Il reste ${remainingEmojis.length} emojis`);
} else {
  console.log('🎊 TOUS LES LOGOS SONT MAINTENANT EN COULEUR !!!');
}
