import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FavoriteItem } from '../types/favorites';

type FavoritesContextType = {
  favorites: FavoriteItem[];
  categories: string[];
  tags: string[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => void;
  removeFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  getFavoritesByCategory: (category: string) => FavoriteItem[];
  getFavoritesByTag: (tag: string) => FavoriteItem[];
  getPinnedFavorites: () => FavoriteItem[];
  getRecentFavorites: (limit?: number) => FavoriteItem[];
  addCategory: (category: string) => void;
  addTag: (tag: string) => void;
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const EnhancedFavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Favoris par défaut
  const getDefaultFavorites = (): FavoriteItem[] => [
    { id: '1', name: 'YouTube', url: 'https://youtube.com', icon: '▶️', category: 'Vidéos', isPinned: true, visitCount: 0, tags: ['streaming', 'vidéo'], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Netflix', url: 'https://netflix.com', icon: '🎬', category: 'Vidéos', isPinned: false, visitCount: 0, tags: ['streaming', 'films'], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Spotify', url: 'https://spotify.com', icon: '🎵', category: 'Musique', isPinned: true, visitCount: 0, tags: ['streaming', 'musique'], createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Twitch', url: 'https://twitch.tv', icon: '🎮', category: 'Jeux', isPinned: false, visitCount: 0, tags: ['streaming', 'gaming'], createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Twitter', url: 'https://twitter.com', icon: '🐦', category: 'Social', isPinned: false, visitCount: 0, tags: ['réseaux sociaux'], createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Reddit', url: 'https://reddit.com', icon: '🤖', category: 'Social', isPinned: false, visitCount: 0, tags: ['forum'], createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'Gmail', url: 'https://gmail.com', icon: '✉️', category: 'Utilitaires', isPinned: true, visitCount: 0, tags: ['email'], createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Google Drive', url: 'https://drive.google.com', icon: '📁', category: 'Utilitaires', isPinned: false, visitCount: 0, tags: ['stockage'], createdAt: new Date(), updatedAt: new Date() },
  ];

  const getDefaultCategories = (): string[] => ['Vidéos', 'Musique', 'Jeux', 'Social', 'Utilitaires', 'Actualités', 'Sport', 'Shopping'];

  // Charger les données depuis le stockage local
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt' || key === 'lastVisited') {
            return new Date(value);
          }
          return value;
        });
        setFavorites(parsed.length > 0 ? parsed : getDefaultFavorites());
      } else {
        // Première visite - charger les favoris par défaut
        const defaults = getDefaultFavorites();
        setFavorites(defaults);
        localStorage.setItem('favorites', JSON.stringify(defaults));
      }

      const savedCategories = localStorage.getItem('favoriteCategories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        setCategories(parsed.length > 0 ? parsed : getDefaultCategories());
      } else {
        const defaults = getDefaultCategories();
        setCategories(defaults);
        localStorage.setItem('favoriteCategories', JSON.stringify(defaults));
      }

      const savedTags = localStorage.getItem('favoriteTags');
      if (savedTags) {
        setTags(JSON.parse(savedTags));
      }
    };

    loadFromLocalStorage();
  }, []);

  // Sauvegarder dans le stockage local à chaque modification
  const saveToLocalStorage = useCallback((newFavorites: FavoriteItem[]) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    localStorage.setItem('favoriteCategories', JSON.stringify(categories));
    localStorage.setItem('favoriteTags', JSON.stringify(tags));
  }, [categories, tags]);

  // Ajouter un favori
  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      id: Date.now().toString(),
      isPinned: false,
      visitCount: 0,
      tags: item.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setFavorites(prev => {
      const updated = [...prev, newFavorite];
      saveToLocalStorage(updated);
      return updated;
    });

    // Mettre à jour les catégories et tags si nécessaire
    if (!categories.includes(item.category)) {
      const newCategories = [...categories, item.category];
      setCategories(newCategories);
      localStorage.setItem('favoriteCategories', JSON.stringify(newCategories));
    }

    if (item.tags) {
      const newTags = Array.from(new Set([...tags, ...item.tags]));
      if (newTags.length > tags.length) {
        setTags(newTags);
        localStorage.setItem('favoriteTags', JSON.stringify(newTags));
      }
    }
  }, [categories, tags, saveToLocalStorage]);

  // Mettre à jour un favori
  const updateFavorite = useCallback((id: string, updates: Partial<FavoriteItem>) => {
    setFavorites(prev => {
      const updated = prev.map(fav => 
        fav.id === id ? { ...fav, ...updates, updatedAt: new Date() } : fav
      );
      saveToLocalStorage(updated);
      return updated;
    });
  }, [saveToLocalStorage]);

  // Supprimer un favori
  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  }, [saveToLocalStorage]);

  // Épingler/Désépingler un favori
  const togglePin = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.map(fav => 
        fav.id === id ? { ...fav, isPinned: !fav.isPinned, updatedAt: new Date() } : fav
      );
      saveToLocalStorage(updated);
      return updated;
    });
  }, [saveToLocalStorage]);

  // Ajouter une catégorie
  const addCategory = useCallback((category: string) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      localStorage.setItem('favoriteCategories', JSON.stringify(newCategories));
    }
  }, [categories]);

  // Ajouter un tag
  const addTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      localStorage.setItem('favoriteTags', JSON.stringify(newTags));
    }
  }, [tags]);

  // Fonctions utilitaires
  const getFavoritesByCategory = useCallback((category: string) => {
    return favorites.filter(fav => fav.category === category);
  }, [favorites]);

  const getFavoritesByTag = useCallback((tag: string) => {
    return favorites.filter(fav => fav.tags?.includes(tag));
  }, [favorites]);

  const getPinnedFavorites = useCallback(() => {
    return favorites.filter(fav => fav.isPinned);
  }, [favorites]);

  const getRecentFavorites = useCallback((limit: number = 5) => {
    return [...favorites]
      .sort((a, b) => (b.lastVisited?.getTime() || 0) - (a.lastVisited?.getTime() || 0))
      .slice(0, limit);
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        categories,
        tags,
        addFavorite,
        updateFavorite,
        removeFavorite,
        togglePin,
        getFavoritesByCategory,
        getFavoritesByTag,
        getPinnedFavorites,
        getRecentFavorites,
        addCategory,
        addTag,
        isFormOpen,
        setIsFormOpen
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useEnhancedFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useEnhancedFavorites must be used within an EnhancedFavoritesProvider');
  }
  return context;
};
