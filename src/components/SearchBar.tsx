import { useState, useEffect, useRef } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';

export const SearchBar: React.FC = () => {
  const { favorites } = useFavorites();
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Gérer la fermeture lors d'un clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrer les résultats de recherche
  const filteredResults = query
    ? favorites.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.url.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const clearSearch = () => {
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-4 landscape:mb-2" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 landscape:pl-2 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 landscape:h-3.5 landscape:w-3.5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-8 landscape:pl-7 pr-8 landscape:pr-7 py-2 landscape:py-1.5 text-sm landscape:text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t('searchBarPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto"
          >
            {filteredResults.map((result) => (
              <a
                key={result.id}
                href={result.url.startsWith('http') ? result.url : `https://${result.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl mr-3">{result.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {result.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {result.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 ml-2">
                  {result.category}
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
