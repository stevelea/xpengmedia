import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import {
  videoCategories,
  musicCategories,
  gamesCategories,
  otherServices,
  type PlatformLink
} from '../data/platforms';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { filterByRegion } from '../utils/regionFilter';
import { PencilIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { debouncedSyncDashboard, fetchDashboardFromCloud } from '../services/syncService';

const STORAGE_KEY_HIDDEN = 'xpeng-hidden-platforms';
const STORAGE_KEY_FAVORITES = 'xpeng-favorite-platforms';

const HomePage: React.FC = () => {
  const { t, tCategory, locale } = useLocale();
  const { user, isAuthenticated } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const hasLoadedFromCloud = useRef(false);

  const [removedPlatforms, setRemovedPlatforms] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIDDEN);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [favoritePlatforms, setFavoritePlatforms] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Load from cloud when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && !hasLoadedFromCloud.current) {
      hasLoadedFromCloud.current = true;
      fetchDashboardFromCloud(user.id).then(cloudDashboard => {
        if (cloudDashboard) {
          if (cloudDashboard.hidden_platforms?.length > 0) {
            setRemovedPlatforms(new Set(cloudDashboard.hidden_platforms));
          }
          if (cloudDashboard.favorite_platforms?.length > 0) {
            setFavoritePlatforms(new Set(cloudDashboard.favorite_platforms));
          }
        }
      });
    }
  }, [isAuthenticated, user?.id]);

  // Persist to localStorage and sync to cloud
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HIDDEN, JSON.stringify([...removedPlatforms]));

    // Sync to cloud if authenticated
    if (isAuthenticated && user?.id) {
      debouncedSyncDashboard(user.id, [...removedPlatforms], [...favoritePlatforms]);
    }
  }, [removedPlatforms, isAuthenticated, user?.id, favoritePlatforms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify([...favoritePlatforms]));

    // Sync to cloud if authenticated
    if (isAuthenticated && user?.id) {
      debouncedSyncDashboard(user.id, [...removedPlatforms], [...favoritePlatforms]);
    }
  }, [favoritePlatforms, isAuthenticated, user?.id, removedPlatforms]);

  // Get all platforms for favorites lookup
  const getAllPlatforms = (): PlatformLink[] => {
    const allCategories = [
      ...videoCategories,
      ...musicCategories,
      ...gamesCategories,
      ...(otherServices || []),
    ];
    return allCategories.flatMap(cat => cat.platforms);
  };

  // Filter platforms by region
  const getVisiblePlatforms = (platforms: PlatformLink[]): PlatformLink[] => {
    return filterByRegion(platforms, locale.region)
      .filter(p => !removedPlatforms.has(p.id));
  };

  // Get favorite platforms
  const getFavoritePlatformsList = (): PlatformLink[] => {
    const allPlatforms = getAllPlatforms();
    return [...favoritePlatforms]
      .map(id => allPlatforms.find(p => p.id === id))
      .filter((p): p is PlatformLink => p !== undefined)
      .filter(p => !removedPlatforms.has(p.id));
  };

  const handleRemovePlatform = (id: string) => {
    setRemovedPlatforms(prev => new Set([...prev, id]));
    // Also remove from favorites if hidden
    setFavoritePlatforms(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleToggleFavorite = (id: string) => {
    setFavoritePlatforms(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setRemovedPlatforms(new Set());
    setFavoritePlatforms(new Set());
  };

  // Get localized category data
  const getLocalizedCategory = (category: typeof videoCategories[0]) => {
    const trans = tCategory(category.id);
    return {
      ...category,
      title: trans.title || category.title,
      subtitle: trans.subtitle || category.subtitle,
    };
  };

  // Combine streaming categories for main section
  const streamingCategory = videoCategories.find(cat => cat.id === 'streaming-vod');
  const freeTvCategory = videoCategories.find(cat => cat.id === 'free-tv');
  const europeCategory = videoCategories.find(cat => cat.id === 'europe');

  const mainStreamingPlatforms = [
    ...(streamingCategory?.platforms || []),
    ...(freeTvCategory?.platforms || []),
    ...(europeCategory?.platforms || []),
  ];

  // Get other video categories (excluding merged ones)
  const otherVideoCategories = videoCategories.filter(
    cat => !['streaming-vod', 'free-tv', 'europe'].includes(cat.id)
  );

  // Other services categories
  const otherServicesCategories = otherServices || [];

  const favoritePlatformsList = getFavoritePlatformsList();

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Hero Section */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-600 p-[1px] shadow-xl md:rounded-4xl">
        <div className="rounded-[calc(1rem-1px)] bg-slate-950/60 px-4 py-8 backdrop-blur-xl md:rounded-[calc(2rem-1px)] md:px-12 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 md:text-sm">XPENG MEDIA HUB</p>
                <h1 className="mt-2 text-2xl font-semibold md:mt-3 md:text-4xl lg:text-5xl">
                  {t('heroTitle')}
                </h1>
                <p className="mt-2 text-sm text-white/70 md:mt-4 md:text-base lg:text-lg">
                  {t('heroSubtitle')}
                </p>
              </div>

              {/* Customize Button */}
              <div className="flex gap-2">
                {isEditMode && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/30 md:px-4 md:text-sm"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span className="hidden md:inline">{t('resetAll')}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition md:px-4 md:text-sm ${
                    isEditMode
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {isEditMode ? (
                    <>
                      <XMarkIcon className="h-4 w-4" />
                      <span className="hidden md:inline">{t('done')}</span>
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4" />
                      <span className="hidden md:inline">{t('customize')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {t('editModeHint')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Section */}
      <AnimatePresence>
        {favoritePlatformsList.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-2 overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3 shadow-md backdrop-blur-xl dark:border-amber-500/20 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-1 w-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 md:h-1 md:w-12" />
                    <h2 className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl">
                      {t('favorites')}
                    </h2>
                  </div>
                  <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {t('favoritesSubtitle')}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                    {favoritePlatformsList.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {favoritePlatformsList.map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  isFavorite={true}
                  onRemove={handleRemovePlatform}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Streaming Section */}
      {streamingCategory && getVisiblePlatforms(mainStreamingPlatforms).length > 0 && (
        <section>
          <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${streamingCategory.colorFrom} ${streamingCategory.colorTo} md:h-1 md:w-12`} />
                  <h2 className={`bg-gradient-to-r ${streamingCategory.colorFrom} ${streamingCategory.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                    {tCategory('streaming-vod').title}
                  </h2>
                </div>
                <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                  {tCategory('streaming-vod').subtitle}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                  {getVisiblePlatforms(mainStreamingPlatforms).length}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 md:hidden">
                  apps
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
            {getVisiblePlatforms(mainStreamingPlatforms).slice(0, 16).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                isFavorite={favoritePlatforms.has(platform.id)}
                onRemove={handleRemovePlatform}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Music Section */}
      {musicCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => {
        const localizedCat = getLocalizedCategory(category);
        return (
          <section key={category.id}>
            <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {localizedCat.title}
                    </h2>
                  </div>
                  <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {localizedCat.subtitle}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                    {getVisiblePlatforms(category.platforms).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  isFavorite={favoritePlatforms.has(platform.id)}
                  onRemove={handleRemovePlatform}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Games Section */}
      {gamesCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => {
        const localizedCat = getLocalizedCategory(category);
        return (
          <section key={category.id}>
            <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {localizedCat.title}
                    </h2>
                  </div>
                  <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {localizedCat.subtitle}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                    {getVisiblePlatforms(category.platforms).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  isFavorite={favoritePlatforms.has(platform.id)}
                  onRemove={handleRemovePlatform}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Other Video Categories */}
      {otherVideoCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => {
        const localizedCat = getLocalizedCategory(category);
        return (
          <section key={category.id}>
            <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {localizedCat.title}
                    </h2>
                  </div>
                  <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {localizedCat.subtitle}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                    {getVisiblePlatforms(category.platforms).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  isFavorite={favoritePlatforms.has(platform.id)}
                  onRemove={handleRemovePlatform}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Other Services */}
      {otherServicesCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => {
        const localizedCat = getLocalizedCategory(category);
        return (
          <section key={category.id}>
            <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {localizedCat.title}
                    </h2>
                  </div>
                  <p className="mt-1 ml-8 text-[11px] leading-tight text-slate-600 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {localizedCat.subtitle}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 md:text-xl">
                    {getVisiblePlatforms(category.platforms).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  isFavorite={favoritePlatforms.has(platform.id)}
                  onRemove={handleRemovePlatform}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
