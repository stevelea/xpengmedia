# XPeng Media Center

Une application web moderne pour gérer le divertissement multimédia, inspirée de l'interface Xpeng XOS.

## Fonctionnalités

- Interface utilisateur moderne avec thème clair/sombre
- Navigation intuitive avec barre latérale
- Catégories de contenu organisées
- Mode hors ligne (bientôt disponible)
- Optimisé pour les appareils mobiles

## Déploiement

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/xpeng-media.git
   cd xpeng-media
   ```

2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Lancer en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Construire pour la production :
   ```bash
   npm run build
   # ou
   yarn build
   ```

## Déploiement sur GitHub Pages

1. Assurez-vous que votre dépôt est configuré sur GitHub
2. Activez GitHub Pages dans les paramètres du dépôt (Settings > Pages)
3. Sélectionnez la branche `gh-pages` comme source
4. L'application sera disponible à l'adresse : `https://votre-utilisateur.github.io/xpeng-media/`

## Domaine personnalisé

Pour utiliser un domaine personnalisé :

1. Achetez un domaine (ou utilisez un service gratuit comme Freenom)
2. Dans les paramètres de votre dépôt GitHub, ajoutez votre domaine personnalisé
3. Configurez les enregistrements DNS de votre domaine pour pointer vers GitHub Pages

## Licence

Ce projet est sous licence MIT.,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# xpengmedia
