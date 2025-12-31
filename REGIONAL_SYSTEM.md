# 🌍 Système de Régionalisation Dynamique

## 🎯 Objectif

Créer un système intelligent qui adapte automatiquement :
- **Liste des régions** selon le pays de l'utilisateur
- **Services affichés** selon la région
- **Langues disponibles** selon le contexte
- **Ordre des suggestions** selon la proximité géographique/linguistique

---

## 📊 Structure proposée

### **1. Groupes régionaux**

```typescript
const regionalGroups = {
  // Europe de l'Ouest (langues latines)
  western_europe: {
    countries: ['france', 'spain', 'italy', 'belgium'],
    languages: ['fr', 'es', 'it', 'nl'],
    services_priority: ['canal+', 'molotov', 'rtbf', 'arte'],
  },
  
  // Europe du Nord (langues germaniques)
  northern_europe: {
    countries: ['germany', 'austria', 'switzerland', 'netherlands'],
    languages: ['de', 'nl'],
    services_priority: ['ard', 'zdf', 'rtl'],
  },
  
  // Europe du Nord (langues scandinaves)
  nordic: {
    countries: ['sweden', 'norway', 'denmark'],
    languages: ['sv', 'no', 'da'],
    services_priority: ['svt', 'nrk', 'dr'],
  },
  
  // Pays anglophones
  anglophone: {
    countries: ['uk', 'usa', 'australia', 'singapore'],
    languages: ['en'],
    services_priority: ['bbc', 'hulu', 'stan'],
  },
  
  // Moyen-Orient
  middle_east: {
    countries: ['uae', 'qatar', 'israel'],
    languages: ['ar', 'he'],
    services_priority: ['osn', 'shahid'],
  },
  
  // Asie
  asia: {
    countries: ['china', 'singapore'],
    languages: ['zh', 'en'],
    services_priority: ['bilibili', 'iqiyi', 'youku'],
  },
};
```

---

### **2. Métadonnées enrichies par région**

```typescript
interface RegionMetadata {
  code: Region;
  name: string;
  flag: string;
  languages: string[];          // Langues officielles
  currency: string;             // EUR, USD, etc.
  timezone: string;             // Europe/Paris, etc.
  group: string;                // western_europe, etc.
  neighbors: Region[];          // Pays proches géographiquement
  linguistic_family: string[];  // ['romance'], ['germanic'], etc.
  services_count: number;       // Nombre de services disponibles
  popular_services: string[];   // Top 5 services du pays
}

const regionsMetadata: RegionMetadata[] = [
  {
    code: 'france',
    name: 'France',
    flag: '🇫🇷',
    languages: ['fr'],
    currency: 'EUR',
    timezone: 'Europe/Paris',
    group: 'western_europe',
    neighbors: ['belgium', 'switzerland', 'spain', 'italy', 'germany'],
    linguistic_family: ['romance'],
    services_count: 25,
    popular_services: ['canal+', 'molotov', 'rtbf', 'arte', 'france-tv'],
  },
  {
    code: 'germany',
    name: 'Deutschland',
    flag: '🇩🇪',
    languages: ['de'],
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    group: 'northern_europe',
    neighbors: ['austria', 'switzerland', 'netherlands', 'belgium', 'france'],
    linguistic_family: ['germanic'],
    services_count: 20,
    popular_services: ['ard', 'zdf', 'rtl', 'dazn'],
  },
  // ... etc pour tous les pays
];
```

---

### **3. Système de suggestions intelligent**

```typescript
function getSuggestedRegions(currentRegion: Region): Region[] {
  const metadata = regionsMetadata.find(r => r.code === currentRegion);
  if (!metadata) return [];
  
  // Algorithme de suggestion basé sur :
  // 1. Pays voisins géographiques
  // 2. Même groupe linguistique
  // 3. Même groupe régional
  // 4. Services similaires
  
  const suggestions = new Set<Region>();
  
  // Priorité 1 : Voisins directs
  metadata.neighbors.forEach(n => suggestions.add(n));
  
  // Priorité 2 : Même groupe
  const groupCountries = regionalGroups[metadata.group]?.countries || [];
  groupCountries.forEach(c => suggestions.add(c as Region));
  
  // Priorité 3 : Même famille linguistique
  regionsMetadata
    .filter(r => 
      r.linguistic_family.some(f => metadata.linguistic_family.includes(f))
    )
    .forEach(r => suggestions.add(r.code));
  
  return Array.from(suggestions);
}
```

