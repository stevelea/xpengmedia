import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { LocaleSelector } from '../locale/LocaleSelector';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();

  return (
    <nav className="border-b border-white/10 bg-white/80 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-2 dark:from-cyan-500 dark:to-blue-500">
            <span className="text-base font-bold tracking-tight text-white dark:text-white">XPENG</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Media Hub</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/70 md:flex">
          {[
            { nameKey: 'home', path: '/' },
            { nameKey: 'videos', path: '/videos' },
            { nameKey: 'music', path: '/music' },
            { nameKey: 'games', path: '/games' },
            { nameKey: 'charging', path: '/charging' },
            { nameKey: 'others', path: '/other-services' },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow dark:bg-cyan-500 dark:text-white'
                    : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {t(item.nameKey)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSelector />

          <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/70 text-slate-600 transition hover:scale-105 hover:text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800/70 dark:text-white"
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5 text-amber-300" />
            ) : (
              <FiMoon className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
