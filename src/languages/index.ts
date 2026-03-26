export type SupportedLanguage = 'en' | 'sp' | 'de';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  displayName: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'english', displayName: 'English' },
  { code: 'sp', name: 'spanish', displayName: 'Español' },
  { code: 'de', name: 'german', displayName: 'Deutsch' }
];

export function validateLanguage(language: string): SupportedLanguage {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === language) 
    ? language as SupportedLanguage 
    : 'en';
}

export function getLanguageName(code: SupportedLanguage): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang?.displayName || 'English';
}

export function getSupportedLanguageCodes(): SupportedLanguage[] {
  return SUPPORTED_LANGUAGES.map(lang => lang.code);
}
