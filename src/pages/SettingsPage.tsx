import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleResetLocalData = () => {
    if (typeof window === 'undefined') return;

    const confirmed = window.confirm(
      'Voulez-vous vraiment réinitialiser toutes les données locales ?\n\nCela effacera vos favoris, services masqués, configuration IPTV et préférences de région/thème stockées dans ce navigateur.'
    );

    if (!confirmed) return;

    try {
      window.localStorage.clear();
    } catch (e) {
      console.error('Erreur lors de la réinitialisation du localStorage', e);
    }

    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Paramètres</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Apparence</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium dark:text-gray-200">Thème</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Basculer sur {theme === 'dark' ? 'clair' : 'sombre'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Compte</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Connectez-vous pour synchroniser vos préférences sur tous vos appareils.
        </p>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          Se connecter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Données locales</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Réinitialise toutes les données enregistrées dans ce navigateur pour XPENG Media&nbsp;: favoris, services masqués, configuration IPTV, historique, langue et région.
        </p>
        <button
          onClick={handleResetLocalData}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          Réinitialiser les données locales
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">À propos</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">Version:</span> 1.0.0
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Développé par:</span> Dlnraja
        </p>
      </div>
    </div>
  );
};
