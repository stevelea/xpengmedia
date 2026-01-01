import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-400 animate-pulse" title="Loading auth..." />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/settings"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   rounded-lg transition-colors"
      >
        <UserCircleIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{t('signIn') || 'Sign In'}</span>
      </Link>
    );
  }

  // Google OAuth provides 'picture' and 'full_name' in user_metadata
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.['avatar_url'] || user?.user_metadata?.['picture'];
  const displayName = profile?.display_name || user?.user_metadata?.['full_name'] || user?.user_metadata?.['name'] || user?.email?.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56
                        bg-white dark:bg-gray-800
                        rounded-xl shadow-lg
                        border border-gray-200 dark:border-gray-700
                        py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
            {profile?.car_model && (
              <p className="text-xs text-blue-500 mt-1">
                {profile.car_nickname || profile.car_model}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm
                         text-gray-700 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              {t('settings') || 'Settings'}
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm
                         text-red-600 dark:text-red-400
                         hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              {t('signOut') || 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
