import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, FilmIcon, MusicalNoteIcon, TvIcon, BoltIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Accueil', icon: <HomeIcon className="h-6 w-6" />, path: '/' },
  { name: 'Vidéos', icon: <FilmIcon className="h-6 w-6" />, path: '/videos' },
  { name: 'Musique', icon: <MusicalNoteIcon className="h-6 w-6" />, path: '/music' },
  { name: 'Jeux', icon: <TvIcon className="h-6 w-6" />, path: '/games' },
  { name: 'Recharge', icon: <BoltIcon className="h-6 w-6" />, path: '/charging' },
  { name: 'Paramètres', icon: <Cog6ToothIcon className="h-6 w-6" />, path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-shrink-0 hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-primary-600 dark:text-primary-400">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
