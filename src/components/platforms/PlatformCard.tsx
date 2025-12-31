// Updated PlatformCard.tsx with full i18n support
// Replace your existing src/components/platforms/PlatformCard.tsx with this file

import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import type { PlatformLink } from '../../data/platforms';

interface PlatformCardProps {
  platform: PlatformLink;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  showTags?: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ 
  platform, 
  size = 'md',
  showDescription = true,
  showTags = true,
}) => {
  const { tPlatform, t } = useLocale();

  // ✅ Get translated description, fallback to original if not found
  const description = tPlatform(platform.id) || platform.description;

  // Size configurations
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'h-8 w-8',
      iconWrapper: 'h-10 w-10',
      name: 'text-xs',
      description: 'text-[10px]',
      tag: 'text-[8px] px-1.5 py-0.5',
    },
    md: {
      container: 'p-3',
      icon: 'h-10 w-10',
      iconWrapper: 'h-12 w-12',
      name: 'text-sm',
      description: 'text-xs',
      tag: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      container: 'p-4',
      icon: 'h-12 w-12',
      iconWrapper: 'h-14 w-14',
      name: 'text-base',
      description: 'text-sm',
      tag: 'text-xs px-2 py-1',
    },
  };

  const classes = sizeClasses[size];

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col items-center rounded-xl bg-white/80 ${classes.container} shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:scale-105 dark:bg-slate-800/80`}
    >
      {/* Premium Badge */}
      {platform.isPremium && (
        <span className="absolute -right-1 -top-1 z-10 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
          {t('tagPremium')}
        </span>
      )}

      {/* Platform Icon */}
      <div className={`mb-2 flex ${classes.iconWrapper} items-center justify-center rounded-lg bg-white p-1.5 shadow-sm dark:bg-slate-700`}>
        {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
          <img
            src={platform.icon}
            alt={platform.name}
            className={`${classes.icon} object-contain`}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
            onError={(e) => {
              // Fallback to emoji if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">📱</span>';
            }}
          />
        ) : (
          <span className="text-2xl">{platform.icon}</span>
        )}
      </div>

      {/* Platform Name - Keep original (brand names don't translate) */}
      <h3 className={`text-center ${classes.name} font-medium text-slate-900 dark:text-white line-clamp-1`}>
        {platform.name}
      </h3>

      {/* ✅ Translated Description */}
      {showDescription && (
        <p className={`mt-1 ${classes.description} line-clamp-2 text-center text-slate-500 dark:text-slate-400`}>
          {description}
        </p>
      )}

      {/* Tags - Translate common tags */}
      {showTags && platform.tags && platform.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {platform.tags.slice(0, 2).map((tag) => {
            // Try to translate tag, fallback to original
            const tagKey = `tag${tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`;
            const translatedTag = t(tagKey);
            const displayTag = translatedTag !== tagKey ? translatedTag : tag;
            
            return (
              <span
                key={tag}
                className={`${classes.tag} rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300`}
              >
                {displayTag}
              </span>
            );
          })}
        </div>
      )}
    </a>
  );
};

export default PlatformCard;
