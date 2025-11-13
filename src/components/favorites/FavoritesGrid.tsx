import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type FavoritesGridProps = {
  category: string;
  onAddClick?: () => void;
};

export const FavoritesGrid: React.FC<FavoritesGridProps> = ({ category, onAddClick }) => {
  const { getFavoritesByCategory, removeFavorite } = useFavorites();
  const categoryFavorites = getFavoritesByCategory(category);

  if (categoryFavorites.length === 0 && !onAddClick) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="text-xl font-semibold dark:text-white">{category}</h3>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Ajouter un favori dans ${category}`}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 md:gap-4 lg:grid-cols-6">
        {categoryFavorites.map((fav) => (
          <motion.div
            key={fav.id}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={fav.url.startsWith('http') ? fav.url : `https://${fav.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center h-full flex flex-col items-center justify-center"
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{fav.icon}</div>
              <span className="text-[11px] md:text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
                {fav.name}
              </span>
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFavorite(fav.id);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Supprimer ${fav.name}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
        
        {onAddClick && categoryFavorites.length < 6 && (
          <motion.div
            onClick={onAddClick}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors h-full min-h-[120px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Ajouter</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
