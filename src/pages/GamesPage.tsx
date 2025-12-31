// Updated GamesPage.tsx with full i18n support
// Replace your existing src/pages/GamesPage.tsx with this file

import React from 'react';
import { motion } from 'framer-motion';
import { gamesCategories } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';
import { useLocale } from '../context/LocaleContext';

const GamesPage: React.FC = () => {
  const { t, tCategory } = useLocale();

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-500 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG GAMING</p>
            {/* ✅ Translated page title */}
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t('gamesPageTitle')}
            </h1>
            {/* ✅ Translated page subtitle */}
            <p className="mt-4 text-base md:text-lg text-white/70">
              {t('gamesPageSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#gaming"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {/* ✅ Translated button */}
                {t('cloudGaming')}
              </a>
              <a
                href="#kids"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {/* ✅ Translated button */}
                {t('instantGames')}
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Categories */}
      <div className="space-y-10">
        {gamesCategories.map((category, index) => {
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
                index={index} 
                maxPlatforms={12} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamesPage;