---

### **4. Ordre dynamique des régions**

```typescript
function getOrderedRegions(userRegion: Region): RegionMetadata[] {
  const current = regionsMetadata.find(r => r.code === userRegion);
  const suggestions = getSuggestedRegions(userRegion);
  
  // Réorganiser la liste :
  const ordered: RegionMetadata[] = [];
  
  // 1. Global (toujours en premier)
  ordered.push(regionsMetadata.find(r => r.code === 'global')!);
  
  // 2. Région actuelle
  if (current) ordered.push(current);
  
  // 3. Régions suggérées (triées par pertinence)
  suggestions
    .map(code => regionsMetadata.find(r => r.code === code))
    .filter(Boolean)
    .forEach(r => {
      if (!ordered.find(o => o.code === r!.code)) {
        ordered.push(r!);
      }
    });
  
  // 4. Autres régions (ordre alphabétique)
  regionsMetadata
    .filter(r => !ordered.find(o => o.code === r.code))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(r => ordered.push(r));
  
  return ordered;
}
```

---

### **5. Services personnalisés par région**

```typescript
function getRegionalServices(region: Region): {
  featured: PlatformLink[];
  recommended: PlatformLink[];
  all: PlatformLink[];
} {
  const metadata = regionsMetadata.find(r => r.code === region);
  if (!metadata) return { featured: [], recommended: [], all: [] };
  
  const allServices = getAllPlatforms();
  
  return {
    // Services vedettes (top 5 du pays)
    featured: allServices.filter(s => 
      metadata.popular_services.includes(s.id)
    ),
    
    // Services recommandés (du groupe régional)
    recommended: allServices.filter(s => {
      const groupServices = regionalGroups[metadata.group]?.services_priority || [];
      return groupServices.includes(s.id);
    }),
    
    // Tous les services disponibles
    all: allServices.filter(s =>
      s.availability.some(av => {
        const allowedScopes = regionMap[region] || ['global'];
        return allowedScopes.includes(av);
      })
    ),
  };
}
```

---

### **6. Langues contextuelles**

```typescript
function getContextualLanguages(region: Region): {
  primary: string;
  secondary: string[];
  nearby: string[];
} {
  const metadata = regionsMetadata.find(r => r.code === region);
  if (!metadata) return { primary: 'en', secondary: [], nearby: [] };
  
  const neighbors = metadata.neighbors
    .map(n => regionsMetadata.find(r => r.code === n))
    .filter(Boolean);
  
  return {
    // Langue principale
    primary: metadata.languages[0],
    
    // Langues secondaires du pays
    secondary: metadata.languages.slice(1),
    
    // Langues des pays voisins
    nearby: Array.from(new Set(
      neighbors.flatMap(n => n!.languages)
    )),
  };
}
```

---

## 🎨 Interface utilisateur adaptée

### **Dropdown régions avec sections**

```tsx
<LocaleSelector>
  <Section title="🌍 Global">
    <Region code="global" />
  </Section>
  
  <Section title="📍 Votre région">
    <Region code={currentRegion} highlighted />
  </Section>
  
  <Section title="🔥 Régions suggérées">
    {suggestedRegions.map(region => (
      <Region 
        code={region} 
        badge={`${region.services_count} services`}
      />
    ))}
  </Section>
  
  <Section title="🌏 Autres régions">
    {otherRegions.map(region => (
      <Region code={region} />
    ))}
  </Section>
</LocaleSelector>
```

---

### **Badge de services disponibles**

```tsx
<Region code="france">
  <Flag>🇫🇷</Flag>
  <Name>France</Name>
  <Badge>{metadata.services_count} services</Badge>
  <PopularServices>
    {metadata.popular_services.slice(0, 3).map(s => (
      <ServiceIcon key={s} id={s} />
    ))}
  </Badge>
</Region>
```

---

## 📊 Exemples concrets

### **Exemple 1 : Utilisateur en France 🇫🇷**

