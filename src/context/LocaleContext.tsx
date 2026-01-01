// Updated LocaleContext.tsx with full i18n support
// Replace your existing src/context/LocaleContext.tsx with this file

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, type SupportedLanguage } from '../i18n/translations';
import { getPlatformDescription } from '../i18n/platformTranslations';
import { getCategoryTranslation, type CategoryTranslation } from '../i18n/categoryTranslations';
import { useAuth } from './AuthContext';
import { debouncedSyncLocale } from '../services/syncService';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Region = 
  | 'global'
  | 'france' | 'spain' | 'italy' | 'belgium'
  | 'germany' | 'austria' | 'switzerland' | 'netherlands'
  | 'sweden' | 'norway' | 'denmark'
  | 'uk' | 'usa' | 'australia'
  | 'china' | 'singapore'
  | 'uae' | 'qatar' | 'israel';

export type Language = SupportedLanguage;

export interface Locale {
  region: Region;
  language: Language;
}

export interface RegionInfo {
  code: Region;
  name: string;
  flag: string;
  language: Language;
}

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tPlatform: (platformId: string) => string;
  tCategory: (categoryId: string) => CategoryTranslation;
  regions: RegionInfo[];
  currentRegion: RegionInfo | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGIONS DATA
// ═══════════════════════════════════════════════════════════════════════════

export const regions: RegionInfo[] = [
  { code: 'global', name: 'Global / International', flag: '🌍', language: 'en' },
  // Western Europe (Latin languages)
  { code: 'france', name: 'France', flag: '🇫🇷', language: 'fr' },
  { code: 'spain', name: 'España', flag: '🇪🇸', language: 'es' },
  { code: 'italy', name: 'Italia', flag: '🇮🇹', language: 'it' },
  { code: 'belgium', name: 'België / Belgique', flag: '🇧🇪', language: 'fr' },
  // Northern Europe (Germanic languages)
  { code: 'germany', name: 'Deutschland', flag: '🇩🇪', language: 'de' },
  { code: 'austria', name: 'Österreich', flag: '🇦🇹', language: 'de' },
  { code: 'switzerland', name: 'Schweiz / Suisse', flag: '🇨🇭', language: 'de' },
  { code: 'netherlands', name: 'Nederland', flag: '🇳🇱', language: 'nl' },
  // Scandinavia
  { code: 'sweden', name: 'Sverige', flag: '🇸🇪', language: 'sv' },
  { code: 'norway', name: 'Norge', flag: '🇳🇴', language: 'no' },
  { code: 'denmark', name: 'Danmark', flag: '🇩🇰', language: 'da' },
  // Anglophone
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', language: 'en' },
  { code: 'usa', name: 'United States', flag: '🇺🇸', language: 'en' },
  { code: 'australia', name: 'Australia', flag: '🇦🇺', language: 'en' },
  // Asia
  { code: 'china', name: '中国 China', flag: '🇨🇳', language: 'zh' },
  { code: 'singapore', name: 'Singapore', flag: '🇸🇬', language: 'en' },
  // Middle East
  { code: 'uae', name: 'UAE الإمارات', flag: '🇦🇪', language: 'ar' },
  { code: 'qatar', name: 'Qatar قطر', flag: '🇶🇦', language: 'ar' },
  { code: 'israel', name: 'Israel ישראל', flag: '🇮🇱', language: 'he' },
];

// ═══════════════════════════════════════════════════════════════════════════
// DETECTION
// ═══════════════════════════════════════════════════════════════════════════

