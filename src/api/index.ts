import type { SupportedLanguage } from '../languages';

export interface LinkToVersePluginSettings {
  bibleLanguage: SupportedLanguage;
  defaultVersion: string;
  encodeSpacesToPlus: boolean;
  linkTemplate: string;
  validateBookName: boolean;
}

