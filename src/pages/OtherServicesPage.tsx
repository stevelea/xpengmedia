import React from 'react';
import { motion } from 'framer-motion';
import { otherServicesCategories } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';
import { useLocale } from '../context/LocaleContext';

const OtherServicesPage: React.FC = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-12">
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-indigo-900 to-purple-600 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG CONNECT</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {t('otherServicesTitle')}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70">
              {t('otherServicesSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#ev-entertainment"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                {t('otherServicesEntertainment')}
              </a>
              <a
                href="#ev-tools"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {t('otherServicesTools')}
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="space-y-10">
        {otherServicesCategories.map((category, index) => (
          <div key={category.id} id={category.id}>
            <PlatformCategorySection category={category} index={index} maxPlatforms={12} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherServicesPage;
