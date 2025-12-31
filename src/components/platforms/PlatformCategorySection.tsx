// Updated PlatformCategorySection.tsx with full i18n support
// Replace your existing src/components/platforms/PlatformCategorySection.tsx with this file

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { filterByRegion } from '../../utils/regionFilter';
import { PlatformCard } from './PlatformCard';
import type { PlatformCategory } from '../../data/platforms';

interface PlatformCategorySectionProps {
  category: PlatformCategory;
  index: number;
  maxPlatforms?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export const PlatformCategorySection: React.FC<PlatformCategorySectionProps> = ({
  category,
  index,
  maxPlatforms = 8,
  showViewAll = true,
  viewAllLink,
}) => {
  const { t, locale } = useLocale();

  // Filter platforms by region
  const visiblePlatforms = filterByRegion(category.platforms, locale.region);

  // Don't render if no platforms visible
  if (visiblePlatforms.length === 0) {
    return null;
  }

  const displayedPlatforms = visiblePlatforms.slice(0, maxPlatforms);
  const hasMore = visiblePlatforms.length > maxPlatforms;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-4"
    >
      {/* Category Header */}
      <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-4 shadow-md backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:rounded-2xl md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Color bar and title */}
            <div className="flex items-center gap-3">
              <div 
                className={`h-1 w-8 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:w-12`} 
              />
              {/* Category Title - Already localized from parent */}
              <h2 
                className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-lg font-bold text-transparent md:text-2xl`}
              >
                {category.title}
              </h2>
              
              {/* Highlight badge */}
              {category.highlight && (
                <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300 md:inline-block">
                  {category.highlight}
                </span>
              )}
            </div>
            
            {/* Subtitle - Already localized from parent */}
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-1 md:line-clamp-none">
              {category.subtitle}
            </p>
          </div>

          {/* Platform count and view all */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                {visiblePlatforms.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                apps
              </div>
            </div>
            
            {showViewAll && hasMore && viewAllLink && (
              <Link
                to={viewAllLink}
                className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 md:flex"
              >
                {t('viewAll')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
        {displayedPlatforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            size="md"
            showDescription={false}
            showTags={false}
          />
        ))}
        
        {/* Show "View All" card if there are more */}
        {hasMore && (
          <Link
            to={viewAllLink || '#'}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-slate-500"
          >
            <span className="text-2xl mb-1">+{visiblePlatforms.length - maxPlatforms}</span>
            <span className="text-xs">{t('seeMore')}</span>
          </Link>
        )}
      </div>
    </motion.section>
  );
};

export default PlatformCategorySection;
