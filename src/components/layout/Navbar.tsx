import React, { useState, useRef } from 'react';
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
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                XPeng Media
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sélecteur de pays */}
            <CountrySelector countries={countries} currentCountry={currentCountry} onSelect={setCurrentCountry} />

            {/* Bouton de thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <FiMoon className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
