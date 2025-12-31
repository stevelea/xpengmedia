# 🔧 Refonte Structure XPENG Media Hub

## 📋 Problèmes identifiés (12 Nov 2025, 18:04)

### 1. ✅ RÉSOLU : Langue par défaut
- **Problème** : Global/EN par défaut
- **Solution** : France/FR par défaut si pays indéterminé
- **Status** : Déployé (commit 42fa7ba)

### 2. 🔄 EN COURS : Disponibilité régionale
- **Problème** : Apps global pas toujours visibles dans bonnes régions
- **Action** : Vérifier filterByRegion() dans HomePage.tsx
- **Vérifier** : 
  - Apps 'global' doivent être dans toutes les régions
  - Apps 'europe' dans pays européens
  - Apps régionales bien filtrées

### 3. ❌ URGENT : Catégories mal structurées

#### Problème actuel :
```
videoCategories:
  - global-streaming (30+ apps) ← OK
  - free-tv (20+ apps)          ← À FUSIONNER
  - asia-streaming (5 apps)      ← Souvent VIDE en Europe
  - education (5 apps)           ← Petite catégorie

musicCategories:
  - global-music (15+ apps)      ← OK  
  - asia-music (3 apps)          ← Souvent VIDE

gamesCategories:
  - quick-play (nombreux)        ← OK
  - cloud-gaming (5 apps)        ← Petite catégorie

chargingCategories:
  - xpeng-supercharging (plusieurs) ← OK
  - other-charging (plusieurs)      ← OK

otherServicesCategories:
  - ev-entertainment (quelques)  ← Petite catégorie
  - web-services (nombreux)      ← OK
  - china-services (10+ apps)    ← Souvent VIDE
```

#### Actions requises :
1. **FUSIONNER** : `global-streaming` + `free-tv` 
   - Raison : Beaucoup de services ont offres gratuites ET payantes
   - Nouveau nom : "Streaming & VOD" 
   - Tous les services vidéo ensemble

2. **SUPPRIMER** catégories vides régionalement :
   - `asia-streaming` : Ne montrer QUE si région 'china' ou 'asia'
   - `asia-music` : Ne montrer QUE si région 'china' ou 'asia'  
   - `china-services` : Ne montrer QUE si région 'china'

3. **FUSIONNER** petites catégories gaming :
   - `quick-play` + `cloud-gaming` = "Jeux & Gaming"

4. **GARDER** séparées :
   - Recharge : OK comme ça
   - Web services : OK

### 4. ❌ À FAIRE : Masquage blocs vides COMPLET
- **Problème** : Bloc catégorie s'affiche même si vide (titre + container)
- **Solution actuelle** : `.filter(category => getVisiblePlatforms > 0)` 
- **Vérifier** : Ça marche déjà ? Ou besoin amélioration ?

### 5. ❌ À FAIRE : Logos homogènes PARTOUT
- **Problème** : Logos pas uniformes sur toutes pages
- **Vérifié** : 
  - HomePage : utilise PlatformIcon ✅
  - VideosPage : à vérifier
  - MusicPage : à vérifier
  - GamesPage : à vérifier
- **Action** : S'assurer que PlatformIcon est utilisé partout

### 6. ❌ À FAIRE : Catégories "trop grandes"
- **Problème** : "Catégories en dessous de liste apps sont trop grosses"
- **Comprendre** : Quelles catégories exactement ?
- **Hypothèse** : Les blocs de catégories ont trop de padding/margin ?

---

## 🎯 Plan d'action prioritaire

### Phase 1 : Restructuration catégories (URGENT)
1. Fusionner global-streaming + free-tv
2. Rendre asia-streaming conditionnelle
3. Rendre asia-music conditionnelle  
4. Rendre china-services conditionnelle
5. Fusionner quick-play + cloud-gaming

### Phase 2 : Vérifications
1. Tester masquage blocs vides
2. Vérifier logos sur toutes pages
3. Vérifier disponibilité régionale

### Phase 3 : Ajustements visuels
1. Ajuster tailles catégories si besoin
2. S'assurer homogénéité visuelle
3. Tests multi-régions

---

## 📝 Notes techniques

### Structure actuelle HomePage.tsx :
```typescript
const allPlatformsRaw = [
  ...videoCategories.flatMap(cat => cat.platforms),
  ...musicCategories.flatMap(cat => cat.platforms),
  ...gamesCategories.flatMap(cat => cat.platforms),
  ...chargingCategories.flatMap(cat => cat.platforms),
  ...otherServicesCategories.flatMap(cat => cat.platforms),
];

const allPlatforms = filterByRegion(allPlatformsRaw);
```

### Masquage actuel :
```typescript
{videoCategories
  .filter(category => getVisiblePlatforms(category.platforms).length > 0)
  .map((category) => ...)}
```

✅ Le masquage existe déjà !

### PlatformIcon actuel :
- ✅ Fond transparent SVG
- ✅ Padding uniforme p-1
- ✅ Drop-shadow
- ✅ Tailles cohérentes (w-6, w-7, w-9)
- ✅ Object-contain

---

## ⏰ Timeline estimée
- Phase 1 : 1-2h (restructuration)
- Phase 2 : 30min (vérifications)  
- Phase 3 : 30min (ajustements)
- **Total** : 2-3h de développement
