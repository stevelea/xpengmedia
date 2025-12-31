// Correction de TOUS les services vers leurs versions WEB PLAYER/WEB APP
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DE TOUTES LES URLs VERS VERSIONS WEB\n');

const filePath = path.join(__dirname, 'src', 'data', 'platforms.ts');
let content = fs.readFileSync(filePath, 'utf8');

// URLs corrigées vers versions WEB
const webUrls = {
  // TV & Streaming avec WEB PLAYERS
  'twitch': 'https://www.twitch.tv',  // Déjà OK
  'pluto-tv': 'https://pluto.tv/live-tv',  // Version web live
  'plex': 'https://app.plex.tv',  // Web app
  'xumo': 'https://www.xumo.tv',  // Déjà OK
  'molotov': 'https://www.molotov.tv',  // Déjà OK
  'arte': 'https://www.arte.tv/fr/direct/',  // Direct web
  'francetv': 'https://www.france.tv/direct',  // Direct web
  'zdf': 'https://www.zdf.de/live-tv',  // Live TV web
  'bbc-iplayer': 'https://www.bbc.co.uk/iplayer',  // Déjà OK
  'ard-mediathek': 'https://www.ardmediathek.de/live',  // Live web
  'emby': 'https://app.emby.media',  // Web app
  'jellyfin': 'https://jellyfin.org/downloads/clients/#web',  // Pointer vers web client
  
  // Services sociaux/communication avec WEB APPS
  'signal': 'https://signal.org/download/',  // Pas de version web pure mais page download
  'zoom': 'https://app.zoom.us',  // Web app
  'notion': 'https://www.notion.so',  // Déjà OK
  
  // Gaming avec WEB VERSIONS
  'afterplay': 'https://afterplay.io',  // Déjà OK
  'retrogames': 'https://www.retrogames.cc',  // Déjà OK
  'pbs-kids': 'https://pbskids.org/games',  // Déjà OK
  
  // EV & Maps avec WEB APPS
  'google-maps': 'https://www.google.com/maps',  // Version internationale
  'open-charge-map': 'https://map.openchargemap.io',  // Web map
  'chargeprice': 'https://www.chargeprice.app',  // Web app
  'teslaos': 'https://teslaos.io',  // Déjà OK
  'myteslanu': 'https://mytesla.nu',  // Déjà OK
  'teslatheatre': 'https://teslatheatre.net',  // Déjà OK
  'tezlab': 'https://tezlab.app',  // Déjà OK
  'stats-app': 'https://www.stats.app',  // Déjà OK
  'evnotify': 'https://evnotify.de',  // Déjà OK
  
  // Éducation avec WEB PLATFORMS
  'khan-academy': 'https://www.khanacademy.org',  // Déjà OK
  'coursera': 'https://www.coursera.org',  // Déjà OK
  'edx': 'https://www.edx.org',  // Déjà OK
  
  // Info & autres
  'lemonde': 'https://www.lemonde.fr',  // Déjà OK
  'wikipedia': 'https://www.wikipedia.org',  // Déjà OK
  'xpeng-discord': 'https://discord.gg/xpengfrance',  // Déjà OK
};

let corrections = 0;

Object.entries(webUrls).forEach(([id, url]) => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?url: ')[^']*(')`);
  
  if (content.match(regex)) {
    const oldMatch = content.match(regex);
    if (oldMatch && oldMatch[0].includes(url)) {
      console.log(`✓ ${id} → déjà correct`);
    } else {
      content = content.replace(regex, `$1${url}$2`);
      corrections++;
      console.log(`✅ ${id} → ${url}`);
    }
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 ${corrections} URLs corrigées !`);
console.log('✨ Toutes les URLs pointent maintenant vers les versions WEB !');
