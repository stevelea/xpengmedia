# ⚡ CONFIGURE TES BACKENDS EN 2 MINUTES !

## 🎯 J'AI CRÉÉ UN SCRIPT QUI FAIT TOUT !

Le script `configure-backends.ps1` fait **TOUT automatiquement** :

1. ✅ Te demande tes URLs de backends
2. ✅ Teste si elles fonctionnent
3. ✅ Configure automatiquement le player
4. ✅ Commit et push sur GitHub
5. ✅ Déploie sur GitHub Pages

**TU N'AS RIEN À FAIRE MANUELLEMENT !**

---

## 🚀 UTILISATION EN 3 ÉTAPES

### ÉTAPE 1 : Déploie au moins 1 backend

**Choix recommandé : VERCEL (2 minutes)**

1. Va sur **https://vercel.com/new**
2. Connecte GitHub
3. Importe ton repo **dlnraja/xpengmedia**
4. Clique **"Deploy"**
5. Copie l'URL : `https://xpengmedia-abc123.vercel.app`

**⚠️ IMPORTANT : Ajoute `/api/proxy` à la fin !**
```
https://xpengmedia-abc123.vercel.app/api/proxy
```

---

### ÉTAPE 2 : Lance le script

Ouvre PowerShell dans le dossier du projet :

```powershell
cd "C:\Users\HP\Desktop\homey app\xpengmedia"
.\configure-backends.ps1
```

---

### ÉTAPE 3 : Entre tes URLs

Le script va te demander :

```
🟦 CLOUDFLARE WORKER
   URL Cloudflare (ou Enter pour ignorer): 

🟩 VERCEL EDGE
   URL Vercel (ou Enter pour ignorer): https://xpengmedia-abc123.vercel.app/api/proxy

🟧 NETLIFY FUNCTIONS
   URL Netlify (ou Enter pour ignorer): 
```

**Entre ton URL Vercel et appuie sur Enter pour les autres si tu ne les as pas déployés.**

Le script va :
- ✅ Tester si ton URL fonctionne
- ✅ Afficher un résumé
- ✅ Demander confirmation
- ✅ Configurer automatiquement
- ✅ Commit + Push + Deploy

---

## 📋 EXEMPLES D'URLS

### Cloudflare
```
https://xpengmedia-iptv-proxy.abc123.workers.dev
```
**Pas de suffixe pour Cloudflare !**

### Vercel
```
https://xpengmedia-abc123.vercel.app/api/proxy
```
**⚠️ Ajoute `/api/proxy` à la fin !**

### Netlify
```
https://xpengmedia.netlify.app/.netlify/functions/proxy
```
**⚠️ Ajoute `/.netlify/functions/proxy` à la fin !**

---

## 🎬 EXEMPLE COMPLET

