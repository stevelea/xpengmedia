import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { PlatformLink } from '../../data/platforms';

interface EditablePlatformCardProps {
  platform: PlatformLink;
  onRemove?: (platformId: string) => void;
  isEditable?: boolean;
}

export const EditablePlatformCard: React.FC<EditablePlatformCardProps> = ({
  platform,
  onRemove,
  isEditable = false,
}) => {
  const [showRemove, setShowRemove] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEditable) {
      setShowRemove(false);
    }
  }, [isEditable]);

  const handleTouchStart = () => {
    if (!isEditable) return;
    longPressTimer.current = setTimeout(() => {
      setShowRemove(true);
      // Vibration sur mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms pour l'appui long
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleMouseDown = () => {
    if (!isEditable) return;
    longPressTimer.current = setTimeout(() => {
      setShowRemove(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    
    setTimeout(() => {
      onRemove?.(platform.id);
    }, 300); // Durée de l'animation
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (showRemove) {
      e.preventDefault();
      return;
    }
  };

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          ref={cardRef}
          initial={{ scale: 1, opacity: 1 }}
          exit={{
            scale: 0,
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
          animate={showRemove ? { scale: 0.95 } : { scale: 1 }}
          className="relative"
        >
          <motion.a
            href={platform.url}
            target="_blank"
            rel="noreferrer"
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            whileHover={!showRemove ? { scale: 1.05 } : {}}
            whileTap={!showRemove ? { scale: 0.95 } : {}}
            className={`group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-slate-900/70 ${
              showRemove
                ? 'border-red-300 dark:border-red-500'
                : 'hover:border-cyan-300 hover:shadow-md dark:hover:border-cyan-500'
            }`}
          >
            <div className="text-3xl" aria-hidden>
              {platform.icon}
            </div>
            <h3 className="text-xs font-semibold text-center text-slate-900 dark:text-white">
              {platform.name}
            </h3>
            {!showRemove && (
              <ArrowTopRightOnSquareIcon className="h-3 w-3 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </motion.a>

          {/* Bouton de suppression avec animation */}
          <AnimatePresence>
            {showRemove && isEditable && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={handleRemove}
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 active:scale-90"
                aria-label={`Supprimer ${platform.name}`}
              >
                <XMarkIcon className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Animation de "shake" lors de l'appui long */}
          {showRemove && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{
                rotate: [-1, 1, -1, 1, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
