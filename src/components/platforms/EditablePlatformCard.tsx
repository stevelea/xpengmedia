import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import type { PlatformLink } from '../../data/platforms';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface EditablePlatformCardProps {
  platform: PlatformLink;
  isEditable?: boolean;
  isFavorite?: boolean;
  onRemove?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const EditablePlatformCard: React.FC<EditablePlatformCardProps> = ({
  platform,
  isEditable = false,
  isFavorite = false,
  onRemove,
  onToggleFavorite,
}) => {
  const { tPlatform, t } = useLocale();

  // Get translated description (for future tooltip/hover use)
  const _description = tPlatform(platform.id) || platform.description;
  void _description;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(platform.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(platform.id);
  };

  return (
    <a
      href={isEditable ? '#' : platform.url}
      target={isEditable ? undefined : '_blank'}
      rel={isEditable ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      className={`group relative flex flex-col items-center rounded-xl bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-all dark:bg-slate-800/80 md:p-3 ${
        isEditable
          ? 'cursor-default ring-2 ring-amber-500/50'
          : 'hover:shadow-md hover:scale-105'
      }`}
    >
      {/* Edit mode buttons */}
      {isEditable && (
        <>
          {/* Remove button */}
          {onRemove && (
            <button
              onClick={handleRemove}
              className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
              aria-label={t('remove')}
              title={t('hide')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Favorite/Pin button */}
          {onToggleFavorite && (
            <button
              onClick={handleToggleFavorite}
              className={`absolute -left-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
                isFavorite
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
              }`}
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              {isFavorite ? (
                <StarSolid className="h-4 w-4" />
              ) : (
                <StarOutline className="h-4 w-4" />
              )}
            </button>
          )}
        </>
      )}

      {/* Favorite indicator (when not in edit mode) */}
      {!isEditable && isFavorite && (
        <span className="absolute -left-1 -top-1 z-10">
          <StarSolid className="h-4 w-4 text-amber-500 drop-shadow" />
        </span>
      )}

      {/* Premium Badge */}
      {platform.isPremium && (
        <span className="absolute -right-1 -top-1 z-10 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
          {t('tagPremium')}
        </span>
      )}

      {/* Platform Icon */}
      <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm dark:bg-slate-700 md:h-12 md:w-12 md:mb-2">
        {platform.icon.startsWith('http') || platform.icon.startsWith('/') ? (
          <img
            src={platform.icon}
            alt={platform.name}
            className="h-full w-full object-contain"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-xl md:text-2xl">📱</span>';
            }}
          />
        ) : (
          <span className="text-xl md:text-2xl">{platform.icon}</span>
        )}
      </div>

      {/* Platform Name */}
      <h3 className="text-center text-[11px] font-medium text-slate-900 dark:text-white line-clamp-1 md:text-sm">
        {platform.name}
      </h3>

      {/* Tags (mobile hidden, desktop shown) */}
      {platform.tags && platform.tags.length > 0 && (
        <div className="mt-1 hidden flex-wrap justify-center gap-1 md:flex">
          {platform.tags.slice(0, 1).map((tag) => {
            const tagKey = `tag${tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`;
            const translatedTag = t(tagKey);
            const displayTag = translatedTag !== tagKey ? translatedTag : tag;

            return (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              >
                {displayTag}
              </span>
            );
          })}
        </div>
      )}

      {/* Edit mode overlay */}
      {isEditable && (
        <div className="absolute inset-0 rounded-xl bg-amber-500/10 pointer-events-none" />
      )}
    </a>
  );
};

export default EditablePlatformCard;
