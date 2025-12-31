# XPENG Media Hub - Icônes uniformes

## Design System

### Tailles standardisées

- **Small (sm)**: 40x40px (10rem) - Utilisé pour les favoris en mode portrait
- **Medium (md)**: 48x48px (12rem) - Utilisé pour les cards standards
- **Large (lg)**: 64x64px (16rem) - Utilisé pour les grandes vignettes

### Style uniforme

Toutes les icônes suivent le même design XPENG :

- **Background**: Dégradé cyan-50 → blue-50 (mode clair) / slate-800 → slate-700 (mode sombre)
- **Border**: 2px solid cyan-200/50 (mode clair) / cyan-500/30 (mode sombre)
- **Border radius**: rounded-xl (0.75rem)
- **Shadow**: shadow-sm avec transition
- **Hover effect**: 
  - Scale 105%
  - Border cyan-300
  - Shadow-md

### Compatibilité

- ✅ Mode portrait et paysage
- ✅ Mode clair et sombre
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Bouton suppression cliquable (32x32px avec ring blanc)

### Accessibilité

- Aria-hidden sur les conteneurs d'icônes
- Labels descriptifs pour les boutons d'action
- Contraste suffisant en mode clair et sombre
- Zone de clic suffisamment grande (minimum 32x32px)

## Structure des composants

```tsx
<PlatformIcon 
  icon="🎬"              // Emoji ou texte
  name="Netflix"         // Nom du service (pour aria-label)
  size="md"              // sm | md | lg
  className=""           // Classes Tailwind additionnelles
/>
```

## Bouton de suppression

- **Taille**: 32x32px (h-8 w-8)
- **Position**: absolute -right-2 -top-2
- **Style**: bg-red-500 avec ring-2 ring-white
- **Icône**: XMarkIcon 20x20px (h-5 w-5)
- **Interactions**: 
  - Hover: scale-110 + bg-red-600
  - Active: scale-95
  - Animation spring pour apparition/disparition

## Notes techniques

Le système utilise des emojis Unicode pour les icônes, ce qui assure :
- ✅ Compatibilité universelle (pas de dépendance externe)
- ✅ Taille de bundle minimale
- ✅ Pas de requêtes réseau supplémentaires
- ✅ Support natif des couleurs emoji

Pour des icônes SVG personnalisées, placer les fichiers dans ce dossier.