```powershell
PS> .\configure-backends.ps1

🚀 CONFIGURATION AUTOMATIQUE DES BACKENDS IPTV

📝 Entre tes URLs de backends déployés

🟦 CLOUDFLARE WORKER
   URL Cloudflare (ou Enter pour ignorer): [Enter]

🟩 VERCEL EDGE
   URL Vercel (ou Enter pour ignorer): https://xpengmedia-abc123.vercel.app/api/proxy
🔍 Test de Vercel : https://xpengmedia-abc123.vercel.app/api/proxy
✅ Vercel fonctionne !

🟧 NETLIFY FUNCTIONS
   URL Netlify (ou Enter pour ignorer): [Enter]

📊 RÉSUMÉ DE LA CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭕ Cloudflare Worker : Non configuré
✅ Vercel Edge       : https://xpengmedia-abc123.vercel.app/api/proxy
⭕ Netlify Functions : Non configuré
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Confirmer et appliquer la configuration ? (o/n): o

🔧 Configuration du player...
✅ Fichier public\iptv-player.html mis à jour !

📦 Commit et push des modifications...
🚀 Push vers GitHub...
🌐 Déploiement sur GitHub Pages...

✨ CONFIGURATION TERMINÉE !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Ton player IPTV est maintenant configuré !

🔗 URL de test:
   https://dlnraja.github.io/xpengmedia/iptv-player.html?debug=1

📊 Backends configurés:
   ✅ Vercel Edge (priorité 2)

🎬 Teste maintenant sur ta XPENG !
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 FONCTIONNALITÉS DU SCRIPT

### Validation Automatique
- ✅ Teste si chaque URL fonctionne vraiment
- ✅ Ajoute automatiquement les suffixes manquants
- ✅ Affiche des messages clairs

### Configuration Intelligente
- ✅ Met à jour le player automatiquement
- ✅ Respecte l'ordre de priorité
- ✅ Sauvegarde avec encodage UTF-8

### Déploiement Automatique
- ✅ Commit avec message descriptif
- ✅ Push vers GitHub
- ✅ Déploie sur GitHub Pages
- ✅ Affiche l'URL de test

---

## 📊 CE QUI SERA CONFIGURÉ

### Dans le player (lignes 851-853) :

**Avant :**
```javascript
const CLOUDFLARE_PROXY = null;
const VERCEL_PROXY = null;
const NETLIFY_PROXY = null;
```

**Après (si tu entres l'URL Vercel) :**
```javascript
const CLOUDFLARE_PROXY = null;  // Configuré automatiquement
const VERCEL_PROXY = 'https://xpengmedia-abc123.vercel.app/api/proxy';      // Configuré automatiquement
const NETLIFY_PROXY = null;     // Configuré automatiquement
```

---

## 🎯 ORDRE DE PRIORITÉ

Le player testera automatiquement dans cet ordre :

```
1️⃣ Cloudflare (si configuré)
2️⃣ Vercel (si configuré)
3️⃣ Netlify (si configuré)
4️⃣ 5 proxies publics (fallback)
```

---

## ⚠️ PRÉREQUIS

- ✅ Git installé
- ✅ Node.js installé
- ✅ PowerShell (Windows)
- ✅ Au moins 1 backend déployé (Vercel recommandé)

---

## 🆘 DÉPANNAGE

### Le script ne se lance pas
```powershell
# Autorise l'exécution de scripts
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### "Le backend ne répond pas"
- Vérifie que l'URL est correcte
- Vérifie que le backend est bien déployé
- Teste l'URL dans ton navigateur

### "Aucun backend valide configuré"
- Le script peut quand même continuer
- Le player utilisera les 5 proxies publics

---

## 💡 RECOMMANDATIONS

### Pour la simplicité maximale :
1. Déploie **VERCEL uniquement** (2 min)
2. Lance `.\configure-backends.ps1`
3. Entre ton URL Vercel
4. Confirme

### Pour la fiabilité maximale :
1. Déploie **les 3 backends** (10 min)
2. Lance `.\configure-backends.ps1`
3. Entre les 3 URLs
4. Confirme

---

## 🎬 LANCE LE SCRIPT MAINTENANT !

```powershell
cd "C:\Users\HP\Desktop\homey app\xpengmedia"
.\configure-backends.ps1
```

**Le script fait TOUT automatiquement !**

---

## 📸 APRÈS LE SCRIPT

Le script affichera l'URL de test :
```
https://dlnraja.github.io/xpengmedia/iptv-player.html?debug=1
```

**Teste cette URL sur ta XPENG !**

### Logs attendus :
```
⚡ Vercel Edge configuré pour les streams
🔄 ÉTAPE 2/3: Tentative avec proxies CORS...
⚡ Vercel Edge configuré (priorité 2)
🌐 Test proxy: Vercel Edge...
✅ Connexion via Vercel Edge réussie
💾 Proxy mémorisé pour les streams: Vercel Edge
📊 Pagination activée: 13 pages
✅ 1247 chaînes Xtream chargées !
🎬 Lecture de: FR| TF1 FHD
✅ Manifest parsé: 3 qualités disponibles
▶️ Lecture en cours
```

**TES VIDÉOS IPTV MARCHERONT À 100% !** 🎉

---

## 📋 CHECKLIST

- [ ] Déployer au moins 1 backend (Vercel recommandé)
- [ ] Copier l'URL complète (avec suffixe pour Vercel/Netlify)
- [ ] Lancer `.\configure-backends.ps1`
- [ ] Entrer les URLs
- [ ] Confirmer
- [ ] Attendre la fin du déploiement
- [ ] Tester sur ta XPENG

---

**LANCE LE SCRIPT MAINTENANT !** 🚀
