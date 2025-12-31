// Updated FavoritesPage.tsx with full i18n support
// Replace your existing src/pages/FavoritesPage.tsx with this file

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useFavorites } from '../context/FavoritesContext';
import { PlatformCard } from '../components/platforms/PlatformCard';

type SortOption = 'alphabetical' | 'recent' | 'popular' | 'category';

const FavoritesPage: React.FC = () => {
  const { t } = useLocale();
  const { favorites, pinnedFavorites, recentFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from favorites
  const categories = useMemo(() => {
    const cats = new Set<string>();
    favorites.forEach(fav => {
      if (fav.category) cats.add(fav.category);
    });
    return Array.from(cats);
  }, [favorites]);

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let filtered = [...favorites];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fav =>
        fav.name.toLowerCase().includes(query) ||
        fav.url.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(fav => fav.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      // recent and popular use default order from context
    }

    return filtered;
  }, [favorites, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white md:rounded-3xl md:p-8">
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold md:text-3xl"
          >
            {/* ✅ Translated title */}
            {t('myFavorites')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-rose-100"
          >
            {favorites.length} {t('servicesAvailable')}
          </motion.p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('favoritesSearchPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">{t('favoritesFilterAllCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="recent">{t('favoritesSortRecent')}</option>
            <option value="alphabetical">{t('favoritesSortAlphabetical')}</option>
            <option value="popular">{t('favoritesSortPopular')}</option>
            <option value="category">{t('favoritesSortCategory')}</option>
          </select>
        </div>
      </div>

      {/* Pinned Favorites */}
      {pinnedFavorites && pinnedFavorites.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <span>📌</span>
            {t('favoritesPinnedTitle')}
          </h2>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {pinnedFavorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FavoriteCard favorite={favorite} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Favorites */}
      {recentFavorites && recentFavorites.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <span>🕐</span>
            {t('favoritesRecentTitle')}
          </h2>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {recentFavorites.slice(0, 8).map((favorite) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FavoriteCard favorite={favorite} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Favorites */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span>⭐</span>
          {t('favoritesAllTitle')}
        </h2>
        
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-100 py-16 text-center dark:bg-slate-800">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              {t('favoritesEmptyTitle')}
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t('favoritesEmptyDescription')}
            </p>
            <button className="mt-4 rounded-full bg-rose-500 px-6 py-2 text-white transition-colors hover:bg-rose-600">
              {t('addFavorite')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {filteredFavorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <FavoriteCard favorite={favorite} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Favorite card component
interface FavoriteCardProps {
  favorite: {
    id: string;
    name: string;
    url: string;
    icon: string;
    category?: string;
  };
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite }) => {
  return (
    <a
      href={favorite.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:scale-105 dark:bg-slate-800"
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl dark:bg-slate-700">
        {favorite.icon}
      </div>
      <h3 className="text-center text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
        {favorite.name}
      </h3>
      {favorite.category && (
        <span className="mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {favorite.category}
        </span>
      )}
    </a>
  );
};

export default FavoritesPage;
