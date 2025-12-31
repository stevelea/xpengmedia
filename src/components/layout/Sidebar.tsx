import React from 'react';
import { NavLink } from 'react-router-dom';
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
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Accueil', icon: <HomeIcon className="h-6 w-6" />, path: '/' },
  { name: 'Vidéos', icon: <FilmIcon className="h-6 w-6" />, path: '/videos' },
  { name: 'Musique', icon: <MusicalNoteIcon className="h-6 w-6" />, path: '/music' },
  { name: 'Jeux', icon: <PuzzlePieceIcon className="h-6 w-6" />, path: '/games' },
  { name: 'Recharge', icon: <MapPinIcon className="h-6 w-6" />, path: '/charging' },
  { name: 'Tous les services', icon: <Squares2X2Icon className="h-6 w-6" />, path: '/all-services' },
  { name: 'Autres', icon: <SparklesIcon className="h-6 w-6" />, path: '/other-services' },
  { name: 'Paramètres', icon: <Cog6ToothIcon className="h-6 w-6" />, path: '/settings' },
];

export const Sidebar: React.FC = () => {
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
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
