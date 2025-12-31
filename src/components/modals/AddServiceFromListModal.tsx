import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useFavorites } from '../../context/FavoritesContext';
import { useLocale } from '../../context/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlatformLink } from '../../data/platforms';
import { PlatformIcon } from '../icons/PlatformIcon';

interface AddServiceFromListModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableServices: PlatformLink[];
}

export const AddServiceFromListModal: React.FC<AddServiceFromListModalProps> = ({
  isOpen,
  onClose,
  availableServices,
}) => {
  const { addFavorite, categories } = useFavorites();
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredServices = availableServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddService = (service: PlatformLink) => {
    if (!selectedCategory) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }

    addFavorite({
      name: service.name,
      url: service.url,
      icon: service.icon,
      category: selectedCategory,
    });

    // Réinitialiser et fermer
    setSearchQuery('');
    setSelectedCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl dark:border-slate-700/70 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-gradient-to-r from-cyan-50 to-blue-50 p-6 dark:border-slate-700/70 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Ajouter un service
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Sélectionnez un service dans la liste ci-dessous
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200/50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
              aria-label="Fermer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Catégorie sélection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Catégorie de destination *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Barre de recherche */}
          <div className="relative mt-4">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Liste des services */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">📂</div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Sélectionnez d'abord une catégorie
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Choisissez la catégorie où vous voulez ajouter le service
              </p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Aucun service trouvé
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Essayez une autre recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <AnimatePresence>
                {filteredServices.map((service) => (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handleAddService(service)}
                    className="group relative flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm transition-all hover:scale-105 hover:border-cyan-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-500"
                  >
                    <PlatformIcon icon={service.icon} name={service.name} size="md" />
                    <span className="text-center text-sm font-semibold text-slate-800 line-clamp-2 dark:text-white">
                      {service.name}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200/70 bg-slate-50 p-4 dark:border-slate-700/70 dark:bg-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Annuler
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
