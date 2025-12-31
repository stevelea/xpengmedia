# 🐛 DEBUG : Problème changement de langue

## 🎯 Symptôme
Sélectionner 🇩🇪 Allemagne → reste en français

## 🔍 Diagnostic avec logs console

J'ai ajouté des logs détaillés pour diagnostiquer le problème. Voici comment tester :

### **Étape 1 : Ouvrir la console**
1. Appuyez sur `F12` ou `Ctrl+Shift+I`
2. Aller dans l'onglet "Console"

### **Étape 2 : Rafraîchir la page**
1. `F5` pour rafraîchir
2. Observer les logs au chargement

**Logs attendus au chargement :**
```
🌍 Détection auto: { browserLang: "fr-fr", timezone: "Europe/Paris", ... }
🔵 Locale chargé depuis localStorage: { region: "...", language: "..." }
OU
🔍 Locale détecté automatiquement: { region: "france", language: "fr" }
💾 Sauvegarde localStorage: { region: "...", language: "..." }
🔤 t("home") | locale.region=... | locale.language=... | result="..."
```

### **Étape 3 : Cliquer sur le drapeau**
1. Cliquer sur 🇫🇷 (ou autre)
2. Observer les logs

**Logs attendus :**
```
🔤 t("selectRegion") | locale.region=... | locale.language=... | result="..."
🔤 t("allServices") | locale.region=... | locale.language=... | result="..."
```

### **Étape 4 : Sélectionner 🇩🇪 Deutschland**
1. Cliquer sur 🇩🇪 Deutschland dans la liste
2. Observer les logs

**Logs attendus au clic :**
```
🚩 LocaleSelector: Changing to { region: "germany", language: "de" }
📍 Locale actuel dans selector: { region: "...", language: "..." }
🆕 Nouveau locale créé: { region: "germany", language: "de" }
✅ setLocale appelé depuis selector
🔄 LocaleContext: Setting new locale { region: "germany", language: "de" }
📍 Locale actuel avant changement: { region: "...", language: "..." }
✅ setLocaleState appelé avec: { region: "germany", language: "de" }
💾 Sauvegarde localStorage: { region: "germany", language: "de" }
🔤 t("home") | locale.region=germany | locale.language=de | result="Startseite"
🔤 t("videos") | locale.region=germany | locale.language=de | result="Videos"
...
```

**SI ça reste en français, les logs montreront :**
```
🔤 t("home") | locale.region=germany | locale.language=fr | result="Accueil"
                                                        ↑ PROBLÈME ICI !
```

### **Étape 5 : Vérifier localStorage**
Dans la console, taper :
```javascript
localStorage.getItem('xpeng_locale')
```

**Résultat attendu :**
```
'{"region":"germany","language":"de"}'
```

**SI le résultat est différent, c'est le problème !**

---

## 🔧 Solutions possibles

### **Solution 1 : Effacer localStorage**
```javascript
localStorage.removeItem('xpeng_locale')
location.reload()
```

### **Solution 2 : Forcer l'allemand**
```javascript
localStorage.setItem('xpeng_locale', JSON.stringify({region:'germany',language:'de'}))
location.reload()
```

### **Solution 3 : Vérifier le problème de détection**
Si la timezone `Europe/Paris` force le français :
- Le code dans `detectBrowserLocale()` ligne 277 force `{ region: 'france', language: 'fr' }`
- Même après sélection manuelle
- localStorage devrait avoir priorité

---

## 📋 Checklist de diagnostic

- [ ] Console ouverte (F12)
- [ ] Page rafraîchie (F5)
- [ ] Logs visibles au chargement
- [ ] Clic sur drapeau montre les logs
- [ ] Sélection Allemagne montre les logs
- [ ] `locale.language` passe à `"de"` dans les logs
- [ ] Traductions passent à l'allemand (`"Startseite"` au lieu de `"Accueil"`)
- [ ] localStorage contient `{"region":"germany","language":"de"}`

---

## 🚨 Si ça ne marche toujours pas

**Copier TOUS les logs de la console et me les envoyer.**

Logs importants :
1. Log au chargement (🔵 ou 🔍)
2. Logs au clic sur Deutschland (🚩 → ✅)
3. Logs des traductions (🔤)
4. Valeur de localStorage

**Exemple de copie :**
```
🔵 Locale chargé depuis localStorage: {region: 'france', language: 'fr'}
💾 Sauvegarde localStorage: {region: 'france', language: 'fr'}
🔤 t("home") | locale.region=france | locale.language=fr | result="Accueil"
🚩 LocaleSelector: Changing to {region: 'germany', language: 'de'}
🔄 LocaleContext: Setting new locale {region: 'germany', language: 'de'}
✅ setLocaleState appelé avec: {region: 'germany', language: 'de'}
💾 Sauvegarde localStorage: {region: 'germany', language: 'de'}
🔤 t("home") | locale.region=germany | locale.language=de | result="Startseite"
```

---

## 🎯 Résultat attendu

Après avoir cliqué sur 🇩🇪 Deutschland :
- ✅ Drapeau change : 🇫🇷 → 🇩🇪
- ✅ Navigation change : "Accueil" → "Startseite"
- ✅ Tous les textes en allemand
- ✅ localStorage contient `{"region":"germany","language":"de"}`
- ✅ Rafraîchir la page (F5) : reste en allemand
