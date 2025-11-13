import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoritesGrid } from '../components/favorites/FavoritesGrid';
import { AddFavoriteModal } from '../components/favorites/AddFavoriteModal';
import { SearchBar } from '../components/SearchBar';
import { useFavorites } from '../context/FavoritesContext';
import { PlusIcon, ArrowUpIcon, PlayIcon, MusicalNoteIcon, PuzzlePieceIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { videoCategories, musicCategories, gamesCategories, chargingCategories, otherServicesCategories } from '../data/platforms';
import type { PlatformLink } from '../data/platforms';
import { EditablePlatformCard } from '../components/platforms/EditablePlatformCard';
import { ScrollIndicator } from '../components/ui/ScrollIndicator';
import { useSmartFavorites } from '../hooks/useSmartFavorites';
import { useLocale } from '../context/LocaleContext';
import { AddServiceButton } from '../components/ui/AddServiceButton';
import { AddUrlButton } from '../components/ui/AddUrlButton';
import { AddCustomUrlModal } from '../components/modals/AddCustomUrlModal';
import { AddServiceFromListModal } from '../components/modals/AddServiceFromListModal';
import { StarIcon } from '@heroicons/react/24/solid';
import { PlatformIcon } from '../components/icons/PlatformIcon';
import { filterPlatformsByRegion } from '../utils/regionFilter';

export const HomePage: React.FC = () => {
  const { categories } = useFavorites();
  const { locale, t } = useLocale();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomUrlModalOpen, setIsCustomUrlModalOpen] = useState(false);
  const [isServiceListModalOpen, setIsServiceListModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenPlatforms, setHiddenPlatforms] = useState<Set<string>>(new Set());
  const [customServices, setCustomServices] = useState<PlatformLink[]>([]);

  // Sélection des plateformes populaires à afficher par défaut
  const allPlatformsRaw: PlatformLink[] = [
    ...videoCategories.flatMap(cat => cat.platforms),
    ...musicCategories.flatMap(cat => cat.platforms),
    ...gamesCategories.flatMap(cat => cat.platforms),
    ...chargingCategories.flatMap(cat => cat.platforms),
    ...otherServicesCategories.flatMap(cat => cat.platforms),
  ];

  // Filtrer par région avec le système intelligent
  const allPlatforms = filterPlatformsByRegion(allPlatformsRaw, locale.region);

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

  // Filtrer les plateformes visibles (cachées + région)
  const getVisiblePlatforms = (platforms: PlatformLink[]) => {
    const filtered = filterPlatformsByRegion(platforms, locale.region);
    return filtered.filter(p => !hiddenPlatforms.has(p.id));
  };

  // Toggle mode édition
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Ajouter un service personnalisé
  const handleAddCustomUrl = (name: string, url: string, icon: string) => {
    const newService: PlatformLink = {
      id: `custom-${Date.now()}`,
      name,
      description: 'Service personnalisé',
      url,
      icon,
      availability: ['global'],
      tags: ['Personnalisé'],
    };
    setCustomServices(prev => [...prev, newService]);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-3 landscape:space-y-2 landscape:px-2 landscape:py-2 sm:px-6 md:space-y-6 md:py-6 lg:space-y-8 lg:px-8 lg:py-8">
      {/* Barre de recherche en premier */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 md:mb-6"
      >
        <SearchBar />
      </motion.section>

      {/* Hero Section optimisé pour tablette paysage */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-4 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] backdrop-blur-xl md:rounded-3xl md:px-10 md:py-8"
      >
        {/* Halos lumineux en arrière-plan */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-white">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 md:h-1 md:w-12" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 md:text-xs md:tracking-[0.3em]">XPENG MEDIA HUB</p>
            </div>
            <h1 className="mt-2 text-xl font-bold leading-tight md:mt-3 md:text-4xl lg:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-2 text-xs text-white/70 md:mt-3 md:text-base lg:max-w-2xl">
              {t('heroSubtitle')}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 md:gap-2 md:mt-5">
              <Link
                to="/videos"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/50 md:gap-2 md:px-4 md:py-2 md:text-sm"
              >
                <PlayIcon className="h-3 w-3 md:h-4 md:w-4" />
                {t('videos')}
              </Link>
              <Link
                to="/music"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-cyan-500/10 md:gap-2 md:px-4 md:py-2 md:text-sm"
              >
                <MusicalNoteIcon className="h-3 w-3 md:h-4 md:w-4" />
                {t('music')}
              </Link>
              <Link
                to="/games"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-cyan-500/10 md:gap-2 md:px-4 md:py-2 md:text-sm"
              >
                <PuzzlePieceIcon className="h-3 w-3 md:h-4 md:w-4" />
                {t('games')}
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
        className="mt-4 md:mt-8"
      >
        <div className="mb-2 flex items-center justify-between md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 md:h-10 md:w-10 md:rounded-xl">
              <StarIcon className="h-4 w-4 text-white md:h-6 md:w-6" />
              {hasUsageData && (
                <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-bold text-white md:-right-1 md:-top-1 md:h-5 md:w-5 md:text-[10px]">
                  AI
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800 dark:text-white landscape:text-sm md:text-xl lg:text-2xl">
                {hasUsageData ? t('myFavorites') : t('smartRecommendations')}
              </h2>
              <p className="text-[9px] text-slate-600 dark:text-slate-400 landscape:text-[10px] md:text-xs lg:text-sm">
                {hasUsageData 
                  ? t('adaptedToYou')
                  : t('popularServices')}
              </p>
            </div>
          </div>
          {hasUsageData && (
            <div className="hidden items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 md:flex md:px-3 md:py-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500 md:h-2 md:w-2" />
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 md:text-xs">
                {t('learningActive')}
              </span>
            </div>
          )}
        </div>
        
        {/* Grille compacte optimisée mobile portrait */}
        <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
          {smartFavorites.map((platform) => (
            <motion.a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick(platform.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white/80 p-1.5 shadow-sm backdrop-blur-xl transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-amber-500 landscape:gap-1 landscape:p-2 md:gap-2 md:rounded-2xl md:p-4"
            >
              <PlatformIcon icon={platform.icon} name={platform.name} size="sm" />
              <h3 className="text-[8px] font-semibold text-center text-slate-800 dark:text-white line-clamp-2 landscape:text-[9px] md:text-xs">{platform.name}</h3>
              <div className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity md:right-1 md:top-1">
                <StarIcon className="h-2.5 w-2.5 text-amber-500 md:h-3 md:w-3" />
              </div>
            </motion.a>
          ))}
          
          {/* Services personnalisés */}
          {customServices.map((service) => (
            <EditablePlatformCard
              key={service.id}
              platform={service}
              isEditable={isEditMode}
              onRemove={handleRemovePlatform}
            />
          ))}
          
          {/* Bouton Ajouter un service */}
          <AddServiceButton 
            onClick={() => setIsServiceListModalOpen(true)}
            label="Service"
          />
          
          {/* Bouton Ajouter une URL */}
          <AddUrlButton 
            onClick={() => setIsCustomUrlModalOpen(true)}
            label="URL"
          />
        </div>
      </motion.section>

      {/* Toutes les catégories de plateformes avec style XPENG */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 space-y-4 md:mt-12 md:space-y-10"
      >
        {/* Vidéos - Toutes les sous-catégories */}
        {videoCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className={`h-0.5 w-4 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-xs font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {category.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 ml-5 text-[9px] text-slate-500 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 md:text-sm">
                  {getVisiblePlatforms(category.platforms).length}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  onRemove={handleRemovePlatform}
                />
              ))}
              {/* Cartes vides pour compléter la rangée de 5 */}
              {Array.from({ length: (5 - (getVisiblePlatforms(category.platforms).length % 5)) % 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="invisible" />
              ))}
            </div>
          </div>
        ))}

        {/* Musique - Toutes les sous-catégories */}
        {musicCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className={`h-0.5 w-4 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-xs font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {category.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 ml-5 text-[9px] text-slate-500 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 md:text-sm">
                  {getVisiblePlatforms(category.platforms).length}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  onRemove={handleRemovePlatform}
                />
              ))}
              {/* Cartes vides pour compléter la rangée de 5 */}
              {Array.from({ length: (5 - (getVisiblePlatforms(category.platforms).length % 5)) % 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="invisible" />
              ))}
            </div>
          </div>
        ))}

        {/* Jeux - Toutes les sous-catégories */}
        {gamesCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className={`h-0.5 w-4 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:h-1 md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-xs font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {category.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 ml-5 text-[9px] text-slate-500 dark:text-slate-400 md:ml-0 md:mt-1 md:text-sm line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 md:text-sm">
                  {getVisiblePlatforms(category.platforms).length}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  onRemove={handleRemovePlatform}
                />
              ))}
              {/* Cartes vides pour compléter la rangée de 5 */}
              {Array.from({ length: (5 - (getVisiblePlatforms(category.platforms).length % 5)) % 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="invisible" />
              ))}
            </div>
          </div>
        ))}

        {/* Recharge - Toutes les sous-catégories */}
        {chargingCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-lg font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {category.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                    {category.subtitle}
                  </p>
                  {category.highlight && (
                    <span className="mt-2 inline-block rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 md:px-3 md:py-1 md:text-xs">
                      ✨ {category.highlight}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                  {getVisiblePlatforms(category.platforms).length} services
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  onRemove={handleRemovePlatform}
                />
              ))}
              {/* Cartes vides pour compléter la rangée de 5 */}
              {Array.from({ length: (5 - (getVisiblePlatforms(category.platforms).length % 5)) % 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="invisible" />
              ))}
            </div>
          </div>
        ))}

        {/* Autres Services - Toutes les sous-catégories */}
        {otherServicesCategories.filter(category => getVisiblePlatforms(category.platforms).length > 0).map((category) => (
          <div key={category.id}>
            <div className="mb-1.5 overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80 p-2 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/70 dark:to-slate-950/50 md:mb-4 md:rounded-3xl md:p-6 md:shadow-lg">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${category.colorFrom} ${category.colorTo} md:w-12`} />
                    <h2 className={`bg-gradient-to-r ${category.colorFrom} ${category.colorTo} bg-clip-text text-lg font-bold text-transparent md:text-2xl lg:text-3xl`}>
                      {category.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 md:text-sm">
                    {category.subtitle}
                  </p>
                  {category.highlight && (
                    <span className="mt-2 inline-block rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 md:px-3 md:py-1 md:text-xs">
                      ✨ {category.highlight}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                  {getVisiblePlatforms(category.platforms).length} services
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 landscape:grid-cols-8 landscape:gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-8">
              {getVisiblePlatforms(category.platforms).map((platform) => (
                <EditablePlatformCard
                  key={platform.id}
                  platform={platform}
                  isEditable={isEditMode}
                  onRemove={handleRemovePlatform}
                />
              ))}
              {/* Cartes vides pour compléter la rangée de 5 */}
              {Array.from({ length: (5 - (getVisiblePlatforms(category.platforms).length % 5)) % 5 }).map((_, i) => (
                <div key={`empty-${i}`} className="invisible" />
              ))}
            </div>
          </div>
        ))}
      </motion.section>

      {/* Section "Toutes les plateformes" SUPPRIMÉE - Les catégories suffisent */}

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

      {/* Modal d'ajout d'URL personnalisée */}
      <AddCustomUrlModal
        isOpen={isCustomUrlModalOpen}
        onClose={() => setIsCustomUrlModalOpen(false)}
        onAdd={handleAddCustomUrl}
      />

      {/* Modal de sélection de service depuis la liste */}
      <AddServiceFromListModal
        isOpen={isServiceListModalOpen}
        onClose={() => setIsServiceListModalOpen(false)}
        availableServices={allPlatforms}
      />
    </div>
  );
};
