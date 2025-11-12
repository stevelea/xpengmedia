import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type Region = 'global' | 'france' | 'germany' | 'spain' | 'italy' | 'uk' | 'netherlands' | 'belgium' | 'sweden' | 'norway' | 'denmark' | 'switzerland' | 'austria' | 'usa' | 'australia' | 'china' | 'singapore' | 'uae' | 'qatar' | 'israel';

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
  { code: 'austria' as Region, name: 'Österreich', flag: '🇦🇹', language: 'de' },
  { code: 'uk' as Region, name: 'United Kingdom', flag: '🇬🇧', language: 'en' },
  { code: 'usa' as Region, name: 'United States', flag: '🇺🇸', language: 'en' },
  { code: 'australia' as Region, name: 'Australia', flag: '🇦🇺', language: 'en' },
  { code: 'china' as Region, name: '中国 China', flag: '🇨🇳', language: 'zh' },
  { code: 'singapore' as Region, name: 'Singapore', flag: '🇸🇬', language: 'en' },
  { code: 'uae' as Region, name: 'UAE الإمارات', flag: '🇦🇪', language: 'ar' },
  { code: 'qatar' as Region, name: 'Qatar قطر', flag: '🇶🇦', language: 'ar' },
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
    selectRegion: 'Select region',
    allServices: 'All services',
    heroTitle: 'An immersive cabin, your favorite platforms',
    heroSubtitle: 'Interface optimized for Xmart OS with video, music, games and charging services.',
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
    selectRegion: 'Sélectionner la région',
    allServices: 'Tous les services',
    heroTitle: 'Une cabine immersive, vos plateformes favorites',
    heroSubtitle: 'Interface optimisée pour Xmart OS avec services vidéo, musique, jeux et recharge.',
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
    selectRegion: 'Region auswählen',
    allServices: 'Alle Dienste',
    heroTitle: 'Eine immersive Kabine, Ihre Lieblingsplattformen',
    heroSubtitle: 'Für Xmart OS optimierte Oberfläche mit Video-, Musik-, Spiele- und Ladediensten.',
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
    selectRegion: 'Seleccionar región',
    allServices: 'Todos los servicios',
    heroTitle: 'Una cabina inmersiva, tus plataformas favoritas',
    heroSubtitle: 'Interfaz optimizada para Xmart OS con servicios de vídeo, música, juegos y carga.',
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
    selectRegion: '选择地区',
    allServices: '所有服务',
    heroTitle: '沉浸式座舱，您喜爱的平台',
    heroSubtitle: '为Xmart OS优化的界面，提供视频、音乐、游戏和充电服务。',
  },
  it: {
    home: 'Home',
    videos: 'Video',
    music: 'Musica',
    games: 'Giochi',
    charging: 'Ricarica',
    others: 'Altri',
    myFavorites: 'I Miei Preferiti',
    smartRecommendations: 'Servizi Consigliati',
    adaptedToYou: 'Adattati automaticamente alle tue abitudini',
    popularServices: 'I più popolari per iniziare',
    learningActive: 'Apprendimento attivo',
    searchPlaceholder: 'Cerca servizi...',
    selectRegion: 'Seleziona regione',
    allServices: 'Tutti i servizi',
    heroTitle: 'Una cabina immersiva, le tue piattaforme preferite',
    heroSubtitle: 'Interfaccia ottimizzata per Xmart OS con servizi video, musica, giochi e ricarica.',
  },
  nl: {
    home: 'Home',
    videos: "Video's",
    music: 'Muziek',
    games: 'Games',
    charging: 'Laden',
    others: 'Andere',
    myFavorites: 'Mijn Favorieten',
    smartRecommendations: 'Aanbevolen Services',
    adaptedToYou: 'Automatisch aangepast aan uw gewoonten',
    popularServices: 'De populairste om mee te beginnen',
    learningActive: 'Actief leren',
    searchPlaceholder: 'Zoek services...',
    selectRegion: 'Selecteer regio',
    allServices: 'Alle services',
    heroTitle: 'Een meeslepende cabine, uw favoriete platforms',
    heroSubtitle: 'Interface geoptimaliseerd voor Xmart OS met video-, muziek-, game- en laasdiensten.',
  },
  sv: {
    home: 'Hem',
    videos: 'Videor',
    music: 'Musik',
    games: 'Spel',
    charging: 'Laddning',
    others: 'Andra',
    myFavorites: 'Mina Favoriter',
    smartRecommendations: 'Rekommenderade Tjänster',
    adaptedToYou: 'Automatiskt anpassad till dina vanor',
    popularServices: 'De populäraste att börja med',
    learningActive: 'Aktivt lärande',
    searchPlaceholder: 'Sök tjänster...',
    selectRegion: 'Välj region',
    allServices: 'Alla tjänster',
    heroTitle: 'En fördjúpande hytt, dina favoritplattformar',
    heroSubtitle: 'Gränssnitt optimerat för Xmart OS med video-, musik-, spel- och laddningstjänster.',
  },
  no: {
    home: 'Hjem',
    videos: 'Videoer',
    music: 'Musikk',
    games: 'Spill',
    charging: 'Lading',
    others: 'Andre',
    myFavorites: 'Mine Favoritter',
    smartRecommendations: 'Anbefalte Tjenester',
    adaptedToYou: 'Automatisk tilpasset dine vaner',
    popularServices: 'De mest populære for å starte',
    learningActive: 'Aktiv læring',
    searchPlaceholder: 'Søk tjenester...',
    selectRegion: 'Velg region',
    allServices: 'Alle tjenester',
    heroTitle: 'En oppslukende kabin, dine favorittplattformer',
    heroSubtitle: 'Grensesnitt optimalisert for Xmart OS med video-, musikk-, spill- og ladetjenester.',
  },
  da: {
    home: 'Hjem',
    videos: 'Videoer',
    music: 'Musik',
    games: 'Spil',
    charging: 'Opladning',
    others: 'Andre',
    myFavorites: 'Mine Favoritter',
    smartRecommendations: 'Anbefalede Tjenester',
    adaptedToYou: 'Automatisk tilpasset dine vaner',
    popularServices: 'De mest populære at starte med',
    learningActive: 'Aktiv læring',
    searchPlaceholder: 'Søg tjenester...',
    selectRegion: 'Vælg region',
    allServices: 'Alle tjenester',
    heroTitle: 'En fordybende kabine, dine yndlingsplatforme',
    heroSubtitle: 'Grænseflade optimeret til Xmart OS med video-, musik-, spil- og opladningstjenester.',
  },
  ar: {
    home: 'الرئيسية',
    videos: 'فيديوهات',
    music: 'موسيقى',
    games: 'ألعاب',
    charging: 'شحن',
    others: 'أخرى',
    myFavorites: 'المفضلة',
    smartRecommendations: 'الخدمات الموصى بها',
    adaptedToYou: 'تتكيف تلقائيًا مع عاداتك',
    popularServices: 'الأكثر شعبية للبدء',
    learningActive: 'التعلم النشط',
    searchPlaceholder: 'ابحث عن الخدمات...',
    selectRegion: 'اختر المنطقة',
    allServices: 'جميع الخدمات',
    heroTitle: 'كابينة غامرة، منصاتك المفضلة',
    heroSubtitle: 'واجهة محسّنة لـ Xmart OS مع خدمات الفيديو والموسيقى والألعاب والشحن.',
  },
  he: {
    home: 'בית',
    videos: 'סרטונים',
    music: 'מוזיקה',
    games: 'משחקים',
    charging: 'טעינה',
    others: 'אחרים',
    myFavorites: 'המועדפים שלי',
    smartRecommendations: 'שירותים מומלצים',
    adaptedToYou: 'מותאם אוטומטית להרגליך',
    popularServices: 'הפופולריים ביותר להתחלה',
    learningActive: 'למידה פעילה',
    searchPlaceholder: 'חפש שירותים...',
    selectRegion: 'בחר אזור',
    allServices: 'כל השירותים',
    heroTitle: 'תא מרשים, הפלטפורמות המועדפות שלך',
    heroSubtitle: 'ממשק מאופטמל עבור Xmart OS עם שירותי וידאו, מוזיקה, משחקים וטעינה.',
  },
};

