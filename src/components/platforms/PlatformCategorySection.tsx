import React from 'react';
import { motion } from 'framer-motion';
import type { PlatformCategory, PlatformLink } from '../../data/platforms';
import { ArrowTopRightOnSquareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { PlatformIcon } from '../icons/PlatformIcon';
import { useLocale } from '../../context/LocaleContext';
import { filterPlatformsByRegion } from '../../utils/regionFilter';

interface PlatformCategorySectionProps {
  category: PlatformCategory;
  index?: number;
  maxPlatforms?: number;
}

const availabilityLabel: Record<string, string> = {
  global: 'Global',
  china: 'Chine',
  europe: 'Europe',
  'north-america': 'Amérique du Nord',
  asia: 'Asie',
  'middle-east': 'Moyen-Orient',
};

const PlatformCard: React.FC<{ platform: PlatformLink }> = ({ platform }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_30px_60px_-20px_rgba(26,106,224,0.35)] dark:bg-slate-900/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-3 drop-shadow-sm" aria-hidden>
            <PlatformIcon icon={platform.icon} name={platform.name} size="md" />
          </div>
          <h4 className="text-xl font-semibold text-white drop-shadow-sm truncate">
            {platform.name}
          </h4>
          <p className="mt-2 text-sm text-slate-100/80 leading-relaxed line-clamp-3">
            {platform.description}
          </p>
        </div>
        {platform.isPremium && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm">
            <SparklesIcon className="h-4 w-4" /> Premium
          </span>
        )}
      </div>

      {platform.tags && platform.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {platform.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/90">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-white/90">
          {platform.availability.map((scope) => (
            <span key={scope} className="rounded-full bg-slate-900/40 px-3 py-1">
              {availabilityLabel[scope] ?? scope}
            </span>
          ))}
        </div>
        <a
          href={platform.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-white"
        >
          Ouvrir
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};

export const PlatformCategorySection: React.FC<PlatformCategorySectionProps> = ({ category, index = 0, maxPlatforms }) => {
  const { locale } = useLocale();
  const visiblePlatforms = filterPlatformsByRegion(category.platforms, locale.region);

   const limitedPlatforms = maxPlatforms ? visiblePlatforms.slice(0, maxPlatforms) : visiblePlatforms;

  if (visiblePlatforms.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-4xl border border-slate-100/10 bg-gradient-to-br p-[1px] shadow-[0_40px_80px_-24px_rgba(15,23,42,0.35)]">
      <div className={`relative rounded-[calc(2rem-1px)] bg-gradient-to-br ${category.colorFrom} ${category.colorTo} p-8 md:p-10`}>
        <div className="max-w-4xl text-white">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.4 }}
            className="text-3xl font-semibold md:text-4xl"
          >
            {category.title}
          </motion.h3>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base md:text-lg text-white/80 md:max-w-xl">
              {category.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              <span>
                {visiblePlatforms.length}{' '}
                {visiblePlatforms.length > 1 ? 'services disponibles' : 'service disponible'}
              </span>
            </div>
          </div>
          {category.highlight && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4" />
              {category.highlight}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {limitedPlatforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformCategorySection;
