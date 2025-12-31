# 🚀 Déploiement du Proxy IPTV Cloudflare Worker

## Pourquoi ce proxy ?

Le navigateur web bloque les connexions depuis HTTPS (GitHub Pages) vers HTTP (serveur IPTV).  
Ce worker Cloudflare fait le pont : **HTTPS → Worker (HTTPS) → Serveur IPTV (HTTP)**

## 📋 Prérequis

1. Un compte Cloudflare (gratuit) : https://dash.cloudflare.com/sign-up
2. Node.js installé (déjà fait sur ton PC)

## 🛠️ Installation

### 1. Installer Wrangler CLI (outil Cloudflare)

```bash
npm install -g wrangler
```

### 2. Se connecter à Cloudflare

```bash
wrangler login
```

→ Une page s'ouvrira dans ton navigateur pour autoriser Wrangler

### 3. Déployer le worker

Depuis le dossier `xpengmedia` :

```bash
wrangler deploy
```

→ Le worker sera déployé automatiquement !

### 4. Récupérer l'URL du worker

Après le déploiement, tu verras :

```
Published xpengmedia-iptv-proxy (X.XX sec)
  https://xpengmedia-iptv-proxy.VOTRE-ID.workers.dev
```

**Copie cette URL** !

## 🔧 Configuration dans le player IPTV

Une fois le worker déployé, modifie dans `iptv-player.html` :

Cherche la ligne (vers ligne 1620) :

```javascript
const CLOUDFLARE_PROXY = null;
```

Et remplace par :

```javascript
const CLOUDFLARE_PROXY = 'https://xpengmedia-iptv-proxy.VOTRE-ID.workers.dev';
```

Puis commit + push + deploy comme d'habitude.

## 🧪 Test manuel du worker

Tu peux tester si le worker fonctionne en allant sur :

```
https://xpengmedia-iptv-proxy.VOTRE-ID.workers.dev/?url=http://line.trx-ott.com/player_api.php?username=0fee8b0c7f&password=TON-PASSWORD&action=get_live_streams
```

→ Tu devrais voir du JSON avec la liste des chaînes !

## 📊 Limites gratuites Cloudflare

- **100,000 requêtes/jour** (largement suffisant)
- **10ms CPU time par requête**
- Pas de carte bancaire requise

## ⚡ Avantages

✅ Connexion directe rapide  
✅ Pas de limitation proxy public  
✅ CORS géré automatiquement  
✅ Cache 5 minutes pour performance  
✅ Gratuit et illimité pour usage personnel

## 🔄 Mise à jour du worker

Si tu modifies `cloudflare-worker-proxy.js`, redéploie simplement :

```bash
wrangler deploy
```

---

**Note** : Si tu ne veux pas déployer toi-même, je peux t'aider à le faire ou te donner une URL de worker déjà déployé pour tester.
