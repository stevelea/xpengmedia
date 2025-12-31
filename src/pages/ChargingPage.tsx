// Updated ChargingPage.tsx with full i18n support
// Replace your existing src/pages/ChargingPage.tsx with this file

import React from 'react';
import { motion } from 'framer-motion';
import { otherServices } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';
import { useLocale } from '../context/LocaleContext';

const ChargingPage: React.FC = () => {
  const { t, tCategory } = useLocale();

  // Find charging-related categories from otherServices
  const chargingCategories = otherServices?.filter(cat => 
    cat.id.includes('charging') || 
    cat.id.includes('ev') || 
    cat.id.includes('navigation')
  ) || [];

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-green-500 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG CHARGING</p>
            {/* ✅ Translated page title */}
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t('chargingPageTitle')}
            </h1>
            {/* ✅ Translated page subtitle */}
            <p className="mt-4 text-base md:text-lg text-white/70">
              {t('chargingPageSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#charging"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {/* ✅ Translated button */}
                {t('findStations')}
              </a>
              <a
                href="#navigation"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {/* ✅ Translated button */}
                {t('planRoute')}
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Categories */}
      <div className="space-y-10">
        {chargingCategories.map((category, index) => {
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

      {/* If no specific charging categories, show a helpful message */}
      {chargingCategories.length === 0 && (
        <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-800">
          <div className="text-6xl mb-4">🔋</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            {t('noServicesForRegion')}
          </h3>
        </div>
      )}
    </div>
  );
};

export default ChargingPage;
