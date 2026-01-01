import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { debouncedSyncTheme } from '../services/syncService';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const { user, preferences, isAuthenticated } = useAuth();

  // Load theme from cloud preferences when authenticated
  useEffect(() => {
    if (isAuthenticated && preferences?.theme) {
      setThemeState(preferences.theme);
    }
  }, [isAuthenticated, preferences?.theme]);

  // Load from localStorage on initial mount (for unauthenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }
  }, [isAuthenticated]);

  // Apply theme to document and save
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Always save to localStorage (for offline fallback)
    localStorage.setItem('theme', theme);

    // Sync to cloud if authenticated
    if (isAuthenticated && user?.id) {
      debouncedSyncTheme(user.id, theme);
    }
  }, [theme, isAuthenticated, user?.id]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
