import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../context/LocaleContext';
import type { Region, Language } from '../../context/LocaleContext';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export const LocaleSelector: React.FC = () => {
  const { locale, setLocale, regions, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const defaultRegion: { code: Region; name: string; flag: string; language: Language } = {
    code: 'global',
    name: 'Global',
    flag: '🌍',
    language: 'en',
  };

  const currentRegion =
    regions.find((r) => r.code === locale.region) || regions[0] || defaultRegion;

  // Calculer la position du bouton
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (regionCode: Region, language: Language) => {
    setLocale({ region: regionCode, language });
    setIsOpen(false);
  };

  // Rendre le dropdown dans un portail
  const dropdownContent = isOpen && (
          <>
            {/* Overlay pour bloquer les interactions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm"
            />
            
            {/* Menu déroulant */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ 
                position: 'fixed',
                top: `${buttonPosition.top}px`,
                right: `${buttonPosition.right}px`,
                maxHeight: '80vh',
              }}
              className="z-[99999] w-72 rounded-2xl border-4 border-cyan-500 bg-white shadow-[0_0_80px_10px_rgba(6,182,212,0.6)] dark:bg-slate-900"
            >
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('selectRegion')}
              </div>
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {regions.map((region) => {
                  const isSelected = region.code === locale.region;
                  return (
                    <motion.button
                      key={region.code}
                      onClick={() => handleSelect(region.code, region.language)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 shadow-sm dark:text-cyan-400'
                          : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">{region.flag}</span>
                        <div>
                          <div className="font-medium">{region.name}</div>
                          {region.code === 'global' && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {t('allServices')}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
          </>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-cyan-400 hover:bg-white hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:bg-slate-800"
      >
        <span className="text-xl" aria-hidden="true">{currentRegion.flag}</span>
        <span className="hidden sm:inline">{currentRegion.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {dropdownContent && createPortal(
        <AnimatePresence>
          {dropdownContent}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
