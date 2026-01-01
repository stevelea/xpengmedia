import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LocaleProvider } from './context/LocaleContext';
import './index.css';
import App from './App';

// Capture OAuth tokens BEFORE React/HashRouter can modify the URL
// This is critical for implicit flow with HashRouter
const INITIAL_HASH = window.location.hash;
const INITIAL_URL = window.location.href;
const INITIAL_SEARCH = window.location.search;

if (INITIAL_HASH.includes('access_token')) {
  sessionStorage.setItem('oauth_hash', INITIAL_HASH);
}
if (INITIAL_SEARCH.includes('access_token')) {
  sessionStorage.setItem('oauth_search', INITIAL_SEARCH);
}
if (INITIAL_URL.includes('access_token') && !INITIAL_HASH.includes('access_token') && !INITIAL_SEARCH.includes('access_token')) {
  sessionStorage.setItem('oauth_full_url', INITIAL_URL);
}

// Utilisation de HashRouter pour une meilleure compatibilité avec GitHub Pages
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <LocaleProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </LocaleProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
