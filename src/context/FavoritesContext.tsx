import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Country = {
  code: string;
  name: string;
  flag: string;
  language: string;
};

type FavoriteItem = {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  countries?: string[]; // Codes de pays pour lesquels ce favori est disponible
  isInternational?: boolean; // Si vrai, disponible dans tous les pays
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id'>) => void;
  removeFavorite: (id: string) => void;
  getFavoritesByCategory: (category: string, countryCode?: string) => FavoriteItem[];
  categories: string[];
  countries: Country[];
  currentCountry: string;
  setCurrentCountry: (countryCode: string) => void;
  getCurrentCountry: () => Country | undefined;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Liste des pays supportés avec leurs drapeaux
const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'fr' },
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'en' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'en' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'de' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'es' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', language: 'it' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', language: 'ja' },
  { code: 'CN', name: 'China', flag: '🇨🇳', language: 'zh' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', language: 'pt' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', language: 'ru' },
];

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // Charger les favoris depuis le stockage local au démarrage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentCountry, setCurrentCountryState] = useState<string>('FR');

  // Sauvegarder les favoris dans le stockage local à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Charger le pays depuis le stockage local ou détecter la langue du navigateur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('preferredCountry');
      if (savedCountry) {
        setCurrentCountryState(savedCountry);
      } else {
        // Détecter la langue du navigateur
        const browserLanguage = navigator.language.split('-')[0];
        const detectedCountry = SUPPORTED_COUNTRIES.find(
          (c) => c.language === browserLanguage
        );
        if (detectedCountry) {
          setCurrentCountryState(detectedCountry.code);
        }
      }
    }
  }, []);

  const setCurrentCountry = (countryCode: string) => {
    setCurrentCountryState(countryCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredCountry', countryCode);
    }
  };

  const getCurrentCountry = () => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === currentCountry);
  };

  const addFavorite = (item: Omit<FavoriteItem, 'id'>) => {
    const newFavorite = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setFavorites((prev) => [...prev, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const getFavoritesByCategory = (category: string, countryCode: string = currentCountry) => {
    return favorites.filter((item) => {
      const isInCategory = item.category === category;
      const isAvailableInCountry = item.isInternational || 
                                 !item.countries || 
                                 item.countries.includes(countryCode);
      return isInCategory && isAvailableInCountry;
    });
  };

  // Catégories disponibles
  const categories = [
    'Vidéos',
    'Musique',
    'Jeux',
    'Réseaux sociaux',
    'Actualités',
    'Utilitaires',
    'Véhicule',
    'Météo',
    'Sport',
    'Éducation',
    'Santé',
    'Voyages',
    'Cuisine',
    'Technologie',
    'Finance',
    'Shopping',
    'Autres'
  ];

  // Favoris par défaut
  useEffect(() => {
    const defaultFavorites: FavoriteItem[] = [
      // Streaming Vidéo International
      { 
        id: 'int1', 
        name: 'YouTube', 
        url: 'https://youtube.com', 
        icon: '▶️', 
        category: 'Vidéos',
        isInternational: true
      },
      { 
        id: 'int2', 
        name: 'Netflix', 
        url: 'https://netflix.com', 
        icon: '🎬', 
        category: 'Vidéos',
        isInternational: true
      },
      
      // France
      {
        id: 'fr1',
        name: 'TF1',
        url: 'https://www.tf1.fr',
        icon: '📺',
        category: 'Vidéos',
        countries: ['FR']
      },
      {
        id: 'fr2',
        name: 'France TV',
        url: 'https://www.france.tv',
        icon: '📺',
        category: 'Vidéos',
        countries: ['FR']
      },
      
      // USA
      {
        id: 'us1',
        name: 'HBO Max',
        url: 'https://www.hbomax.com',
        icon: '🎥',
        category: 'Vidéos',
        countries: ['US']
      },
      {
        id: 'us2',
        name: 'Hulu',
        url: 'https://www.hulu.com',
        icon: '🎬',
        category: 'Vidéos',
        countries: ['US']
      },
      
      // UK
      {
        id: 'uk1',
        name: 'BBC iPlayer',
        url: 'https://www.bbc.co.uk/iplayer',
        icon: '📡',
        category: 'Vidéos',
        countries: ['GB']
      },
      
      // Allemagne
      {
        id: 'de1',
        name: 'ARD Mediathek',
        url: 'https://www.ardmediathek.de',
        icon: '📺',
        category: 'Vidéos',
        countries: ['DE']
      },
      
      // Musique Internationale
      { 
        id: 'music1', 
        name: 'Spotify', 
        url: 'https://spotify.com', 
        icon: '🎵', 
        category: 'Musique',
        isInternational: true 
      },
      
      // Jeux
      { 
        id: 'game1', 
        name: 'Twitch', 
        url: 'https://twitch.tv', 
        icon: '🎮', 
        category: 'Jeux',
        isInternational: true 
      },
      
      // Réseaux sociaux
      { 
        id: 'social1', 
        name: 'Twitter', 
        url: 'https://twitter.com', 
        icon: '🐦', 
        category: 'Réseaux sociaux',
        isInternational: true 
      },
      
      // Actualités
      { 
        id: 'news1', 
        name: 'Google Actualités', 
        url: 'https://news.google.com', 
        icon: '📰', 
        category: 'Actualités',
        isInternational: true 
      },
      
      // Météo
      { 
        id: 'weather1', 
        name: 'Météo France', 
        url: 'https://meteofrance.com', 
        icon: '☀️', 
        category: 'Météo',
        countries: ['FR']
      },
      
      // Sport
      { 
        id: 'sport1', 
        name: 'ESPN', 
        url: 'https://www.espn.com', 
        icon: '⚽', 
        category: 'Sport',
        countries: ['US']
      },
      
      // Autres exemples par pays...
    ];

    const savedFavorites = localStorage.getItem('favorites');
    if (!savedFavorites || JSON.parse(savedFavorites).length === 0) {
      localStorage.setItem('favorites', JSON.stringify(defaultFavorites));
      setFavorites(defaultFavorites);
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        getFavoritesByCategory,
        categories,
        countries: SUPPORTED_COUNTRIES,
        currentCountry,
        setCurrentCountry,
        getCurrentCountry,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
