import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import {
  HomeIcon,
  FilmIcon,
  MusicalNoteIcon,
  PuzzlePieceIcon,
  Cog6ToothIcon,
  MapPinIcon,
  SparklesIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

type NavItem = {
  id: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { id: 'home', icon: <HomeIcon className="h-6 w-6" />, path: '/' },
  { id: 'videos', icon: <FilmIcon className="h-6 w-6" />, path: '/videos' },
  { id: 'music', icon: <MusicalNoteIcon className="h-6 w-6" />, path: '/music' },
  { id: 'games', icon: <PuzzlePieceIcon className="h-6 w-6" />, path: '/games' },
  { id: 'charging', icon: <MapPinIcon className="h-6 w-6" />, path: '/charging' },
  { id: 'allServices', icon: <Squares2X2Icon className="h-6 w-6" />, path: '/all-services' },
  { id: 'others', icon: <SparklesIcon className="h-6 w-6" />, path: '/other-services' },
  { id: 'settings', icon: <Cog6ToothIcon className="h-6 w-6" />, path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const { t } = useLocale();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-white/70 backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-950/60 md:block">
      <nav className="p-5">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg ring-1 ring-slate-900/20 dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-white hover:shadow dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`
                }
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 transition group-hover:scale-105 dark:bg-white/10 dark:text-slate-100"
                >
                  {item.icon}
                </span>
                <span>{t(item.id)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
