import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';

interface AddCustomUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, url: string, icon: string) => void;
}

export const AddCustomUrlModal: React.FC<AddCustomUrlModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🌐');

  const emojiList = ['🌐', '⭐', '🎯', '🚀', '💡', '🎨', '🎮', '📱', '💻', '🔥', '✨', '🎵', '📺', '🎬', '📷', '🏠'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAdd(name, url, icon);
      setName('');
      setUrl('');
      setIcon('🌐');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ zIndex: 2147483646 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 2147483647 }}
            className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-purple-500 bg-white p-6 shadow-[0_0_80px_10px_rgba(168,85,247,0.6)] dark:bg-slate-900"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Ajouter une URL personnalisée
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Créez votre propre raccourci
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nom du service
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mon site préféré"
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 transition focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  URL complète
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemple.com"
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 transition focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Icône */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Choisir une icône
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-2xl transition ${
                        icon === emoji
                          ? 'bg-purple-500 ring-2 ring-purple-500 ring-offset-2'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