// Détection avancée avec timezone, user agent et langue
const detectBrowserLocale = (): Locale => {
  const browserLang = navigator.language.toLowerCase();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgent = navigator.userAgent.toLowerCase();
  
  console.log('🌍 Détection auto:', { browserLang, timezone, userAgent: userAgent.substring(0, 100) });
  
  // Détection par timezone + langue combinées (plus précis)
  if (timezone === 'Europe/Paris' || timezone === 'Europe/Brussels' || browserLang.startsWith('fr')) {
    if (browserLang === 'fr-be' || timezone === 'Europe/Brussels') {
      return { region: 'belgium', language: 'nl' };
    }
    return { region: 'france', language: 'fr' };
  }
  
  if (timezone === 'Europe/Berlin' || timezone === 'Europe/Zurich' || timezone === 'Europe/Vienna') {
    if (timezone === 'Europe/Vienna' || browserLang === 'de-at') {
      return { region: 'austria', language: 'de' };
    }
    if (timezone === 'Europe/Zurich' || browserLang === 'de-ch') {
      return { region: 'switzerland', language: 'de' };
    }
    if (browserLang.startsWith('de')) {
      return { region: 'germany', language: 'de' };
    }
  }
  
  if (timezone === 'Europe/Madrid' || browserLang.startsWith('es')) {
    return { region: 'spain', language: 'es' };
  }
  
  if (timezone === 'Europe/Rome' || browserLang.startsWith('it')) {
    return { region: 'italy', language: 'it' };
  }
  
  if (timezone === 'Europe/Amsterdam' || browserLang === 'nl-nl') {
    return { region: 'netherlands', language: 'nl' };
  }
  
  if (timezone === 'Europe/Stockholm' || browserLang.startsWith('sv')) {
    return { region: 'sweden', language: 'sv' };
  }
  
  if (timezone === 'Europe/Oslo' || browserLang.startsWith('no')) {
    return { region: 'norway', language: 'no' };
  }
  
  if (timezone === 'Europe/Copenhagen' || browserLang.startsWith('da')) {
    return { region: 'denmark', language: 'da' };
  }
  
  if (timezone === 'Europe/London' || browserLang === 'en-gb') {
    return { region: 'uk', language: 'en' };
  }
  
  if (timezone.startsWith('America/') && browserLang === 'en-us') {
    return { region: 'usa', language: 'en' };
  }
  
  if (timezone.startsWith('Australia/') || browserLang === 'en-au') {
    return { region: 'australia', language: 'en' };
  }
  
  if (timezone === 'Asia/Shanghai' || timezone === 'Asia/Hong_Kong' || browserLang.startsWith('zh')) {
    return { region: 'china', language: 'zh' };
  }
  
  if (timezone === 'Asia/Singapore' || browserLang === 'en-sg') {
    return { region: 'singapore', language: 'en' };
  }
  
  if (timezone === 'Asia/Dubai' || timezone === 'Asia/Qatar') {
    if (timezone === 'Asia/Qatar' || browserLang === 'ar-qa') {
      return { region: 'qatar', language: 'ar' };
    }
    return { region: 'uae', language: 'ar' };
  }
  
  if (timezone === 'Asia/Jerusalem' || browserLang.startsWith('he')) {
    return { region: 'israel', language: 'he' };
  }
  
  if (browserLang.startsWith('ar')) {
    return { region: 'uae', language: 'ar' };
  }
  
  // Global par défaut (TOUJOURS en anglais)
  console.log('🌍 Aucune région spécifique détectée, utilisation de Global (EN)');
  return { region: 'global', language: 'en' };
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Charger depuis localStorage ou détecter automatiquement
    const saved = localStorage.getItem('xpeng_locale');
    if (saved) {
      const parsedLocale = JSON.parse(saved);
      console.log('🔵 Locale chargé depuis localStorage:', parsedLocale);
      return parsedLocale;
    }
    const detectedLocale = detectBrowserLocale();
    console.log('🔍 Locale détecté automatiquement:', detectedLocale);
    return detectedLocale;
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    console.log('💾 Sauvegarde localStorage:', locale);
    localStorage.setItem('xpeng_locale', JSON.stringify(locale));
  }, [locale]);

  // Fonction setLocale avec useCallback pour stabiliser la référence
  const setLocale = useCallback((newLocale: Locale) => {
    console.log('🔄 LocaleContext: Setting new locale', newLocale);
    setLocaleState(newLocale);
  }, []);

  // Fonction de traduction avec useCallback qui dépend de locale
  const t = useCallback((key: string): string => {
    const lang = locale.language;
    const translation = translations[lang]?.[key] || translations['en']?.[key] || key;
    return translation;
  }, [locale.language]);

  // Mémoriser la valeur du contexte pour forcer les re-renders
  const contextValue = useMemo(
    () => ({ locale, setLocale, availableRegions: regions, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
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
