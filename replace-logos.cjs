// Script pour remplacer tous les emojis par les vrais logos
const fs = require('fs');
const path = require('path');

// Mapping COMPLET avec logos de TOUTES sources (Simple Icons + alternatives)
const logoMapping = {
  // 🎬 Streaming Global - Simple Icons
  'apple-tv': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/appletv.svg',
  'disney-plus': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/disneyplus.svg',
  'hbo-max': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/hbo.svg',
  'netflix': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/netflix.svg',
  'paramount-plus': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/paramount.svg',
  'prime-video': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/primevideo.svg',
  'youtube': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/youtube.svg',
  'peacock': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/peacock.svg',
  'twitch': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/twitch.svg',
  'hulu': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/hulu.svg',
  'crunchyroll': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/crunchyroll.svg',
  'plex': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/plex.svg',
  'vimeo': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vimeo.svg',
  'dailymotion': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dailymotion.svg',
  
  // 🎬 Streaming - Logos supplémentaires
  'espn-plus': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/espn.svg',
  'dazn': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dazn.svg',
  'roku-channel': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/roku.svg',
  'showtime': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/showtime.svg',
  'starz': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/starz.svg',
  'pluto-tv': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pluto.svg',
  'tubi': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tubi.svg',
  'curiositystream': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/curiositystream.svg',
  'arte': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/arte.svg',
  
  // 🎵 Musique
  'spotify': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/spotify.svg',
  'apple-music': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/applemusic.svg',
  'youtube-music': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/youtubemusic.svg',
  'deezer': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/deezer.svg',
  'tidal': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tidal.svg',
  'amazon-music': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonmusic.svg',
  'soundcloud': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/soundcloud.svg',
  'qobuz': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/qobuz.svg',
  'pandora': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pandora.svg',
  'audiomack': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/audiomack.svg',
  'bandcamp': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/bandcamp.svg',
  'mixcloud': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/mixcloud.svg',
  'radio-garden': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/radio.svg',
  
  // 🎮 Gaming (IDs corrigés selon platforms.ts)
  'steam-link': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/steam.svg',
  'xbox-cloud': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/xbox.svg',
  'playstation-plus': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/playstation.svg',
  'nintendo-switch': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nintendoswitch.svg',
  'geforce-now': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nvidia.svg',
  'epic-games-store': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/epicgames.svg',
  'battle-net': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/battlenet.svg',
  'ea-play': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ea.svg',
  'ubisoft-connect': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ubisoft.svg',
  'gog-galaxy': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gog.svg',
  
  // 🌐 Web Services (IDs corrigés selon platforms.ts)
  'skype': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/skype.svg',
  'teams': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftteams.svg',
  'whatsapp-web': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/whatsapp.svg',
  'telegram-web': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/telegram.svg',
  'messenger': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/messenger.svg',
  'signal': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/signal.svg',
  'discord-web': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/discord.svg',
  'wechat-web': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/wechat.svg',
  'weibo': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/sinaweibo.svg',
  'xiaohongshu': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/xiaohongshu.svg',
  'bilibili': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/bilibili.svg',
  'douyin': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tiktok.svg',
  'iqiyi': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/iqiyi.svg',
  'qq-music': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tencentqq.svg',
  'netease-music': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/neteasemusic.svg',
  'alipay': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/alipay.svg',
  'taobao': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/taobao.svg',
  'jd': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/jd.svg',
  'baidu': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/baidu.svg',
  
  // 🔋 Recharge & Navigation
  'tesla-supercharger': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tesla.svg',
  'chargepoint': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/chargepoint.svg',
  'waze': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/waze.svg',
  'google-maps': 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlemaps.svg',
};

// Lire le fichier platforms.ts
const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Compter les remplacements
let replacements = 0;

// Remplacer chaque service qui a un logo disponible
for (const [serviceId, logoUrl] of Object.entries(logoMapping)) {
  // Pattern pour trouver le service et son icône
  const pattern = new RegExp(
    `(\\s+id:\\s*'${serviceId}',[\\s\\S]*?icon:\\s*)'[^']*'`,
    'g'
  );
  
  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, `$1'${logoUrl}'`);
    replacements += matches.length;
    console.log(`✅ ${serviceId}: Logo remplacé`);
  } else {
    console.log(`⏭️  ${serviceId}: Service non trouvé`);
  }
}

// Écrire le fichier modifié
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 Terminé ! ${replacements} logos remplacés sur ${Object.keys(logoMapping).length} services.`);
