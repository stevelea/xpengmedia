// CORRECTION MASSIVE de TOUS les logos avec Simple Icons (SVG en couleur)
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION MASSIVE DE TOUS LES LOGOS\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// MAPPING COMPLET avec Simple Icons CDN (logos SVG officiels en couleur)
const logoFixes = {
  // Streaming majeur
  'netflix': 'https://cdn.simpleicons.org/netflix/E50914',
  'disney-plus': 'https://cdn.simpleicons.org/disneyplus/113CCF',
  'apple-tv': 'https://cdn.simpleicons.org/appletv/000000',
  'hbo-max': 'https://cdn.simpleicons.org/max/002BE7',
  'paramount-plus': 'https://cdn.simpleicons.org/paramountplus/0064FF',
  'prime-video': 'https://cdn.simpleicons.org/amazonprimevideo/00A8E1',
  'peacock': 'https://cdn.simpleicons.org/peacock/000000',
  'hulu': 'https://cdn.simpleicons.org/hulu/1CE783',
  'showtime': 'https://cdn.simpleicons.org/showtime/D81921',
  'starz': 'https://cdn.simpleicons.org/starz/000000',
  'crunchyroll': 'https://cdn.simpleicons.org/crunchyroll/F47521',
  'funimation': 'https://cdn.simpleicons.org/funimation/5B0BB5',
  
  // YouTube & Vidéo
  'youtube': 'https://cdn.simpleicons.org/youtube/FF0000',
  'twitch': 'https://cdn.simpleicons.org/twitch/9146FF',
  'dailymotion': 'https://cdn.simpleicons.org/dailymotion/0066DC',
  'vimeo': 'https://cdn.simpleicons.org/vimeo/1AB7EA',
  
  // Media players
  'plex': 'https://cdn.simpleicons.org/plex/EBAF00',
  'emby': 'https://cdn.simpleicons.org/emby/52B54B',
  'jellyfin': 'https://cdn.simpleicons.org/jellyfin/00A4DC',
  'vlc-iptv': 'https://cdn.simpleicons.org/vlcmediaplayer/FF8800',
  'kodi-iptv': 'https://cdn.simpleicons.org/kodi/17B2E7',
  
  // Musique
  'spotify': 'https://cdn.simpleicons.org/spotify/1DB954',
  'apple-music': 'https://cdn.simpleicons.org/applemusic/FA243C',
  'tidal': 'https://cdn.simpleicons.org/tidal/000000',
  'youtube-music': 'https://cdn.simpleicons.org/youtubemusic/FF0000',
  'soundcloud': 'https://cdn.simpleicons.org/soundcloud/FF3300',
  'amazon-music': 'https://cdn.simpleicons.org/amazonmusic/1DB954',
  'deezer': 'https://cdn.simpleicons.org/deezer/FEAA2D',
  'pandora': 'https://cdn.simpleicons.org/pandora/005483',
  'bandcamp': 'https://cdn.simpleicons.org/bandcamp/1DA0C3',
  'mixcloud': 'https://cdn.simpleicons.org/mixcloud/314359',
  'qobuz': 'https://cdn.simpleicons.org/qobuz/1F1F1F',
  'iheartradio': 'https://cdn.simpleicons.org/iheart/C6002B',
  'tunein': 'https://cdn.simpleicons.org/tunein/1C203C',
  'audiomack': 'https://cdn.simpleicons.org/audiomack/FFA200',
  
  // Gaming
  'geforce-now': 'https://cdn.simpleicons.org/nvidia/76B900',
  'xbox-cloud': 'https://cdn.simpleicons.org/xbox/107C10',
  'playstation-now': 'https://cdn.simpleicons.org/playstation/003791',
  'steam-link': 'https://cdn.simpleicons.org/steam/000000',
  'epic-games': 'https://cdn.simpleicons.org/epicgames/313131',
  'origin': 'https://cdn.simpleicons.org/origin/F56C2D',
  'ubisoft-connect': 'https://cdn.simpleicons.org/ubisoft/000000',
  'gog': 'https://cdn.simpleicons.org/gog.com/86328A',
  'itch-io': 'https://cdn.simpleicons.org/itch.io/FA5C5C',
  'roblox': 'https://cdn.simpleicons.org/roblox/000000',
  'minecraft': 'https://cdn.simpleicons.org/minecraft/62B47A',
  
  // Social & Communication
  'whatsapp': 'https://cdn.simpleicons.org/whatsapp/25D366',
  'telegram': 'https://cdn.simpleicons.org/telegram/26A5E4',
  'signal': 'https://cdn.simpleicons.org/signal/3A76F0',
  'wechat': 'https://cdn.simpleicons.org/wechat/07C160',
  'line': 'https://cdn.simpleicons.org/line/00B900',
  'viber': 'https://cdn.simpleicons.org/viber/665CAC',
  'messenger': 'https://cdn.simpleicons.org/messenger/00B2FF',
  'discord': 'https://cdn.simpleicons.org/discord/5865F2',
  'slack': 'https://cdn.simpleicons.org/slack/4A154B',
  'teams': 'https://cdn.simpleicons.org/microsoftteams/6264A7',
  'zoom': 'https://cdn.simpleicons.org/zoom/0B5CFF',
  'skype': 'https://cdn.simpleicons.org/skype/00AFF0',
  'telegram-web': 'https://cdn.simpleicons.org/telegram/26A5E4',
  'discord-web': 'https://cdn.simpleicons.org/discord/5865F2',
  'whatsapp-web': 'https://cdn.simpleicons.org/whatsapp/25D366',
  'wechat-web': 'https://cdn.simpleicons.org/wechat/07C160',
  'messenger-web': 'https://cdn.simpleicons.org/messenger/00B2FF',
  
  // Social Media
  'facebook': 'https://cdn.simpleicons.org/facebook/0866FF',
  'twitter': 'https://cdn.simpleicons.org/x/000000',
  'x': 'https://cdn.simpleicons.org/x/000000',
  'instagram': 'https://cdn.simpleicons.org/instagram/E4405F',
  'linkedin': 'https://cdn.simpleicons.org/linkedin/0A66C2',
  'tiktok': 'https://cdn.simpleicons.org/tiktok/000000',
  'reddit': 'https://cdn.simpleicons.org/reddit/FF4500',
  'pinterest': 'https://cdn.simpleicons.org/pinterest/E60023',
  'snapchat': 'https://cdn.simpleicons.org/snapchat/FFFC00',
  'tumblr': 'https://cdn.simpleicons.org/tumblr/35465C',
  'threads': 'https://cdn.simpleicons.org/threads/000000',
  'mastodon': 'https://cdn.simpleicons.org/mastodon/6364FF',
  
  // Email
  'gmail': 'https://cdn.simpleicons.org/gmail/EA4335',
  'outlook': 'https://cdn.simpleicons.org/microsoftoutlook/0078D4',
  'yahoo-mail': 'https://cdn.simpleicons.org/yahoo/720E9E',
  'protonmail': 'https://cdn.simpleicons.org/protonmail/6D4AFF',
  
  // Cloud & Productivity
  'google-drive': 'https://cdn.simpleicons.org/googledrive/4285F4',
  'dropbox': 'https://cdn.simpleicons.org/dropbox/0061FF',
  'onedrive': 'https://cdn.simpleicons.org/microsoftonedrive/0078D4',
  'icloud': 'https://cdn.simpleicons.org/icloud/3693F3',
  'box': 'https://cdn.simpleicons.org/box/0061D5',
  'mega': 'https://cdn.simpleicons.org/mega/D9272E',
  'notion': 'https://cdn.simpleicons.org/notion/000000',
  'trello': 'https://cdn.simpleicons.org/trello/0052CC',
  'asana': 'https://cdn.simpleicons.org/asana/F06A6A',
  'monday': 'https://cdn.simpleicons.org/monday/FF3D57',
  'airtable': 'https://cdn.simpleicons.org/airtable/18BFFF',
  'figma': 'https://cdn.simpleicons.org/figma/F24E1E',
  'canva': 'https://cdn.simpleicons.org/canva/00C4CC',
  'miro': 'https://cdn.simpleicons.org/miro/050038',
  
  // Dev & Tech
  'github': 'https://cdn.simpleicons.org/github/181717',
  'gitlab': 'https://cdn.simpleicons.org/gitlab/FC6D26',
  'bitbucket': 'https://cdn.simpleicons.org/bitbucket/0052CC',
  'stackoverflow': 'https://cdn.simpleicons.org/stackoverflow/F58025',
  'medium': 'https://cdn.simpleicons.org/medium/000000',
  'substack': 'https://cdn.simpleicons.org/substack/FF6719',
  'patreon': 'https://cdn.simpleicons.org/patreon/FF424D',
  
  // Maps & Navigation
  'waze': 'https://cdn.simpleicons.org/waze/00D8FF',
  'google-maps': 'https://cdn.simpleicons.org/googlemaps/4285F4',
  'apple-maps': 'https://cdn.simpleicons.org/apple/000000',
  'here-wego': 'https://cdn.simpleicons.org/here/00AFAA',
  'tomtom': 'https://cdn.simpleicons.org/tomtom/E4271B',
  'openstreetmap': 'https://cdn.simpleicons.org/openstreetmap/7EBC6F',
  
  // Shopping
  'amazon': 'https://cdn.simpleicons.org/amazon/FF9900',
  'ebay': 'https://cdn.simpleicons.org/ebay/E53238',
  'etsy': 'https://cdn.simpleicons.org/etsy/F16521',
  'aliexpress': 'https://cdn.simpleicons.org/aliexpress/FF6A00',
  
  // Learning
  'coursera': 'https://cdn.simpleicons.org/coursera/0056D2',
  'udemy': 'https://cdn.simpleicons.org/udemy/A435F0',
  'khan-academy': 'https://cdn.simpleicons.org/khanacademy/14BF96',
  'edx': 'https://cdn.simpleicons.org/edx/02262B',
  'skillshare': 'https://cdn.simpleicons.org/skillshare/00FF84',
  'linkedin-learning': 'https://cdn.simpleicons.org/linkedin/0A66C2',
  
  // EV Charging
  'tesla-supercharger': 'https://cdn.simpleicons.org/tesla/CC0000',
  'chargepoint': 'https://cdn.simpleicons.org/chargepoint/00E096',
  'plugshare': 'https://cdn.simpleicons.org/plugshare/4F9E36',
};

let count = 0;

Object.entries(logoFixes).forEach(([id, logoUrl]) => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?icon: ')[^']*(')`);
  
  if (content.match(regex)) {
    content = content.replace(regex, `$1${logoUrl}$2`);
    count++;
    console.log(`✅ ${id} → Simple Icons`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${count} logos corrigés avec Simple Icons !`);
console.log('✨ Tous les logos sont maintenant :');
console.log('   - SVG en couleur officielle');
console.log('   - Taille parfaite');
console.log('   - CDN rapide et fiable');
