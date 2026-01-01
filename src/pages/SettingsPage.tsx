import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { ProfileSection } from '../components/profile/ProfileSection';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();
  const { isAuthenticated } = useAuth();

  const handleResetLocalData = () => {
    if (typeof window === 'undefined') return;

    const confirmMessage = isAuthenticated
      ? (t('resetLocalDataConfirmLoggedIn') || 'This will reset your local data. Your cloud data will be preserved. Continue?')
      : (t('resetDataConfirm') || 'This will reset all your data. Continue?');

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    try {
      window.localStorage.clear();
    } catch (e) {
      console.error('Error resetting localStorage', e);
    }

    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">{t('settings')}</h2>

      {/* Account Section - ProfileSection handles both logged in and logged out states */}
      <ProfileSection />

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            {t('settingsSwitchTo')} {theme === 'dark' ? t('settingsLight') : t('settingsDark')}
          </button>
        </div>
      </div>

      {/* Local Data */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('settingsLocalData')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {isAuthenticated
            ? (t('settingsLocalDataDescriptionLoggedIn') || 'Reset local cache. Your cloud data will remain intact.')
            : t('settingsLocalDataDescription')}
        </p>
        <button
          onClick={handleResetLocalData}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold"
        >
          {t('settingsResetData')}
        </button>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
