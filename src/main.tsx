import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';
import App from './App';

// Utilisation de HashRouter pour une meilleure compatibilité avec GitHub Pages
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);
