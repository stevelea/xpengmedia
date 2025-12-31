// Updated AllServicesPage.tsx with full i18n support
// Replace your existing src/pages/AllServicesPage.tsx with this file

import React, { useState, useMemo } from 'react';
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

type ViewMode = 'grid' | 'list' | 'detailed';

const AllServicesPage: React.FC = () => {
  const { t, tPlatform, locale } = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // Filter platforms by region and search
  const filteredPlatforms = useMemo(() => {
    let filtered = filterByRegion(allPlatforms, locale.region);

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
  }, [allPlatforms, locale.region, searchQuery, tPlatform]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:rounded-3xl md:p-8">
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white md:text-3xl"
          >
            {/* ✅ Translated title */}
            {t('allServices')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-slate-300"
          >
            {/* ✅ Translated description */}
            {t('allServicesDescription')}
          </motion.p>
          
          {/* Service count */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl font-bold text-cyan-400">{filteredPlatforms.length}</span>
            <span className="text-slate-400">{t('servicesAvailable')}</span>
          </div>
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
          {filteredPlatforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              {viewMode === 'grid' && (
                <PlatformCard platform={platform} />
              )}
              {viewMode === 'list' && (
                <ListItem platform={platform} tPlatform={tPlatform} />
              )}
              {viewMode === 'detailed' && (
                <DetailedCard platform={platform} tPlatform={tPlatform} />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// List view item
const ListItem: React.FC<{ platform: PlatformLink; tPlatform: (id: string) => string }> = ({ platform, tPlatform }) => {
  const description = tPlatform(platform.id) || platform.description;
  
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
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

// Detailed card view
const DetailedCard: React.FC<{ platform: PlatformLink; tPlatform: (id: string) => string }> = ({ platform, tPlatform }) => {
  const description = tPlatform(platform.id) || platform.description;
  
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
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
    </a>
  );
};

export default AllServicesPage;
