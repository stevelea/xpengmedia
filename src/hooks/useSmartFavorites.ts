import { useState, useEffect } from 'react';
import type { PlatformLink } from '../data/platforms';

interface UsageStats {
  [platformId: string]: {
    clicks: number;
    lastUsed: number;
    firstUsed: number;
  };
}

const STORAGE_KEY = 'xpeng_usage_stats';
const MAX_SMART_FAVORITES = 8;

// Services pré-sélectionnés par défaut (les plus populaires)
const DEFAULT_FAVORITES = [
  'netflix',
  'youtube',
  'spotify',
  'disney-plus',
  'prime-video',
  'apple-music',
  'geforce-now',
  'plugshare'
];

export const useSmartFavorites = (allPlatforms: PlatformLink[]) => {
  const [usageStats, setUsageStats] = useState<UsageStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  });

  // Charger les stats au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsageStats(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usageStats));
  }, [usageStats]);

  // Calculer le score intelligent pour chaque plateforme
  const calculateScore = (platformId: string): number => {
    const stats = usageStats[platformId];
    if (!stats) return 0;

    const now = Date.now();
    const daysSinceFirstUse = (now - stats.firstUsed) / (1000 * 60 * 60 * 24);
    const daysSinceLastUse = (now - stats.lastUsed) / (1000 * 60 * 60 * 24);

    // Formule intelligente :
    // - Plus de clics = meilleur score
    // - Utilisation récente = bonus
    // - Pénalité si pas utilisé depuis longtemps
    const clickScore = stats.clicks * 100;
    const recencyBonus = Math.max(0, 50 - daysSinceLastUse * 5);
    const consistencyBonus = Math.min(30, daysSinceFirstUse * 2);
    
    return clickScore + recencyBonus + consistencyBonus;
  };

  // Obtenir les favoris intelligents
  const getSmartFavorites = (): PlatformLink[] => {
    // Si aucune statistique, retourner les favoris par défaut
    const hasUsageData = Object.keys(usageStats).length > 0;
    
    if (!hasUsageData) {
      return allPlatforms.filter(p => DEFAULT_FAVORITES.includes(p.id));
    }

    // Calculer les scores et trier
    const scored = allPlatforms.map(platform => ({
      platform,
      score: calculateScore(platform.id)
    }));

    // Trier par score décroissant
    scored.sort((a, b) => b.score - a.score);

    // Prendre les MAX_SMART_FAVORITES premiers avec un score > 0
    const smartFavs = scored
      .filter(s => s.score > 0)
      .slice(0, MAX_SMART_FAVORITES)
      .map(s => s.platform);

    // Si moins de 8, compléter avec les favoris par défaut
    if (smartFavs.length < MAX_SMART_FAVORITES) {
      const defaultPlatforms = allPlatforms.filter(p => 
        DEFAULT_FAVORITES.includes(p.id) && 
        !smartFavs.find(sf => sf.id === p.id)
      );
      return [...smartFavs, ...defaultPlatforms].slice(0, MAX_SMART_FAVORITES);
    }

    return smartFavs;
  };

  // Enregistrer un clic
  const trackClick = (platformId: string) => {
    setUsageStats(prev => {
      const now = Date.now();
      const existing = prev[platformId];

      return {
        ...prev,
        [platformId]: {
          clicks: (existing?.clicks || 0) + 1,
          lastUsed: now,
          firstUsed: existing?.firstUsed || now,
        }
      };
    });
  };

  // Obtenir les stats d'un service
  const getStats = (platformId: string) => {
    return usageStats[platformId] || { clicks: 0, lastUsed: 0, firstUsed: 0 };
  };

  // Réinitialiser les stats (pour debug ou reset utilisateur)
  const resetStats = () => {
    setUsageStats({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    smartFavorites: getSmartFavorites(),
    trackClick,
    getStats,
    resetStats,
    hasUsageData: Object.keys(usageStats).length > 0,
  };
};
