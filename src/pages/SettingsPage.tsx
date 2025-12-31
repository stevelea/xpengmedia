import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();

  const handleResetLocalData = () => {
    if (typeof window === 'undefined') return;

    const confirmed = window.confirm(t('resetDataConfirm'));

    if (!confirmed) return;

    try {
      window.localStorage.clear();
    } catch (e) {
      console.error('Error resetting localStorage', e);
    }

    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('settings')}</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('settingsAppearance')}</h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium dark:text-gray-200">{t('settingsTheme')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {theme === 'dark' ? t('settingsDarkMode') : t('settingsLightMode')}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('settingsSwitchTo')} {theme === 'dark' ? t('settingsLight') : t('settingsDark')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('settingsAccount')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('settingsAccountDescription')}
        </p>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          {t('settingsSignIn')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('settingsLocalData')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {t('settingsLocalDataDescription')}
        </p>
        <button
          onClick={handleResetLocalData}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          {t('settingsResetData')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('settingsAbout')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">{t('settingsVersion')}:</span> 1.0.0
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">{t('settingsDeveloper')}:</span> Dlnraja
        </p>
      </div>
    </div>
  );
};
