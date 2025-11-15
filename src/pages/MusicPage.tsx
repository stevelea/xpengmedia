import React from 'react';
import { motion } from 'framer-motion';
import { musicCategories } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';

const MusicPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-500 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG SOUND</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Musique haute-fidélité dans votre XPENG
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70">
              Découvrez des services compatibles avec l&apos;audio spatial, l&apos;ambisonie XPENG et la synchronisation multi-zones.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#music"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                Musique & Audio
              </a>
              <a
                href="#asia-music"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Expérience XPENG Chine
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="space-y-10">
        {musicCategories.map((category, index) => (
          <div key={category.id} id={category.id}>
            <PlatformCategorySection category={category} index={index} maxPlatforms={12} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
