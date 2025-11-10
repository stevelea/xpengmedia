import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, Transition } from '@headlessui/react';
import { FiX, FiLink, FiTag, FiPlus, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useEnhancedFavorites } from '../../context/EnhancedFavoritesContext';

type FavoriteFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name: string;
    url: string;
    icon: string;
    category: string;
    tags?: string[];
  };
};

const DEFAULT_ICONS = [
  '🌐', '📺', '🎵', '🎮', '📚', '📱', '💻', '🎬',
  '🎧', '🎨', '📊', '📡', '🔍', '💡', '🎯', '✨'
];

const FavoriteForm: React.FC<FavoriteFormProps> = ({ isOpen, onClose, initialData }) => {
  const { addFavorite, updateFavorite, categories, tags: allTags } = useEnhancedFavorites();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🌐');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialiser le formulaire avec les données existantes si en mode édition
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setIcon(initialData.icon || '🌐');
      setCategory(initialData.category);
      setSelectedTags(initialData.tags || []);
    } else {
      // Réinitialiser le formulaire
      setName('');
      setUrl('');
      setIcon('🌐');
      setCategory('');
      setSelectedTags([]);
      setNewCategory('');
    }
    setError('');
  }, [initialData, isOpen]);

  // Mettre à jour les suggestions de tags
  useEffect(() => {
    if (tagInput.trim() === '') {
      setSuggestedTags([]);
      return;
    }

    const filtered = allTags
      .filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && 
        !selectedTags.includes(tag)
      )
      .slice(0, 5);
    
    setSuggestedTags(filtered);
  }, [tagInput, allTags, selectedTags]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag.trim()]);
    }
    setTagInput('');
    setSuggestedTags([]);
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }
    
    if (!url.trim()) {
      setError('L\'URL est requise');
      return;
    }
    
    // Vérifier que l'URL commence par http:// ou https://
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    const finalCategory = newCategory.trim() || category;
    if (!finalCategory) {
      setError('Veuillez sélectionner ou créer une catégorie');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const favoriteData = {
        name: name.trim(),
        url: formattedUrl,
        icon,
        category: finalCategory,
        tags: selectedTags,
      };
      
      if (initialData?.id) {
        // Mise à jour d'un favori existant
        await updateFavorite(initialData.id, favoriteData);
      } else {
        // Ajout d'un nouveau favori
        await addFavorite(favoriteData);
      }
      
      // Réinitialiser le formulaire
      if (!initialData?.id) {
        setName('');
        setUrl('');
        setSelectedTags([]);
        setNewCategory('');
      }
      
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du favori:', err);
      setError('Une erreur est survenue lors de l\'enregistrement du favori');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          {/* Centrer le contenu */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {initialData?.id ? 'Modifier le favori' : 'Ajouter un favori'}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                  onClick={onClose}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Nom du site"
                      required
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://exemple.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Icône */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Icône
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_ICONS.map((defaultIcon) => (
                        <button
                          key={defaultIcon}
                          type="button"
                          onClick={() => setIcon(defaultIcon)}
                          className={`w-10 h-10 flex items-center justify-center text-2xl rounded-md border-2 transition-colors ${
                            icon === defaultIcon
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {defaultIcon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Catégorie *
                    </label>
                    <div className="flex space-x-2">
                      {categories.length > 0 && (
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Nouvelle catégorie"
                          />
                          {newCategory && (
                            <button
                              type="button"
                              onClick={() => {
                                setCategory(newCategory);
                                setNewCategory('');
                              }}
                              className="absolute inset-y-0 right-0 px-3 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FiPlus className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="relative">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiTag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && tagInput.trim()) {
                              e.preventDefault();
                              handleAddTag(tagInput);
                            }
                          }}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Ajouter des tags..."
                        />
                        {tagInput && (
                          <button
                            type="button"
                            onClick={() => setTagInput('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <FiXCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      {suggestedTags.length > 0 && (
                        <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                          {suggestedTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAddTag(tag)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : initialData?.id ? (
                      'Mettre à jour'
                    ) : (
                      'Ajouter le favori'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FavoriteForm;
