import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoritesGrid } from '../components/favorites/FavoritesGrid';
import { AddFavoriteModal } from '../components/favorites/AddFavoriteModal';
import { SearchBar } from '../components/SearchBar';
import { useFavorites } from '../context/FavoritesContext';
import { PlusIcon, ArrowUpIcon, PlayIcon, MusicalNoteIcon, PuzzlePieceIcon, BoltIcon, SparklesIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { videoCategories, musicCategories, gamesCategories, chargingCategories, otherServicesCategories } from '../data/platforms';
import type { PlatformLink } from '../data/platforms';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { ScrollIndicator } from '../components/ui/ScrollIndicator';
import { useSmartFavorites } from '../hooks/useSmartFavorites';
import { StarIcon } from '@heroicons/react/24/solid';

export const HomePage: React.FC = () => {
  const { categories } = useFavorites();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenPlatforms, setHiddenPlatforms] = useState<Set<string>>(new Set());

  // Sélection des plateformes populaires à afficher par défaut
  const allPlatforms: PlatformLink[] = [
    ...videoCategories.flatMap(cat => cat.platforms),
    ...musicCategories.flatMap(cat => cat.platforms),
    ...gamesCategories.flatMap(cat => cat.platforms),
    ...chargingCategories.flatMap(cat => cat.platforms),
    ...otherServicesCategories.flatMap(cat => cat.platforms),
  ];

  // Hook de favoris intelligents
  const { smartFavorites, trackClick, hasUsageData } = useSmartFavorites(allPlatforms);

  // Gestion du défilement pour afficher le bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Charger les plateformes cachées depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hiddenPlatforms');
    if (saved) {
      setHiddenPlatforms(new Set(JSON.parse(saved)));
    }
  }, []);

  // Sauvegarder les plateformes cachées dans localStorage
  useEffect(() => {
    localStorage.setItem('hiddenPlatforms', JSON.stringify(Array.from(hiddenPlatforms)));
  }, [hiddenPlatforms]);

  // Gérer la suppression d'une plateforme
  const handleRemovePlatform = (platformId: string) => {
    setHiddenPlatforms(prev => new Set([...prev, platformId]));
  };

  // Filtrer les plateformes visibles
  const getVisiblePlatforms = (platforms: PlatformLink[]) => {
    return platforms.filter(p => !hiddenPlatforms.has(p.id));
  };

  // Toggle mode édition
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="container mx-auto px-2 py-4 pb-24 md:px-6">
      {/* Barre de recherche en premier */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <SearchBar />
      </motion.section>

      {/* Hero Section optimisé pour tablette paysage */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-6 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] backdrop-blur-xl md:px-10 md:py-8"
      >
        {/* Halos lumineux en arrière-plan */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-white">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">XPENG MEDIA HUB</p>
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Une cabine immersive, vos plateformes favorites
            </h1>
            <p className="mt-3 text-sm text-white/70 md:text-base lg:max-w-2xl">
              Interface optimisée pour Xmart OS avec services vidéo, musique, jeux et recharge.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/videos"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/50"
              >
                <PlayIcon className="h-4 w-4" />
                Vidéos
              </Link>
              <Link
                to="/music"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-cyan-500/10"
              >
                <MusicalNoteIcon className="h-4 w-4" />
                Musique
              </Link>
              <Link
                to="/games"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-cyan-500/10"
              >
                <PuzzlePieceIcon className="h-4 w-4" />
                Jeux
              </Link>
            </div>
          </div>
      </motion.section>

      {/* Bouton d'édition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-8 flex justify-end"
      >
        <button
          onClick={toggleEditMode}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium shadow-lg transition-all ${
            isEditMode
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
          }`}
        >
          {isEditMode ? (
            <>
              <CheckIcon className="h-5 w-5" />
              <span>Terminer</span>
            </>
          ) : (
            <>
              <PencilIcon className="h-5 w-5" />
              <span>Personnaliser</span>
            </>
          )}
        </button>
      </motion.div>

      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-700 dark:text-yellow-300"
        >
          <span className="font-semibold">Mode édition activé</span> - Appuyez longuement sur une icône pour la masquer
        </motion.div>
      )}

      {/* Indicateur de scroll XPENG */}
      <ScrollIndicator />

      {/* Mes Favoris - Adaptation intelligente */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
              <StarIcon className="h-6 w-6 text-white" />
              {hasUsageData && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
                  AI
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                {hasUsageData ? 'Mes Favoris' : 'Services Recommandés'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                {hasUsageData 
                  ? 'Adaptés automatiquement à vos habitudes' 
                  : 'Les plus populaires pour commencer'}
              </p>
            </div>
          </div>
          {hasUsageData && (
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                Apprentissage actif
              </span>
            </div>
          )}
        </div>
        
        {/* Grille compacte pour tablette - 8 favoris intelligents */}
        <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
          {smartFavorites.map((platform) => (
            <motion.a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick(platform.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-amber-500"
            >
              <div className="text-3xl" aria-hidden>{platform.icon}</div>
              <h3 className="text-xs font-semibold text-center text-slate-900 dark:text-white line-clamp-2">{platform.name}</h3>
              <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <StarIcon className="h-3 w-3 text-amber-500" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Plateformes par catégories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 space-y-10"
      >
        {/* Vidéos */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <PlayIcon className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
                Vidéos & Streaming
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                {videoCategories.flatMap(c => c.platforms).length} services
              </p>
            </div>
            <Link to="/videos" className="ml-auto text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 md:text-sm">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {getVisiblePlatforms(videoCategories.flatMap(c => c.platforms)).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                onRemove={handleRemovePlatform}
              />
            ))}
          </div>
        </div>

        {/* Musique */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <MusicalNoteIcon className="h-8 w-8 text-pink-500" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Musique & Audio
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {musicCategories.flatMap(c => c.platforms).length} services disponibles
              </p>
            </div>
            <Link to="/music" className="ml-auto text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {getVisiblePlatforms(musicCategories.flatMap(c => c.platforms)).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                onRemove={handleRemovePlatform}
              />
            ))}
          </div>
        </div>

        {/* Jeux */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <PuzzlePieceIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Jeux & Gaming
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {gamesCategories.flatMap(c => c.platforms).length} services disponibles
              </p>
            </div>
            <Link to="/games" className="ml-auto text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {getVisiblePlatforms(gamesCategories.flatMap(c => c.platforms)).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                onRemove={handleRemovePlatform}
              />
            ))}
          </div>
        </div>

        {/* Recharge */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <BoltIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Recharge & Superchargers
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {chargingCategories.flatMap(c => c.platforms).length} services disponibles
              </p>
            </div>
            <Link to="/charging" className="ml-auto text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {getVisiblePlatforms(chargingCategories.flatMap(c => c.platforms)).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                onRemove={handleRemovePlatform}
              />
            ))}
          </div>
        </div>

        {/* Autres Services */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <SparklesIcon className="h-8 w-8 text-indigo-500" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Services EV & Outils
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {otherServicesCategories.flatMap(c => c.platforms).length} services disponibles
              </p>
            </div>
            <Link to="/other-services" className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {getVisiblePlatforms(otherServicesCategories.flatMap(c => c.platforms)).map((platform) => (
              <EditablePlatformCard
                key={platform.id}
                platform={platform}
                isEditable={isEditMode}
                onRemove={handleRemovePlatform}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Toutes les plateformes en un bloc */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Toutes les plateformes ({getVisiblePlatforms(allPlatforms).length})
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Vue d'ensemble complète de tous les services disponibles pour votre XPENG
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {getVisiblePlatforms(allPlatforms).map((platform) => (
            <EditablePlatformCard
              key={platform.id}
              platform={platform}
              isEditable={isEditMode}
              onRemove={handleRemovePlatform}
            />
          ))}
        </div>
      </motion.section>

      {/* Bouton flottant d'ajout */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedCategory('');
          setIsAddModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-10 flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors md:hidden"
        aria-label="Ajouter un favori"
      >
        <PlusIcon className="h-6 w-6" />
      </motion.button>

      {/* Bouton de retour en haut */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-10 flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Retour en haut"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bouton d'ajout pour desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:block mb-8"
      >
        <button
          onClick={() => {
            setSelectedCategory('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un favori
        </button>
      </motion.div>

      {/* Afficher les favoris par catégorie */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-12"
      >
        <AnimatePresence>
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index % 3) }}
            >
              <FavoritesGrid
                category={category}
                onAddClick={() => {
                  setSelectedCategory(category);
                  setIsAddModalOpen(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal d'ajout de favori */}
      <AddFavoriteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultCategory={selectedCategory}
      />
    </div>
  );
};
