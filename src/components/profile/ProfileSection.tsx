import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { CarSelector } from './CarSelector';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import type { XpengModel } from '../../types/database';
import { CheckIcon, CloudIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const ProfileSection: React.FC = () => {
  const { user, profile, isAuthenticated, isLoading, updateProfile, signOut } = useAuth();
  const { t } = useLocale();

  const [displayName, setDisplayName] = useState('');
  const [carModel, setCarModel] = useState<XpengModel>(null);
  const [carNickname, setCarNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setCarModel(profile.car_model);
      setCarNickname(profile.car_nickname || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!isAuthenticated) return;

    setIsSaving(true);
    try {
      await updateProfile({
        display_name: displayName || null,
        car_model: carModel,
        car_nickname: carNickname || null,
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('account') || 'Account'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t('accountDescription') || 'Sign in to sync your preferences across devices.'}
        </p>

        <GoogleSignInButton />

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <CloudIcon className="w-4 h-4" />
          <span>{t('cloudSyncInfo') || 'Your settings will be saved to the cloud'}</span>
        </div>
      </div>
    );
  }

  // Google OAuth provides 'picture' in user_metadata
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.['avatar_url'] || user?.user_metadata?.['picture'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('account') || 'Account'}
        </h3>
        <div className="flex items-center gap-2 text-xs text-green-500">
          <CloudArrowUpIcon className="w-4 h-4" />
          <span>{t('cloudSyncEnabled') || 'Cloud sync enabled'}</span>
        </div>
      </div>

      {/* User info header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
            {displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('signedInAs') || 'Signed in as'} Google
          </p>
        </div>
      </div>

      {/* Profile form */}
      <div className="space-y-4">
        {/* Display name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('displayName') || 'Display Name'}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={user?.user_metadata?.['full_name'] as string || 'Your name'}
            className="w-full px-4 py-3
                       bg-white dark:bg-gray-900
                       border border-gray-300 dark:border-gray-600
                       rounded-xl
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Car model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('carModel') || 'XPENG Model'}
          </label>
          <CarSelector value={carModel} onChange={setCarModel} />
        </div>

        {/* Car nickname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('carNickname') || 'Car Nickname'}
          </label>
          <input
            type="text"
            value={carNickname}
            onChange={(e) => setCarNickname(e.target.value)}
            placeholder={t('carNicknamePlaceholder') || 'e.g., My G6, Road Runner'}
            className="w-full px-4 py-3
                       bg-white dark:bg-gray-900
                       border border-gray-300 dark:border-gray-600
                       rounded-xl
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2
                       px-4 py-3
                       bg-blue-500 hover:bg-blue-600
                       text-white font-medium
                       rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSaved ? (
              <>
                <CheckIcon className="w-5 h-5" />
                {t('saved') || 'Saved'}
              </>
            ) : (
              t('saveChanges') || 'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3
                     text-red-500 hover:text-red-600
                     border border-red-200 dark:border-red-900
                     hover:bg-red-50 dark:hover:bg-red-900/20
                     rounded-xl
                     font-medium
                     transition-colors"
        >
          {t('signOut') || 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
