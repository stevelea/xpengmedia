// Updated VideosPage.tsx with full i18n support
// Replace your existing src/pages/VideosPage.tsx with this file

import React from 'react';
import { motion } from 'framer-motion';
import { videoCategories, type PlatformCategory, type PlatformLink } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';
import { useLocale } from '../context/LocaleContext';

export const VideosPage: React.FC = () => {
  const { t, tCategory } = useLocale();

  const dedupePlatforms = (platforms: PlatformLink[]): PlatformLink[] => {
    const seen = new Set<string>();
    return platforms.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  };

  const streamingCategory = videoCategories.find((cat) => cat.id === 'streaming-vod');
  const freeTvCategory = videoCategories.find((cat) => cat.id === 'free-tv');
  const europeCategory = videoCategories.find((cat) => cat.id === 'europe');

  // Get localized category info
  const mainCategoryTranslation = tCategory('streaming-vod');

  const mainTvVodCategory: PlatformCategory | null = streamingCategory
    ? {
        ...streamingCategory,
        id: 'main-tv-vod',
        title: mainCategoryTranslation.title,
        subtitle: mainCategoryTranslation.subtitle,
        platforms: dedupePlatforms([
          ...(streamingCategory?.platforms ?? []),
          ...(freeTvCategory?.platforms ?? []),
          ...(europeCategory?.platforms ?? []),
        ]),
      }
    : null;

  const otherCategories = videoCategories.filter(
    (cat) => !['streaming-vod', 'free-tv', 'europe'].includes(cat.id),
  );

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-600 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG MEDIA</p>
            {/* ✅ Translated page title */}
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t('videosPageTitle')}
            </h1>
            {/* ✅ Translated page subtitle */}
            <p className="mt-4 text-base md:text-lg text-white/70">
              {t('videosPageSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#streaming-vod"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {/* ✅ Translated button */}
                {t('discoverStreaming')}
              </a>
              <a
                href="#asia-streaming"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {/* ✅ Translated button */}
                {t('streamingAsiaChina')}
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Categories */}
      <div className="space-y-10">
        {mainTvVodCategory && (
          <div id="streaming-vod">
            <PlatformCategorySection
              category={mainTvVodCategory}
              index={0}
              maxPlatforms={16}
            />
          </div>
        )}

        {otherCategories.map((category, index) => {
          // Get translated category info
          const categoryTrans = tCategory(category.id);
          const localizedCategory = {
            ...category,
            title: categoryTrans.title || category.title,
            subtitle: categoryTrans.subtitle || category.subtitle,
          };
          
          return (
            <div key={category.id} id={category.id}>
              <PlatformCategorySection
                category={localizedCategory}
                index={index + 1}
                maxPlatforms={12}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosPage;
