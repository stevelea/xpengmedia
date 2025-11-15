import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiTrendingUp, FiFilter, FiX, FiSearch, FiGrid, FiList, FiPlus } from 'react-icons/fi';
import { useEnhancedFavorites } from '../../context/EnhancedFavoritesContext';
import FavoriteForm from './FavoriteForm';
import { Dialog, DialogBackdrop } from '@headlessui/react';
import type { FavoriteItem } from '../../types/favorites';
import { useLocale } from '../../context/LocaleContext';

type ViewMode = 'grid' | 'list';
type SortOption = 'alphabetical' | 'recent' | 'popular' | 'category';

const EnhancedFavoritesGrid: React.FC = () => {
  const { 
    favorites, 
    categories, 
     
    getPinnedFavorites, 
    getRecentFavorites,
    removeFavorite,
    togglePin
  } = useEnhancedFavorites();

  const { t } = useLocale();

  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<FavoriteItem | undefined>(undefined);

  // Extraire tous les tags uniques
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    favorites.forEach(fav => {
      fav.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [favorites]);

  // Filtrer les favoris en fonction des critères de recherche
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(fav => 
        fav.name.toLowerCase().includes(query) || 
        fav.url.toLowerCase().includes(query) ||
        fav.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtrer par catégorie
    if (selectedCategory) {
      result = result.filter(fav => fav.category === selectedCategory);
    }

    // Filtrer par tags
    if (selectedTags.length > 0) {
      result = result.filter(fav => 
        selectedTags.every(tag => fav.tags?.includes(tag))
      );
    }

    // Trier
    switch (sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        result.sort((a, b) => 
          (b.lastVisited?.getTime() || 0) - (a.lastVisited?.getTime() || 0)
        );
        break;
      case 'popular':
        result.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [favorites, searchQuery, selectedCategory, selectedTags, sortBy]);

  // Gérer l'ajout/suppression de tags de filtrage
  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Gérer l'édition d'un favori
  const handleEdit = (favorite: FavoriteItem) => {
    setEditingFavorite(favorite);
    setIsFormOpen(true);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  // Obtenir les favoris épinglés
  const pinnedFavorites = getPinnedFavorites();
  const hasPinnedFavorites = pinnedFavorites.length > 0;

  // Obtenir les favoris récents
  const recentFavorites = getRecentFavorites(5);
  const hasRecentFavorites = recentFavorites.length > 0;

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== '' || selectedTags.length > 0;

  return (
    <div className="space-y-8">
      {/* En-tête avec barre de recherche et actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('myFavorites')}</h1>
        
        <div className="flex items-center space-x-2">
          {/* Bouton d'ajout */}
          <button
            onClick={() => {
              setEditingFavorite(undefined);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            + {t('addFavorite')}
          </button>
          
          {/* Bouton de changement de vue */}
          <div className="hidden md:flex items-center bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-md ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              title={t('viewGrid')}
            >
              <FiGrid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-md ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              title={t('viewList')}
            >
              <FiList className={`w-5 h-5 ${viewMode === 'list' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
          </div>
          
          {/* Bouton de filtre */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`p-2 rounded-md border ${hasActiveFilters ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' : 'border-gray-300 dark:border-gray-600'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            title={t('favoritesFilterTitle')}
          >
            <FiFilter className={`w-5 h-5 ${hasActiveFilters ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder={t('favoritesSearchPlaceholder')}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filtres actifs */}
      {(selectedCategory || selectedTags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('favoritesFiltersLabel')}</span>
          
          {selectedCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory('')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {tag}
              <button
                onClick={() => toggleTagFilter(tag)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-500 hover:bg-green-200 dark:hover:bg-green-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t('favoritesClearFilters')}
          </button>
        </div>
      )}

      {/* Favoris épinglés */}
      {hasPinnedFavorites && (
        <div className="space-y-4">
          <div className="flex items-center">
            <FiStar className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('favoritesPinnedTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedFavorites.map((fav) => (
              <FavoriteCard 
                key={fav.id} 
                favorite={fav} 
                onEdit={handleEdit}
                onRemove={removeFavorite}
                onTogglePin={togglePin}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Favoris récents */}
      {hasRecentFavorites && !hasActiveFilters && (
        <div className="space-y-4">
          <div className="flex items-center">
            <FiClock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('favoritesRecentTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentFavorites.map((fav) => (
              <FavoriteCard 
                key={fav.id} 
                favorite={fav} 
                onEdit={handleEdit}
                onRemove={removeFavorite}
                onTogglePin={togglePin}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tous les favoris */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCategory ? selectedCategory : t('favoritesAllTitle')}
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredFavorites.length} {t('favoritesLabel')}
            </span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="alphabetical">{t('favoritesSortAlphabetical')}</option>
              <option value="recent">{t('favoritesSortRecent')}</option>
              <option value="popular">{t('favoritesSortPopular')}</option>
              <option value="category">{t('favoritesSortCategory')}</option>
            </select>
          </div>
        </div>

        {filteredFavorites.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFavorites.map((fav) => (
                <FavoriteCard 
                  key={fav.id} 
                  favorite={fav} 
                  onEdit={handleEdit}
                  onRemove={removeFavorite}
                  onTogglePin={togglePin}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFavorites.map((fav) => (
                <FavoriteCard 
                  key={fav.id} 
                  favorite={fav} 
                  onEdit={handleEdit}
                  onRemove={removeFavorite}
                  onTogglePin={togglePin}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('favoritesEmptyTitle')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('favoritesEmptyDescription')}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedTags([]);
                  setEditingFavorite(undefined);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                {t('addFavorite')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panneau de filtres (mobile) */}
      <Dialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('favoritesFilterTitle')}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Filtre par catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('favoritesFilterCategory')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('')}
                      className={`px-3 py-2 text-sm rounded-md ${
                        selectedCategory === ''
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t('favoritesFilterAllCategories')}
                    </button>
                    {categories.slice(0, 5).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2 text-sm rounded-md truncate ${
                          selectedCategory === cat
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Filtre par tags */}
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('favoritesFilterTags')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTagFilter(tag)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedTags.includes(tag)
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Options de tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('favoritesSortBy')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'alphabetical', label: t('favoritesSortAlphabetical') },
                      { value: 'recent', label: t('favoritesSortRecent'), icon: <FiClock className="mr-1" /> },
                      { value: 'popular', label: t('favoritesSortPopular'), icon: <FiTrendingUp className="mr-1" /> },
                      { value: 'category', label: t('favoritesSortCategory') },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={`flex items-center justify-center px-3 py-2 text-sm rounded-md ${
                          sortBy === option.value
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {t('favoritesFilterApply')}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setSortBy('alphabetical');
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {t('favoritesFilterReset')}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Formulaire d'ajout/édition de favori */}
      <FavoriteForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingFavorite(undefined);
        }}
        initialData={editingFavorite}
      />
    </div>
  );
};

// Composant de carte de favori
const FavoriteCard: React.FC<{
  favorite: FavoriteItem;
  viewMode: 'grid' | 'list';
  onEdit: (favorite: FavoriteItem) => void;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
}> = ({ favorite, viewMode, onEdit, onRemove, onTogglePin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLocale();
  
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        className="relative group bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a 
          href={favorite.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl">
              {favorite.icon || '🌐'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {favorite.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {new URL(favorite.url).hostname.replace('www.', '')}
              </p>
            </div>
          </div>
        </a>
        
        {/* Actions au survol */}
        <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePin(favorite.id);
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-md text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
            title={favorite.isPinned ? t('favoritesUnpin') : t('favoritesPin')}
          >
            <FiStar className={`h-4 w-4 ${favorite.isPinned ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(favorite);
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            title={t('edit')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm(t('confirmDeleteFavorite'))) {
                onRemove(favorite.id);
              }
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
            title={t('delete')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {/* Tags */}
        {favorite.tags && favorite.tags.length > 0 && (
          <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1">
            {favorite.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tag}
              </span>
            ))}
            {favorite.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                +{favorite.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </motion.div>
    );
  }
  
  // Vue en liste
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <a 
        href={favorite.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 flex items-center min-w-0"
      >
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl mr-3">
          {favorite.icon || '🌐'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {favorite.name}
            </p>
            {favorite.isPinned && (
              <FiStar className="ml-2 flex-shrink-0 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {new URL(favorite.url).hostname.replace('www.', '')}
            </p>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {favorite.category}
            </span>
          </div>
          {favorite.tags && favorite.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {favorite.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {tag}
                </span>
              ))}
              {favorite.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  +{favorite.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </a>
      
      <div className="ml-2 flex items-center space-x-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin(favorite.id);
          }}
          className="p-1.5 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
          title={favorite.isPinned ? t('favoritesUnpin') : t('favoritesPin')}
        >
          <FiStar className={`h-4 w-4 ${favorite.isPinned ? 'fill-current text-yellow-500' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(favorite);
          }}
          className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          title={t('edit')}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(t('confirmDeleteFavorite'))) {
              onRemove(favorite.id);
            }
          }}
          className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
          title={t('delete')}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default EnhancedFavoritesGrid;
