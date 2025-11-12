import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSun, FiMoon, FiChevronDown, FiGlobe, FiCheck } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface CountrySelectorProps {
  countries: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
  currentCountry: string;
  onSelect: (countryCode: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ countries, currentCountry, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const current = countries.find(c => c.code === currentCountry) || countries[0] || { code: '', name: '', flag: '' };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left mr-2" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none border border-gray-300 dark:border-gray-600"
          id="country-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiGlobe className="mr-2 h-5 w-5 text-blue-500" />
          <span className="mr-1">{current?.flag}</span>
          <span className="hidden sm:inline">{current?.code}</span>
          <FiChevronDown className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-96 overflow-y-auto">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="country-menu">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onSelect(country.code);
                  setIsOpen(false);
                }}
                className={`${
                  currentCountry === country.code ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                role="menuitem"
              >
                <span className="mr-3 text-lg">{country.flag}</span>
                <span className="flex-1 text-left">{country.name}</span>
                {currentCountry === country.code && (
                  <FiCheck className="h-5 w-5 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { countries, currentCountry, setCurrentCountry } = useFavorites();

  return (
    <nav className="border-b border-white/10 bg-white/80 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-2 dark:from-white dark:to-slate-200">
            <span className="text-base font-bold tracking-tight text-white dark:text-slate-900">XPENG</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Media Hub</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/70 md:flex">
          {[
            { name: 'Accueil', path: '/' },
            { name: 'Vidéos', path: '/videos' },
            { name: 'Musique', path: '/music' },
            { name: 'Jeux', path: '/games' },
            { name: 'Recharge', path: '/charging' },
            { name: 'Autres', path: '/other-services' },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CountrySelector countries={countries} currentCountry={currentCountry} onSelect={setCurrentCountry} />

          <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/70 text-slate-600 transition hover:scale-105 hover:text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/70 dark:text-white"
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
