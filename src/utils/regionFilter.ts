// Utilitaire pour filtrer les services selon la région sélectionnée
import type { Region } from '../context/LocaleContext';
import type { PlatformLink } from '../data/platforms';
import { regionsMetadata } from '../data/regionsMetadata';

// Mapping des régions vers leurs groupes d'availability
// IMPORTANT : utiliser uniquement des valeurs réellement présentes dans AvailabilityScope
// pour garantir que le filtrage renvoie bien les bons services.
const regionToAvailabilityMap: Record<Region, string[]> = {
  global: ['global'],

  // Europe de l'Ouest
  france: ['global', 'europe', 'western_europe', 'france'],
  spain: ['global', 'europe', 'western_europe', 'spain'],
  italy: ['global', 'europe', 'western_europe', 'italy'],
  belgium: ['global', 'europe', 'western_europe'],

  // Europe centre / nord
  germany: ['global', 'europe', 'northern_europe', 'germany'],
  austria: ['global', 'europe', 'northern_europe'],
  switzerland: ['global', 'europe', 'northern_europe'],
  netherlands: ['global', 'europe', 'northern_europe'],
  sweden: ['global', 'europe', 'northern_europe'],
  norway: ['global', 'europe', 'northern_europe'],
  denmark: ['global', 'europe', 'northern_europe'],

  // Anglophones
  uk: ['global', 'europe', 'anglophone', 'uk'],
  usa: ['global', 'north-america', 'anglophone'],
  australia: ['global', 'australia', 'anglophone'],

  // Asie
  // Chine continentale : on NE prend PAS 'global' pour éviter les services bloqués,
  // uniquement les services marqués explicitement 'asia' ou 'china'.
  china: ['asia', 'china'],
  // Autres régions asiatiques gardent 'global' + 'asia'.
  singapore: ['global', 'asia', 'anglophone'],

  // Moyen-Orient
  uae: ['global', 'middle-east'],
  qatar: ['global', 'middle-east'],
  israel: ['global', 'middle-east'],
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

// Alias for backwards compatibility
export const filterByRegion = filterPlatformsByRegion;