**Liste réordonnée :**
1. 🌍 Global / International
2. 🇫🇷 **France** (25 services) ← Actuel
3. 🇧🇪 België / Belgique (18 services) ← Voisin + même langue
4. 🇨🇭 Schweiz / Suisse (20 services) ← Voisin
5. 🇪🇸 España (22 services) ← Même groupe + langue latine
6. 🇮🇹 Italia (19 services) ← Même groupe + langue latine
7. 🇩🇪 Deutschland (20 services) ← Voisin
8. ... autres régions (ordre alphabétique)

**Services vedettes :**
- Canal+ (Premium français)
- Molotov TV (Gratuit français)
- RTBF Auvio (Belge francophone)
- Arte (Franco-allemand)
- France TV (Public français)

---

### **Exemple 2 : Utilisateur en Allemagne 🇩🇪**

**Liste réordonnée :**
1. 🌍 Global / International
2. 🇩🇪 **Deutschland** (20 services) ← Actuel
3. 🇦🇹 Österreich (15 services) ← Même langue
4. 🇨🇭 Schweiz / Suisse (20 services) ← Voisin + même langue
5. 🇳🇱 Nederland (16 services) ← Même groupe germanique
6. 🇧🇪 België / Belgique (18 services) ← Voisin
7. 🇫🇷 France (25 services) ← Voisin
8. ... autres régions

**Services vedettes :**
- ARD Mediathek (Public allemand)
- ZDF (Public allemand)
- RTL+ (Premium allemand)
- DAZN Deutschland (Sport)
- Joyn (Gratuit allemand)

---

### **Exemple 3 : Utilisateur en Chine 🇨🇳**

**Liste réordonnée :**
1. 🌍 Global / International
2. 🇨🇳 **中国 China** (30 services) ← Actuel
3. 🇸🇬 Singapore (12 services) ← Asie + anglais
4. ... autres régions (très éloignées)

**Services vedettes :**
- Bilibili (Chinois)
- iQIYI (Chinois)
- Youku (Chinois)
- Tencent Video (Chinois)
- WeChat (Chinois)

---

## 🚀 Implementation

### **Étapes**

1. **Créer `regionsMetadata.ts`**
   - Définir toutes les métadonnées
   - Groupes régionaux
   - Relations entre pays

2. **Modifier `LocaleContext.tsx`**
   - Ajouter `getOrderedRegions()`
   - Ajouter `getSuggestedRegions()`
   - Ajouter `getContextualLanguages()`

3. **Modifier `LocaleSelector.tsx`**
   - Sections dans le dropdown
   - Badges de nombre de services
   - Icônes des services populaires

4. **Modifier `HomePage.tsx`**
   - Services vedettes en haut
   - Services recommandés ensuite
   - Tous les services après

5. **Créer `useRegionalServices.ts`**
   - Hook pour récupérer services par région
   - Cache et optimisation

---

## 🎯 Bénéfices

### **1. UX améliorée**
✅ Liste de régions pertinente  
✅ Suggestions intelligentes  
✅ Moins de scrolling  
✅ Découverte de services proches  

### **2. Pertinence**
✅ Services adaptés au pays  
✅ Langues contextuelles  
✅ Voisins géographiques mis en avant  

### **3. Performance**
✅ Pré-calcul des suggestions  
✅ Cache des métadonnées  
✅ Lazy loading des services  

---

## 💡 Évolutions futures

1. **Machine learning**
   - Apprendre des choix de l'utilisateur
   - Suggestions personnalisées

2. **Statistiques**
   - Régions les plus consultées
   - Services les plus populaires

3. **A/B Testing**
   - Tester différents algorithmes de suggestion
   - Optimiser l'ordre des régions

4. **API externe**
   - Récupérer les services depuis un serveur
   - Mise à jour dynamique sans redéployer

---

## 🎉 Résumé

**Système de régionalisation complet et intelligent !**

🌍 **Suggestions** : Basées sur géographie + langue + services  
📊 **Métadonnées** : Enrichies pour chaque région  
🎯 **Personnalisation** : Services adaptés au pays  
🔥 **Pertinence** : Ordre dynamique des régions  
✨ **UX** : Découverte facilitée  

**Ce système transforme l'expérience utilisateur en rendant tout contextualisé et pertinent ! 🚗💙🌍**
