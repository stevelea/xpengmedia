// Main i18n module - exports all translation utilities
// Place this folder in src/i18n/

export { translations, type SupportedLanguage } from './translations';
export { platformTranslations, getPlatformDescription } from './platformTranslations';
export { categoryTranslations, getCategoryTranslation, type CategoryTranslation } from './categoryTranslations';

// Re-export for convenience
import { translations, type SupportedLanguage } from './translations';
import { getPlatformDescription } from './platformTranslations';
import { getCategoryTranslation } from './categoryTranslations';

/**
 * Main translation function
 * Usage: t('home', 'fr') => 'Accueil'
 */
export const t = (key: string, language: SupportedLanguage = 'en'): string => {
  return translations[language]?.[key] || translations.en?.[key] || key;
};

/**
 * Get localized platform info
 * Usage: getPlatform('netflix', 'fr') => { description: 'Films, séries...' }
 */
export const getPlatform = (platformId: string, language: SupportedLanguage) => {
  return {
    description: getPlatformDescription(platformId, language),
  };
};

/**
 * Get localized category info
 * Usage: getCategory('streaming-vod', 'fr') => { title: 'Streaming & VOD', subtitle: '...' }
 */
export const getCategory = (categoryId: string, language: SupportedLanguage) => {
  return getCategoryTranslation(categoryId, language);
};

export default {
  translations,
  t,
  getPlatform,
  getCategory,
  getPlatformDescription,
  getCategoryTranslation,
};
