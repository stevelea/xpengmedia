import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  videoCategories,
  musicCategories,
  gamesCategories,
  chargingCategories,
  otherServicesCategories,
  type PlatformLink,
} from '../data/platforms';
import { useLocale } from '../context/LocaleContext';
import { filterPlatformsByRegion } from '../utils/regionFilter';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { PlatformIcon } from '../components/icons/PlatformIcon';

const buildAllPlatforms = (): PlatformLink[] => {
  return [
    ...videoCategories.flatMap((cat) => cat.platforms),
    ...musicCategories.flatMap((cat) => cat.platforms),
    ...gamesCategories.flatMap((cat) => cat.platforms),
    ...chargingCategories.flatMap((cat) => cat.platforms),
    ...otherServicesCategories.flatMap((cat) => cat.platforms),
  ];
};

export const AllServicesPage: React.FC = () => {
  const { locale, t } = useLocale();
  const [layout, setLayout] = useState<'grid' | 'list' | 'detail'>('grid');
  const [hiddenPlatforms, setHiddenPlatforms] = useState<Set<string>>(new Set());

  const getViewLabel = (mode: 'grid' | 'list' | 'detail'): string => {
    switch (mode) {
      case 'grid':
        return t('viewGrid');
      case 'list':
        return t('viewList');
      case 'detail':
      default:
        return t('viewDetail');
    }
  };

  const allPlatformsRaw = useMemo(() => buildAllPlatforms(), []);

  useEffect(() => {
    const saved = localStorage.getItem('hiddenPlatforms');
    if (saved) {
      try {
        setHiddenPlatforms(new Set(JSON.parse(saved)));
      } catch {
        setHiddenPlatforms(new Set());
      }
    }
  }, []);

  const visiblePlatforms = useMemo(() => {
    const filteredByRegion = filterPlatformsByRegion(allPlatformsRaw, locale.region);
    const filtered = filteredByRegion.filter((p) => !hiddenPlatforms.has(p.id));
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [allPlatformsRaw, locale.region, hiddenPlatforms]);

  const renderListCard = (platform: PlatformLink, detailed: boolean) => {
    return (
      <a
        key={platform.id}
        href={platform.url}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm transition hover:border-cyan-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-500"
      >
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/5 dark:text-white">
          <PlatformIcon icon={platform.icon} name={platform.name} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {platform.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {platform.url.replace(/^https?:\/\//, '')}
          </p>
          {detailed && platform.description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {platform.description}
            </p>
          )}
          {detailed && platform.tags && platform.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {platform.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    );
  };

  const viewControls = (
    <div className="flex flex-wrap justify-end gap-2">
      {(['grid', 'list', 'detail'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setLayout(mode)}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all ${
            layout === mode
              ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow'
              : 'border-slate-300 bg-white/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {getViewLabel(mode)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-100/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-[1px] shadow-[0_40px_80px_-24px_rgba(15,23,42,0.75)] dark:border-slate-800/70"
      >
        <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/60 px-6 py-6 backdrop-blur-xl md:px-10 md:py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400 md:text-xs">
              XPENG MEDIA
            </p>
            <h1 className="mt-2 text-xl font-bold leading-tight md:mt-3 md:text-3xl lg:text-4xl">
              {t('allServices')}
            </h1>
            <p className="mt-2 text-xs text-white/70 md:mt-3 md:text-sm">
              {t('allServicesDescription')}
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex flex-col items-end gap-2 text-right">
            <p className="text-xs text-slate-300/80 md:text-sm">
              {visiblePlatforms.length} {t('servicesAvailable')}
            </p>
            {viewControls}
          </div>
        </div>
      </motion.header>

      <section>
        {visiblePlatforms.length === 0 ? (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('noServicesForRegion')}
          </p>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
            {visiblePlatforms.map((platform) => (
              <EditablePlatformCard key={platform.id} platform={platform} isEditable={false} />
            ))}
            {Array.from({
              length: (5 - (visiblePlatforms.length % 5)) % 5,
            }).map((_, index) => (
              <div key={`empty-all-services-${index}`} className="invisible" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visiblePlatforms.map((platform) =>
              layout === 'list' ? renderListCard(platform, false) : renderListCard(platform, true),
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllServicesPage;
