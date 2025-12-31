import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import {
  videoCategories,
  musicCategories,
  gamesCategories,
  otherServices,
  type PlatformLink,
} from '../data/platforms';
import { filterByRegion } from '../utils/regionFilter';
import { PlatformCard } from '../components/platforms/PlatformCard';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type ViewMode = 'grid' | 'list' | 'detailed';

// Use same localStorage keys as HomePage for consistency
const STORAGE_KEY_HIDDEN = 'xpeng-hidden-platforms';
const STORAGE_KEY_FAVORITES = 'xpeng-favorite-platforms';

const AllServicesPage: React.FC = () => {
  const { t, tPlatform, locale } = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Hidden platforms state (persisted)
  const [removedPlatforms, setRemovedPlatforms] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIDDEN);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Favorite platforms state (persisted)
  const [favoritePlatforms, setFavoritePlatforms] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist hidden platforms to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HIDDEN, JSON.stringify([...removedPlatforms]));
  }, [removedPlatforms]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify([...favoritePlatforms]));
  }, [favoritePlatforms]);

  const handleRemovePlatform = (id: string) => {
    setRemovedPlatforms(prev => new Set([...prev, id]));
  };

  const handleToggleFavorite = (id: string) => {
    setFavoritePlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setRemovedPlatforms(new Set());
    setFavoritePlatforms(new Set());
  };

  // Collect all platforms from all categories
  const allPlatforms = useMemo(() => {
    const platforms: PlatformLink[] = [];
    const seen = new Set<string>();

    const addPlatforms = (cats: typeof videoCategories) => {
      cats.forEach(cat => {
        cat.platforms.forEach(platform => {
          if (!seen.has(platform.id)) {
            seen.add(platform.id);
            platforms.push(platform);
          }
        });
      });
    };

    addPlatforms(videoCategories);
    addPlatforms(musicCategories);
    addPlatforms(gamesCategories);
    if (otherServices) addPlatforms(otherServices);

    return platforms;
  }, []);

  // Filter platforms by region, hidden status, and search
  const filteredPlatforms = useMemo(() => {
    let filtered = filterByRegion(allPlatforms, locale.region);

    // Filter out hidden platforms (unless in edit mode where we show all)
    if (!isEditMode) {
      filtered = filtered.filter(p => !removedPlatforms.has(p.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(platform =>
        platform.name.toLowerCase().includes(query) ||
        platform.description.toLowerCase().includes(query) ||
        tPlatform(platform.id).toLowerCase().includes(query) ||
        platform.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allPlatforms, locale.region, searchQuery, tPlatform, removedPlatforms, isEditMode]);

  // Get favorite platforms for the favorites section
  const favoritePlatformsList = useMemo(() => {
    return filteredPlatforms.filter(p => favoritePlatforms.has(p.id));
  }, [filteredPlatforms, favoritePlatforms]);

  // Non-favorite platforms
  const nonFavoritePlatforms = useMemo(() => {
    return filteredPlatforms.filter(p => !favoritePlatforms.has(p.id));
  }, [filteredPlatforms, favoritePlatforms]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:rounded-3xl md:p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white md:text-3xl"
              >
                {t('allServices')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-slate-300"
              >
                {t('allServicesDescription')}
              </motion.p>
            </div>

            {/* Customize / Done button */}
            <div className="flex gap-2">
              {isEditMode && (
                <button
                  onClick={handleReset}
                  className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
                >
                  {t('resetAll')}
                </button>
              )}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isEditMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isEditMode ? t('done') : t('customize')}
              </button>
            </div>
          </div>

          {/* Service count */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl font-bold text-cyan-400">{filteredPlatforms.length}</span>
            <span className="text-slate-400">{t('servicesAvailable')}</span>
          </div>

          {/* Edit mode hint */}
          {isEditMode && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-amber-300"
            >
              {t('editModeHint')}
            </motion.p>
          )}
        </div>

        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      </header>

      {/* Search and View Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('viewAll')}:</span>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
            {(['grid', 'list', 'detailed'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm transition-colors first:rounded-l-lg last:rounded-r-lg ${
                  viewMode === mode
                    ? 'bg-cyan-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {mode === 'grid' && '▦'}
                {mode === 'list' && '☰'}
                {mode === 'detailed' && '▤'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {!isEditMode && favoritePlatformsList.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20 md:p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <StarSolid className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t('favorites')}
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              ({favoritePlatformsList.length})
            </span>
          </div>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8'
              : viewMode === 'list'
              ? 'flex flex-col gap-2'
              : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
          }>
            {favoritePlatformsList.map((platform) => (
              <div key={platform.id}>
                {viewMode === 'grid' && (
                  <PlatformCard platform={platform} />
                )}
                {viewMode === 'list' && (
                  <ListItem platform={platform} tPlatform={tPlatform} isFavorite />
                )}
                {viewMode === 'detailed' && (
                  <DetailedCard platform={platform} tPlatform={tPlatform} isFavorite />
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Platforms Grid/List */}
      {filteredPlatforms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            {t('noServicesForRegion')}
          </h3>
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8'
              : viewMode === 'list'
              ? 'flex flex-col gap-2'
              : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          {(isEditMode ? filteredPlatforms : nonFavoritePlatforms).map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              {viewMode === 'grid' && (
                isEditMode ? (
                  <EditablePlatformCard
                    platform={platform}
                    isEditable={true}
                    isFavorite={favoritePlatforms.has(platform.id)}
                    onRemove={handleRemovePlatform}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <PlatformCard platform={platform} />
                )
              )}
              {viewMode === 'list' && (
                isEditMode ? (
                  <EditableListItem
                    platform={platform}
                    tPlatform={tPlatform}
                    isFavorite={favoritePlatforms.has(platform.id)}
                    onRemove={handleRemovePlatform}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <ListItem platform={platform} tPlatform={tPlatform} />
                )
              )}
              {viewMode === 'detailed' && (
                isEditMode ? (
                  <EditableDetailedCard
                    platform={platform}
                    tPlatform={tPlatform}
                    isFavorite={favoritePlatforms.has(platform.id)}
                    onRemove={handleRemovePlatform}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <DetailedCard platform={platform} tPlatform={tPlatform} />
                )
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// List view item
const ListItem: React.FC<{
  platform: PlatformLink;
  tPlatform: (id: string) => string;
  isFavorite?: boolean;
}> = ({ platform, tPlatform, isFavorite }) => {
  const description = tPlatform(platform.id) || platform.description;

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
      {isFavorite && (
        <StarSolid className="h-4 w-4 text-amber-500 flex-shrink-0" />
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-1.5 dark:bg-slate-700">
        {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
          <img src={platform.icon} alt={platform.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl">{platform.icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate">{platform.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{description}</p>
      </div>
      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
};

// Editable list view item
const EditableListItem: React.FC<{
  platform: PlatformLink;
  tPlatform: (id: string) => string;
  isFavorite: boolean;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}> = ({ platform, tPlatform, isFavorite, onRemove, onToggleFavorite }) => {
  const description = tPlatform(platform.id) || platform.description;
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-2 ring-amber-500/50 dark:bg-slate-800">
      <button
        onClick={() => onToggleFavorite(platform.id)}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          isFavorite
            ? 'bg-amber-500 text-white'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
        }`}
        title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      >
        <StarSolid className="h-4 w-4" />
      </button>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-1.5 dark:bg-slate-700">
        {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
          <img src={platform.icon} alt={platform.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl">{platform.icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate">{platform.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{description}</p>
      </div>
      <button
        onClick={() => onRemove(platform.id)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-110"
        title={t('hide')}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Detailed card view
const DetailedCard: React.FC<{
  platform: PlatformLink;
  tPlatform: (id: string) => string;
  isFavorite?: boolean;
}> = ({ platform, tPlatform, isFavorite }) => {
  const description = tPlatform(platform.id) || platform.description;

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
      <div className="flex items-start gap-4">
        {isFavorite && (
          <StarSolid className="h-4 w-4 text-amber-500 flex-shrink-0 mt-1" />
        )}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 p-2 dark:bg-slate-700">
          {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
            <img src={platform.icon} alt={platform.name} className="h-full w-full object-contain" />
          ) : (
            <span className="text-2xl">{platform.icon}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{platform.name}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {platform.tags && platform.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {platform.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
};

// Editable detailed card view
const EditableDetailedCard: React.FC<{
  platform: PlatformLink;
  tPlatform: (id: string) => string;
  isFavorite: boolean;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}> = ({ platform, tPlatform, isFavorite, onRemove, onToggleFavorite }) => {
  const description = tPlatform(platform.id) || platform.description;
  const { t } = useLocale();

  return (
    <div className="relative flex flex-col rounded-xl bg-white p-4 shadow-sm ring-2 ring-amber-500/50 dark:bg-slate-800">
      {/* Edit buttons */}
      <button
        onClick={() => onToggleFavorite(platform.id)}
        className={`absolute -left-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
          isFavorite
            ? 'bg-amber-500 text-white'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
        }`}
        title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      >
        <StarSolid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onRemove(platform.id)}
        className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
        title={t('hide')}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 p-2 dark:bg-slate-700">
          {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
            <img src={platform.icon} alt={platform.name} className="h-full w-full object-contain" />
          ) : (
            <span className="text-2xl">{platform.icon}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{platform.name}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {platform.tags && platform.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {platform.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Edit mode overlay */}
      <div className="absolute inset-0 rounded-xl bg-amber-500/10 pointer-events-none" />
    </div>
  );
};

export default AllServicesPage;
