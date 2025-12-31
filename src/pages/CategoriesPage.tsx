// Updated CategoriesPage.tsx with full i18n support
// Replace your existing src/pages/CategoriesPage.tsx with this file

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';

// Category configuration - only IDs and styling, text comes from translations
const categoryConfig = [
  { 
    id: 'videos', 
    path: '/videos', 
    icon: '🎬', 
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-500/10 to-blue-600/10',
  },
  { 
    id: 'music', 
    path: '/music', 
    icon: '🎵', 
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/10 to-pink-600/10',
  },
  { 
    id: 'games', 
    path: '/games', 
    icon: '🎮', 
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/10 to-red-600/10',
  },
  { 
    id: 'charging', 
    path: '/charging', 
    icon: '🔋', 
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/10 to-emerald-600/10',
  },
  { 
    id: 'navigation', 
    path: '/navigation', 
    icon: '🗺️', 
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/10 to-indigo-600/10',
  },
  { 
    id: 'news', 
    path: '/news', 
    icon: '📰', 
    gradient: 'from-slate-500 to-gray-600',
    bgGradient: 'from-slate-500/10 to-gray-600/10',
  },
];

export const CategoriesPage: React.FC = () => {
  const { t } = useLocale();

  // Build categories with translated names and descriptions
  const categories = categoryConfig.map(cat => {
    // Build translation key: 'videos' -> 'categoryVideos'
    const nameKey = `category${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}`;
    const descKey = `${nameKey}Desc`;
    
    return {
      ...cat,
      name: t(nameKey),
      description: t(descKey),
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
        >
          {/* ✅ Translated title */}
          {t('allCategories')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-slate-600 dark:text-slate-400"
        >
          {/* ✅ Translated subtitle */}
          {t('explore')}
        </motion.p>
      </header>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={category.path}
              className={`group flex flex-col items-center rounded-2xl bg-gradient-to-br ${category.bgGradient} bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-slate-800`}
            >
              {/* Icon with gradient background */}
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-3xl shadow-lg transition-transform group-hover:scale-110`}
              >
                {category.icon}
              </div>

              {/* ✅ Translated Category Name */}
              <h2 className="text-center text-lg font-semibold text-slate-900 dark:text-white">
                {category.name}
              </h2>

              {/* ✅ Translated Description */}
              <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                {category.description}
              </p>

              {/* View More indicator */}
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                <span>{t('explore')}</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