const detectBrowserLocale = (): Locale => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLang = navigator.language?.toLowerCase() || 'en';

    // Timezone to region mapping
    const timezoneToRegion: Record<string, Region> = {
      'Europe/Paris': 'france',
      'Europe/Brussels': 'belgium',
      'Europe/Madrid': 'spain',
      'Europe/Rome': 'italy',
      'Europe/Berlin': 'germany',
      'Europe/Vienna': 'austria',
      'Europe/Zurich': 'switzerland',
      'Europe/Amsterdam': 'netherlands',
      'Europe/Stockholm': 'sweden',
      'Europe/Oslo': 'norway',
      'Europe/Copenhagen': 'denmark',
      'Europe/London': 'uk',
      'America/New_York': 'usa',
      'America/Los_Angeles': 'usa',
      'America/Chicago': 'usa',
      'Australia/Sydney': 'australia',
      'Australia/Melbourne': 'australia',
      'Asia/Shanghai': 'china',
      'Asia/Hong_Kong': 'china',
      'Asia/Singapore': 'singapore',
      'Asia/Dubai': 'uae',
      'Asia/Qatar': 'qatar',
      'Asia/Jerusalem': 'israel',
    };

    // Language to language code mapping
    const langToCode: Record<string, Language> = {
      'fr': 'fr', 'fr-fr': 'fr', 'fr-be': 'fr', 'fr-ch': 'fr', 'fr-ca': 'fr',
      'de': 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
      'es': 'es', 'es-es': 'es', 'es-mx': 'es',
      'it': 'it', 'it-it': 'it',
      'nl': 'nl', 'nl-nl': 'nl', 'nl-be': 'nl',
      'sv': 'sv', 'sv-se': 'sv',
      'no': 'no', 'nb': 'no', 'nn': 'no',
      'da': 'da', 'da-dk': 'da',
      'zh': 'zh', 'zh-cn': 'zh', 'zh-tw': 'zh', 'zh-hans': 'zh', 'zh-hant': 'zh',
      'ar': 'ar', 'ar-ae': 'ar', 'ar-qa': 'ar',
      'he': 'he', 'he-il': 'he',
      'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en',
    };

    const detectedRegion = timezoneToRegion[timezone] || 'france'; // Default to France
    const baseLang = browserLang.split('-')[0] || 'en';
    const detectedLanguage = langToCode[browserLang] || langToCode[baseLang] || 'fr';

    return {
      region: detectedRegion,
      language: detectedLanguage,
    };
  } catch (error) {
    console.warn('Locale detection failed, defaulting to France/French:', error);
    return { region: 'france', language: 'fr' };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = 'xpeng_locale';

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, preferences, isAuthenticated } = useAuth();

  const [locale, setLocaleState] = useState<Locale>(() => {
    // Try to load from localStorage first
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.region && parsed.language) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load locale from storage:', e);
    }

    // Otherwise detect from browser
    return detectBrowserLocale();
  });

  // Load locale from cloud preferences when authenticated
  useEffect(() => {
    if (isAuthenticated && preferences?.region && preferences?.language) {
      setLocaleState({
        region: preferences.region as Region,
        language: preferences.language as Language,
      });
    }
  }, [isAuthenticated, preferences?.region, preferences?.language]);

  // Save to localStorage when locale changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locale));

      // Sync to cloud if authenticated
      if (isAuthenticated && user?.id) {
        debouncedSyncLocale(user.id, locale.region, locale.language);
      }
    } catch (e) {
      // Silently fail
    }
  }, [locale, isAuthenticated, user?.id]);

  // Translation function for UI strings
  const t = useCallback((key: string): string => {
    const lang = locale.language;
    return translations[lang]?.[key] || translations.en?.[key] || key;
  }, [locale.language]);

  // Translation function for platform descriptions
  const tPlatform = useCallback((platformId: string): string => {
    return getPlatformDescription(platformId, locale.language);
  }, [locale.language]);

  // Translation function for category titles/subtitles
  const tCategory = useCallback((categoryId: string): CategoryTranslation => {
    return getCategoryTranslation(categoryId, locale.language);
  }, [locale.language]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const currentRegion = regions.find(r => r.code === locale.region);

  const value: LocaleContextType = {
    locale,
    setLocale,
    t,
    tPlatform,
    tCategory,
    regions,
    currentRegion,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default LocaleContext;
