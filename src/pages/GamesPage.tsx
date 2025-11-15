import React from 'react';
import { motion } from 'framer-motion';
import { gamesCategories } from '../data/platforms';
import { PlatformCategorySection } from '../components/platforms/PlatformCategorySection';

const GamesPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-500 p-[1px] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.65)]">
        <div className="rounded-[calc(2rem-1px)] bg-slate-950/60 px-8 py-12 backdrop-blur-xl md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">XPENG PLAY</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Jeux embarqués et cloud gaming
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70">
              Profitez de jeux optimisés pour les écrans XPENG, avec manettes sans fil et divertissement pendant la recharge.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#gaming"
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                Jeux & Divertissement
              </a>
              <a
                href="#kids"
                className="inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Famille & enfants
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="space-y-10">
        {gamesCategories.map((category, index) => (
          <div key={category.id} id={category.id}>
            <PlatformCategorySection category={category} index={index} maxPlatforms={12} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
