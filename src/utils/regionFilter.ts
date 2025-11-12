// Utilitaire pour filtrer les services selon la région sélectionnée
import type { Region } from '../context/LocaleContext';
import type { PlatformLink } from '../data/platforms';
import { regionsMetadata } from '../data/regionsMetadata';

// Mapping des régions vers leurs groupes d'availability
const regionToAvailabilityMap: Record<Region, string[]> = {
  'global': ['global'],
  
  // Europe Western
  'france': ['global', 'europe', 'western_europe', 'france'],
  'spain': ['global', 'europe', 'western_europe', 'spain'],
  'italy': ['global', 'europe', 'western_europe', 'italy'],
  'belgium': ['global', 'europe', 'western_europe', 'belgium'],
  
  // Europe Northern
  'germany': ['global', 'europe', 'northern_europe', 'germany'],
  'austria': ['global', 'europe', 'northern_europe', 'austria'],
  'switzerland': ['global', 'europe', 'northern_europe', 'switzerland'],
  'netherlands': ['global', 'europe', 'northern_europe', 'netherlands'],
  
  // Europe Nordic
  'sweden': ['global', 'europe', 'nordic', 'sweden'],
  'norway': ['global', 'europe', 'nordic', 'norway'],
  'denmark': ['global', 'europe', 'nordic', 'denmark'],
  
  // Anglophones
  'uk': ['global', 'europe', 'anglophone', 'uk'],
  'usa': ['global', 'north_america', 'anglophone', 'usa'],
  'australia': ['global', 'oceania', 'anglophone', 'australia'],
  
  // Asie
  'china': ['global', 'asia', 'east_asia', 'china'],
  'singapore': ['global', 'asia', 'southeast_asia', 'singapore'],
  
  // Moyen-Orient
  'uae': ['global', 'middle_east', 'uae'],
  'qatar': ['global', 'middle_east', 'qatar'],
  'israel': ['global', 'middle_east', 'israel'],
};

/**
 * Filtre les services disponibles pour une région donnée
 * Inclut TOUJOURS les services globaux + les services de la région
 */
export function filterPlatformsByRegion(platforms: PlatformLink[], userRegion: Region): PlatformLink[] {
  // Récupérer les availability acceptables pour cette région
  const acceptedAvailability = regionToAvailabilityMap[userRegion] || ['global'];
  
  console.log(`🌍 Filtrage pour région: ${userRegion}`, {
    acceptedAvailability,
    totalPlatforms: platforms.length
  });
  
  // Filtrer les plateformes
  const filtered = platforms.filter(platform => {
    // Vérifier si au moins une des availability de la plateforme correspond
    const isAvailable = platform.availability.some((avail: string) => 
      acceptedAvailability.includes(avail)
    );
    
    if (!isAvailable) {
      console.log(`❌ ${platform.name} non disponible pour ${userRegion}`, {
        platformAvailability: platform.availability,
        acceptedAvailability
      });
    }
    
    return isAvailable;
  });
  
  console.log(`✅ ${filtered.length} services disponibles pour ${userRegion}`);
  
  return filtered;
}

/**
 * Compte les services disponibles par catégorie pour une région
 */
export function countPlatformsByCategory(
  platforms: PlatformLink[],
  userRegion: Region
): number {
  const filtered = filterPlatformsByRegion(platforms, userRegion);
  return filtered.length;
}

/**
 * Obtient la liste des régions suggérées basées sur la région actuelle
 */
export function getSuggestedRegionsForUser(userRegion: Region): Region[] {
  const metadata = regionsMetadata.find(r => r.code === userRegion);
  if (!metadata) return [];
  
  const suggestions = new Set<Region>();
  
  // Ajouter les voisins
  metadata.neighbors.forEach(n => suggestions.add(n));
  
  // Ajouter les régions du même groupe
  regionsMetadata
    .filter(r => r.group === metadata.group && r.code !== userRegion)
    .forEach(r => suggestions.add(r.code));
  
  return Array.from(suggestions);
}
