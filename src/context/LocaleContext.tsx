import React, { createContext, useContext, useState, useEffect } from 'react';

type Region = 'global' | 'france' | 'germany' | 'spain' | 'italy' | 'uk' | 'netherlands' | 'belgium' | 'sweden' | 'norway' | 'denmark' | 'switzerland' | 'usa' | 'china' | 'singapore' | 'uae' | 'israel';

interface Locale {
  region: Region;
  language: string;
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableRegions: Array<{
    code: Region;
    name: string;
    flag: string;
    language: string;
  }>;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Pays où XPENG est officiellement distribué
const regions = [
  { code: 'global' as Region, name: 'Global / International', flag: '🌍', language: 'en' },
  { code: 'france' as Region, name: 'France', flag: '🇫🇷', language: 'fr' },
  { code: 'germany' as Region, name: 'Deutschland', flag: '🇩🇪', language: 'de' },
  { code: 'netherlands' as Region, name: 'Nederland', flag: '🇳🇱', language: 'nl' },
  { code: 'belgium' as Region, name: 'België / Belgique', flag: '🇧🇪', language: 'nl' },
  { code: 'spain' as Region, name: 'España', flag: '🇪🇸', language: 'es' },
  { code: 'italy' as Region, name: 'Italia', flag: '🇮🇹', language: 'it' },
  { code: 'sweden' as Region, name: 'Sverige', flag: '🇸🇪', language: 'sv' },
  { code: 'norway' as Region, name: 'Norge', flag: '🇳🇴', language: 'no' },
  { code: 'denmark' as Region, name: 'Danmark', flag: '🇩🇰', language: 'da' },
  { code: 'switzerland' as Region, name: 'Schweiz / Suisse', flag: '🇨🇭', language: 'de' },
  { code: 'uk' as Region, name: 'United Kingdom', flag: '🇬🇧', language: 'en' },
  { code: 'usa' as Region, name: 'United States', flag: '🇺🇸', language: 'en' },
  { code: 'china' as Region, name: '中国 China', flag: '🇨🇳', language: 'zh' },
  { code: 'singapore' as Region, name: 'Singapore', flag: '🇸🇬', language: 'en' },
  { code: 'uae' as Region, name: 'UAE الإمارات', flag: '🇦🇪', language: 'ar' },
  { code: 'israel' as Region, name: 'Israel ישראל', flag: '🇮🇱', language: 'he' },
];

// Traductions basiques
const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    videos: 'Videos',
    music: 'Music',
    games: 'Games',
    charging: 'Charging',
    others: 'Others',
    myFavorites: 'My Favorites',
    smartRecommendations: 'Recommended Services',
    adaptedToYou: 'Automatically adapted to your habits',
    popularServices: 'The most popular to start',
    learningActive: 'Active learning',
    searchPlaceholder: 'Search services...',
  },
  fr: {
    home: 'Accueil',
    videos: 'Vidéos',
    music: 'Musique',
    games: 'Jeux',
    charging: 'Recharge',
    others: 'Autres',
    myFavorites: 'Mes Favoris',
    smartRecommendations: 'Services Recommandés',
    adaptedToYou: 'Adaptés automatiquement à vos habitudes',
    popularServices: 'Les plus populaires pour commencer',
    learningActive: 'Apprentissage actif',
    searchPlaceholder: 'Rechercher des services...',
  },
  de: {
    home: 'Startseite',
    videos: 'Videos',
    music: 'Musik',
    games: 'Spiele',
    charging: 'Laden',
    others: 'Andere',
    myFavorites: 'Meine Favoriten',
    smartRecommendations: 'Empfohlene Dienste',
    adaptedToYou: 'Automatisch an Ihre Gewohnheiten angepasst',
    popularServices: 'Die beliebtesten zum Starten',
    learningActive: 'Aktives Lernen',
    searchPlaceholder: 'Dienste suchen...',
  },
  es: {
    home: 'Inicio',
    videos: 'Vídeos',
    music: 'Música',
    games: 'Juegos',
    charging: 'Carga',
    others: 'Otros',
    myFavorites: 'Mis Favoritos',
    smartRecommendations: 'Servicios Recomendados',
    adaptedToYou: 'Adaptados automáticamente a tus hábitos',
    popularServices: 'Los más populares para empezar',
    learningActive: 'Aprendizaje activo',
    searchPlaceholder: 'Buscar servicios...',
  },
  zh: {
    home: '主页',
    videos: '视频',
    music: '音乐',
    games: '游戏',
    charging: '充电',
    others: '其他',
    myFavorites: '我的收藏',
    smartRecommendations: '推荐服务',
    adaptedToYou: '自动适应您的习惯',
    popularServices: '最受欢迎的开始',
    learningActive: '主动学习',
    searchPlaceholder: '搜索服务...',
  },
};

// Détection automatique de la langue du navigateur
const detectBrowserLocale = (): Locale => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('fr')) {
    return { region: 'france', language: 'fr' };
  } else if (browserLang.startsWith('de')) {
    return { region: 'germany', language: 'de' };
  } else if (browserLang.startsWith('es')) {
    return { region: 'spain', language: 'es' };
  } else if (browserLang.startsWith('it')) {
    return { region: 'italy', language: 'it' };
  } else if (browserLang.startsWith('nl')) {
    return { region: 'netherlands', language: 'nl' };
  } else if (browserLang.startsWith('sv')) {
    return { region: 'sweden', language: 'sv' };
  } else if (browserLang.startsWith('no')) {
    return { region: 'norway', language: 'no' };
  } else if (browserLang.startsWith('da')) {
    return { region: 'denmark', language: 'da' };
  } else if (browserLang.startsWith('zh')) {
    return { region: 'china', language: 'zh' };
  } else if (browserLang.startsWith('ar')) {
    return { region: 'uae', language: 'ar' };
  } else if (browserLang.startsWith('he')) {
    return { region: 'israel', language: 'he' };
  } else if (browserLang.startsWith('en-gb')) {
    return { region: 'uk', language: 'en' };
  } else if (browserLang.startsWith('en-us')) {
    return { region: 'usa', language: 'en' };
  } else if (browserLang.startsWith('en-sg')) {
    return { region: 'singapore', language: 'en' };
  }
  
  return { region: 'global', language: 'en' };
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Charger depuis localStorage ou détecter automatiquement
    const saved = localStorage.getItem('xpeng_locale');
    if (saved) {
      return JSON.parse(saved);
    }
    return detectBrowserLocale();
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('xpeng_locale', JSON.stringify(locale));
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  // Fonction de traduction
  const t = (key: string): string => {
    const lang = locale.language;
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, availableRegions: regions, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
