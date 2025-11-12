import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoritesGrid } from '../components/favorites/FavoritesGrid';
import { AddFavoriteModal } from '../components/favorites/AddFavoriteModal';
import { SearchBar } from '../components/SearchBar';
import { useFavorites } from '../context/FavoritesContext';
import { PlusIcon, ArrowUpIcon, PlayIcon, MusicalNoteIcon, PuzzlePieceIcon, BoltIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { videoCategories, musicCategories, gamesCategories, chargingCategories, otherServicesCategories } from '../data/platforms';
import type { PlatformLink } from '../data/platforms';

export const HomePage: React.FC = () => {
  const { categories } = useFavorites();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Sélection des plateformes populaires à afficher par défaut
  const allPlatforms: PlatformLink[] = [
    ...videoCategories.flatMap(cat => cat.platforms),
    ...musicCategories.flatMap(cat => cat.platforms),
    ...gamesCategories.flatMap(cat => cat.platforms),
    ...chargingCategories.flatMap(cat => cat.platforms),
    ...otherServicesCategories.flatMap(cat => cat.platforms),
  ];

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


  return (
    <div className="container mx-auto px-2 py-6 pb-24 md:px-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 p-[1px] shadow-[0_60px_120px_-40px_rgba(15,23,42,0.6)]"
      >
        <div className="relative rounded-[calc(2rem-1px)] bg-slate-950/70 px-8 py-14 backdrop-blur-xl md:px-12">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 translate-x-8 overflow-hidden md:block">
            <div className="absolute -top-20 right-4 h-72 w-72 rounded-full bg-cyan-500/40 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-blue-400/30 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-3xl text-white">
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">XPENG MEDIA HUB</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Une cabine immersive, vos plateformes favorites
            </h1>
            <p className="mt-4 text-base text-white/70 md:text-lg">
              Sélectionnez et organisez les services vidéo, musique, jeux et recharge pensés pour Xmart OS. Interface optimisée pour les véhicules XPENG récents, avec profils multi-pays et mode sombre natif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/videos"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
              >
                <PlayIcon className="h-4 w-4" />
                Bibliothèque vidéo XPENG
              </Link>
              <Link
                to="/music"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                <MusicalNoteIcon className="h-4 w-4" />
                Sound design & playlists
              </Link>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-white/80 sm:grid-cols-2">
              {[
                { icon: <PlayIcon className="h-5 w-5" />, label: 'Vidéos immersives', description: 'Compatibles 4K, Dolby Vision et streaming adaptatif.' },
                { icon: <MusicalNoteIcon className="h-5 w-5" />, label: 'Audio spatial', description: 'Synchronisé avec XPENG Sound et l’éclairage d’ambiance.' },
                { icon: <PuzzlePieceIcon className="h-5 w-5" />, label: 'Jeux embarqués', description: 'Optimisés pour les pauses recharge et manettes Bluetooth.' },
                { icon: <BoltIcon className="h-5 w-5" />, label: 'Recharge intelligente', description: 'Planification des superchargers XPENG et réseaux partenaires.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-3xl bg-white/5 p-4 backdrop-blur-sm">
                  <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Barre de recherche */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-12"
      >
        <SearchBar />
      </motion.section>

      {/* Toutes les plateformes disponibles */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Toutes les plateformes disponibles
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Explorez nos {allPlatforms.length} services vidéo, audio, jeux et outils
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allPlatforms.map((platform) => (
            <motion.a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-cyan-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-500"
            >
              <div className="text-4xl drop-shadow-sm" aria-hidden>
                {platform.icon}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {platform.name}
                </h3>
                {platform.tags && platform.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {platform.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500" />
            </motion.a>
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
