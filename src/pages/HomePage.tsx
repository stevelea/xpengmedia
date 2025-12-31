// Updated HomePage.tsx with full i18n support
// Replace your existing src/pages/HomePage.tsx with this file

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { 
  videoCategories, 
  musicCategories, 
  gamesCategories, 
  otherServices,
  type PlatformLink,
  type AvailabilityScope 
} from '../data/platforms';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { filterByRegion } from '../utils/regionFilter';

const HomePage: React.FC = () => {
  const { t, tCategory, locale } = useLocale();
  const [isEditMode, setIsEditMode] = useState(false);
  const [removedPlatforms, setRemovedPlatforms] = useState<Set<string>>(new Set());

  // Filter platforms by region
  const getVisiblePlatforms = (platforms: PlatformLink[]): PlatformLink[] => {
    return filterByRegion(platforms, locale.region)
      .filter(p => !removedPlatforms.has(p.id));
  };

  const handleRemovePlatform = (id: string) => {
    setRemovedPlatforms(prev => new Set([...prev, id]));
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
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 md:text-sm">XPENG MEDIA HUB</p>
            {/* ✅ Translated hero title */}
            <h1 className="mt-2 text-2xl font-semibold md:mt-3 md:text-4xl lg:text-5xl">
              {t('heroTitle')}
            </h1>
            {/* ✅ Translated hero subtitle */}
            <p className="mt-2 text-sm text-white/70 md:mt-4 md:text-base lg:text-lg">
              {t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Streaming Section */}
      {streamingCategory && getVisiblePlatforms(mainStreamingPlatforms).length > 0 && (
        <section>
          <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-3 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${streamingCategory.colorFrom} ${streamingCategory.colorTo} md:h-1 md:w-12`} />
                  {/* ✅ Translated category title */}
                  <h2 className={`bg-gradient-to-r ${streamingCategory.colorFrom} ${streamingCategory.colorTo} bg-clip-text text-sm font-bold text-transparent md:text-2xl lg:text-3xl`}>
                    {tCategory('streaming-vod').title}
                  </h2>
                </div>
                {/* ✅ Translated category subtitle */}
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
                onRemove={handleRemovePlatform}
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
                  onRemove={handleRemovePlatform}
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
                  onRemove={handleRemovePlatform}
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
                  onRemove={handleRemovePlatform}
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
                  onRemove={handleRemovePlatform}
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
