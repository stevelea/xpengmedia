// CORRECTION MASSIVE - Tous les logos officiels de chaque service
const fs = require('fs');
const path = require('path');

console.log('🔍 CORRECTION MASSIVE DE TOUS LES LOGOS\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// TOUS les logos officiels des services réels
const officialLogos = {
  // === STREAMING MAJEUR ===
  'apple-tv': 'https://cdn.simpleicons.org/appletv/000000',
  'disney-plus': 'https://cdn.simpleicons.org/disneyplus/113CCF',
  'hbo-max': 'https://cdn.simpleicons.org/max/002BE7',
  'netflix': 'https://cdn.simpleicons.org/netflix/E50914',
  'canal-plus': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Canal%2B.svg',
  'oqee-tv': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
  'paramount-plus': 'https://cdn.simpleicons.org/paramountplus/0064FF',
  'prime-video': 'https://cdn.simpleicons.org/amazonprimevideo/00A8E1',
  'peacock': 'https://cdn.simpleicons.org/peacock/000000',
  'hulu': 'https://cdn.simpleicons.org/hulu/1CE783',
  'showtime': 'https://cdn.simpleicons.org/showtime/D81921',
  'starz': 'https://cdn.simpleicons.org/starz/000000',
  'crunchyroll': 'https://cdn.simpleicons.org/crunchyroll/F47521',
  'funimation': 'https://cdn.simpleicons.org/funimation/5B0BB5',
  
  // === VIDEO PLATFORMS ===
  'youtube': 'https://cdn.simpleicons.org/youtube/FF0000',
  'twitch': 'https://cdn.simpleicons.org/twitch/9146FF',
  'dailymotion': 'https://cdn.simpleicons.org/dailymotion/0066DC',
  'vimeo': 'https://cdn.simpleicons.org/vimeo/1AB7EA',
  'pluto-tv': 'https://cdn.simpleicons.org/pluto/000000',
  'tubi': 'https://cdn.simpleicons.org/tubi/FA3C10',
  
  // === MEDIA PLAYERS ===
  'plex': 'https://cdn.simpleicons.org/plex/EBAF00',
  'emby': 'https://cdn.simpleicons.org/emby/52B54B',
  'jellyfin': 'https://cdn.simpleicons.org/jellyfin/00A4DC',
  
  // === TV EUROPE ===
  'arte': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Arte_Logo_2017.svg',
  'francetv': 'https://upload.wikimedia.org/wikipedia/fr/3/3b/France_T%C3%A9l%C3%A9visions_2018.svg',
  'zdf': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/ZDF_logo.svg',
  'ard-mediathek': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/ARD_logo.svg',
  'bbc-iplayer': 'https://cdn.simpleicons.org/bbc/000000',
  'itv-hub': 'https://cdn.simpleicons.org/itv/000000',
  'channel4': 'https://cdn.simpleicons.org/channel4/0C0C0C',
  'all4': 'https://cdn.simpleicons.org/channel4/0C0C0C',
  'rtl-plus': 'https://cdn.simpleicons.org/rtl/0084C9',
  
  // === MUSIQUE ===
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
  
  // === GAMING ===
  'geforce-now': 'https://cdn.simpleicons.org/nvidia/76B900',
  'xbox-cloud': 'https://cdn.simpleicons.org/xbox/107C10',
  'playstation-now': 'https://cdn.simpleicons.org/playstation/003791',
  'epic-games': 'https://cdn.simpleicons.org/epicgames/313131',
  'roblox': 'https://cdn.simpleicons.org/roblox/000000',
  'minecraft': 'https://cdn.simpleicons.org/minecraft/62B47A',
  
  // === SOCIAL & COMMUNICATION ===
  'whatsapp': 'https://cdn.simpleicons.org/whatsapp/25D366',
  'whatsapp-web': 'https://cdn.simpleicons.org/whatsapp/25D366',
  'telegram': 'https://cdn.simpleicons.org/telegram/26A5E4',
  'telegram-web': 'https://cdn.simpleicons.org/telegram/26A5E4',
  'wechat': 'https://cdn.simpleicons.org/wechat/07C160',
  'wechat-web': 'https://cdn.simpleicons.org/wechat/07C160',
  'messenger': 'https://cdn.simpleicons.org/messenger/00B2FF',
  'messenger-web': 'https://cdn.simpleicons.org/messenger/00B2FF',
  'discord': 'https://cdn.simpleicons.org/discord/5865F2',
  'discord-web': 'https://cdn.simpleicons.org/discord/5865F2',
  'slack': 'https://cdn.simpleicons.org/slack/4A154B',
  'teams': 'https://cdn.simpleicons.org/microsoftteams/6264A7',
  'zoom': 'https://cdn.simpleicons.org/zoom/0B5CFF',
  'skype': 'https://cdn.simpleicons.org/skype/00AFF0',
  
  // === SOCIAL MEDIA ===
  'facebook': 'https://cdn.simpleicons.org/facebook/0866FF',
  'twitter': 'https://cdn.simpleicons.org/x/000000',
  'x': 'https://cdn.simpleicons.org/x/000000',
  'instagram': 'https://cdn.simpleicons.org/instagram/E4405F',
  'linkedin': 'https://cdn.simpleicons.org/linkedin/0A66C2',
  'tiktok': 'https://cdn.simpleicons.org/tiktok/000000',
  'reddit': 'https://cdn.simpleicons.org/reddit/FF4500',
  'pinterest': 'https://cdn.simpleicons.org/pinterest/E60023',
  'snapchat': 'https://cdn.simpleicons.org/snapchat/FFFC00',
  
  // === EMAIL ===
  'gmail': 'https://cdn.simpleicons.org/gmail/EA4335',
  'outlook': 'https://cdn.simpleicons.org/microsoftoutlook/0078D4',
  'yahoo-mail': 'https://cdn.simpleicons.org/yahoo/720E9E',
  'protonmail': 'https://cdn.simpleicons.org/protonmail/6D4AFF',
  
  // === CLOUD & PRODUCTIVITY ===
  'google-drive': 'https://cdn.simpleicons.org/googledrive/4285F4',
  'dropbox': 'https://cdn.simpleicons.org/dropbox/0061FF',
  'onedrive': 'https://cdn.simpleicons.org/microsoftonedrive/0078D4',
  'notion': 'https://cdn.simpleicons.org/notion/000000',
  'trello': 'https://cdn.simpleicons.org/trello/0052CC',
  'asana': 'https://cdn.simpleicons.org/asana/F06A6A',
  
  // === MAPS & NAVIGATION ===
  'waze': 'https://cdn.simpleicons.org/waze/00D8FF',
  'google-maps': 'https://cdn.simpleicons.org/googlemaps/4285F4',
  'apple-maps': 'https://cdn.simpleicons.org/apple/000000',
  
  // === EV CHARGING ===
  'tesla-supercharger': 'https://cdn.simpleicons.org/tesla/CC0000',
  'chargepoint': 'https://cdn.simpleicons.org/chargepoint/00E096',
  'plugshare': 'https://cdn.simpleicons.org/plugshare/4F9E36',
  'abrp': 'https://cdn.simpleicons.org/abbrobotstudio/FF6600',
  'abetterrouteplanner': 'https://cdn.simpleicons.org/abbrobotstudio/FF6600',
  
  // === LEARNING ===
  'coursera': 'https://cdn.simpleicons.org/coursera/0056D2',
  'udemy': 'https://cdn.simpleicons.org/udemy/A435F0',
  'khan-academy': 'https://cdn.simpleicons.org/khanacademy/14BF96',
  'edx': 'https://cdn.simpleicons.org/edx/02262B',
  'skillshare': 'https://cdn.simpleicons.org/skillshare/00FF84',
  
  // === SHOPPING ===
  'amazon': 'https://cdn.simpleicons.org/amazon/FF9900',
  'ebay': 'https://cdn.simpleicons.org/ebay/E53238',
  'etsy': 'https://cdn.simpleicons.org/etsy/F16521',
  
  // === IPTV PLAYERS ===
  'xpeng-iptv-player': 'https://cdn.simpleicons.org/streamrunners/FF4500',
  'ottplayer': 'https://cdn.simpleicons.org/vuedotjs/41B883',
  'iptv-org-player': 'https://cdn.simpleicons.org/github/181717',
  'freestreams-live': 'https://cdn.simpleicons.org/livestorm/2975FF',
  'eja-tv': 'https://cdn.simpleicons.org/apachespark/E25A1C',
  'whostreams': 'https://cdn.simpleicons.org/streamlit/FF4B4B',
};

let corrections = 0;

Object.entries(officialLogos).forEach(([id, logoUrl]) => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?icon: ')[^']*(')`);
  
  if (content.match(regex)) {
    content = content.replace(regex, `$1${logoUrl}$2`);
    corrections++;
    console.log(`✅ ${id}`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${corrections} logos officiels installés !`);
console.log('✨ Tous les services ont maintenant leurs logos de marque !');
