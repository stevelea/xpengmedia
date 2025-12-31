import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const ScrollIndicator: React.FC = () => {
  const [showIndicator, setShowIndicator] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      if (scrolled && !hasScrolled) {
        setHasScrolled(true);
        setShowIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const scrollToServices = () => {
    window.scrollTo({
      top: window.innerHeight * 0.6,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToServices}
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-cyan-500/30 bg-slate-950/80 px-6 py-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl transition hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Découvrir
            </span>
            <div className="flex flex-col items-center">
              <ChevronDownIcon className="h-5 w-5 text-cyan-400" />
              <ChevronDownIcon className="h-5 w-5 -mt-3 text-cyan-400/50" />
            </div>
            <span className="text-[10px] font-medium text-white/60">
              Tous les services
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
