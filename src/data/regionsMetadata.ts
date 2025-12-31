import type { Region } from '../context/LocaleContext';

export interface RegionMetadata {
  code: Region;
  name: string;
  flag: string;
  languages: string[];
  group: string;
  neighbors: Region[];
}

export const regionsMetadata: RegionMetadata[] = [
  {
    code: 'global',
    name: 'Global / International',
    flag: '🌍',
    languages: ['en'],
    group: 'global',
    neighbors: [],
  },
  // Europe de l'Ouest (langues latines)
  {
    code: 'france',
    name: 'France',
    flag: '🇫🇷',
    languages: ['fr'],
    group: 'western_europe',
    neighbors: ['belgium', 'switzerland', 'spain', 'italy', 'germany'],
  },
  {
    code: 'spain',
    name: 'España',
    flag: '🇪🇸',
    languages: ['es'],
    group: 'western_europe',
    neighbors: ['france'],
  },
  {
    code: 'italy',
    name: 'Italia',
    flag: '🇮🇹',
    languages: ['it'],
    group: 'western_europe',
    neighbors: ['france', 'switzerland', 'austria'],
  },
  {
    code: 'belgium',
    name: 'België / Belgique',
    flag: '🇧🇪',
    languages: ['nl', 'fr'],
    group: 'western_europe',
    neighbors: ['france', 'netherlands', 'germany'],
  },
  // Europe du Nord (langues germaniques)
  {
    code: 'germany',
    name: 'Deutschland',
    flag: '🇩🇪',
    languages: ['de'],
    group: 'northern_europe',
    neighbors: ['austria', 'switzerland', 'netherlands', 'belgium', 'france'],
  },
  {
    code: 'austria',
    name: 'Österreich',
    flag: '🇦🇹',
    languages: ['de'],
    group: 'northern_europe',
    neighbors: ['germany', 'switzerland', 'italy'],
  },
  {
    code: 'switzerland',
    name: 'Schweiz / Suisse',
    flag: '🇨🇭',
    languages: ['de', 'fr', 'it'],
    group: 'northern_europe',
    neighbors: ['france', 'germany', 'austria', 'italy'],
  },
  {
    code: 'netherlands',
    name: 'Nederland',
    flag: '🇳🇱',
    languages: ['nl'],
    group: 'northern_europe',
    neighbors: ['belgium', 'germany'],
  },
  // Europe du Nord (scandinave)
  {
    code: 'sweden',
    name: 'Sverige',
    flag: '🇸🇪',
    languages: ['sv'],
    group: 'nordic',
    neighbors: ['norway', 'denmark'],
  },
  {
    code: 'norway',
    name: 'Norge',
    flag: '🇳🇴',
    languages: ['no'],
    group: 'nordic',
    neighbors: ['sweden', 'denmark'],
  },
  {
    code: 'denmark',
    name: 'Danmark',
    flag: '🇩🇰',
    languages: ['da'],
    group: 'nordic',
    neighbors: ['sweden', 'norway', 'germany'],
  },
  // Pays anglophones
  {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    languages: ['en'],
    group: 'anglophone',
    neighbors: [],
  },
  {
    code: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    languages: ['en'],
    group: 'anglophone',
    neighbors: [],
  },
  {
    code: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    languages: ['en'],
    group: 'anglophone',
    neighbors: [],
  },
  {
    code: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    languages: ['en', 'zh'],
    group: 'asia',
    neighbors: [],
  },
  // Moyen-Orient
  {
    code: 'uae',
    name: 'UAE الإمارات',
    flag: '🇦🇪',
    languages: ['ar'],
    group: 'middle_east',
    neighbors: ['qatar'],
  },
  {
    code: 'qatar',
    name: 'Qatar قطر',
    flag: '🇶🇦',
    languages: ['ar'],
    group: 'middle_east',
    neighbors: ['uae'],
  },
  {
    code: 'israel',
    name: 'Israel ישראל',
    flag: '🇮🇱',
    languages: ['he', 'ar'],
    group: 'middle_east',
    neighbors: [],
  },
  // Asie
  {
    code: 'china',
    name: '中国 China',
    flag: '🇨🇳',
    languages: ['zh'],
    group: 'asia',
    neighbors: ['singapore'],
  },
];

export function getSuggestedRegions(currentRegion: Region): Region[] {
  const metadata = regionsMetadata.find(r => r.code === currentRegion);
  if (!metadata) return [];
  
  const suggestions = new Set<Region>();
  
  // Priorité 1 : Voisins directs
  metadata.neighbors.forEach(n => suggestions.add(n));
  
  // Priorité 2 : Même groupe (sauf le pays actuel)
  regionsMetadata
    .filter(r => r.group === metadata.group && r.code !== currentRegion)
    .forEach(r => suggestions.add(r.code));
  
  return Array.from(suggestions);
}

export function getOrderedRegions(userRegion: Region): RegionMetadata[] {
  const current = regionsMetadata.find(r => r.code === userRegion);
  const suggestions = getSuggestedRegions(userRegion);
  const globalRegion = regionsMetadata.find(r => r.code === 'global')!;
  
  const ordered: RegionMetadata[] = [];
  
  // 1. Global (toujours en premier)
  ordered.push(globalRegion);
  
  // 2. Région actuelle
  if (current && current.code !== 'global') {
    ordered.push(current);
  }
  
  // 3. Régions suggérées
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
    .filter(r => r.code !== 'global' && !ordered.find(o => o.code === r.code))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(r => ordered.push(r));
  
  return ordered;
}

export function getRegionsByGroup(): Record<string, RegionMetadata[]> {
  const groups: Record<string, RegionMetadata[]> = {};
  
  regionsMetadata.forEach(region => {
    if (region.code === 'global') return;
    
    if (!groups[region.group]) {
      groups[region.group] = [];
    }
    groups[region.group]!.push(region);
  });
  
  return groups;
}
