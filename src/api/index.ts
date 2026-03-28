import type { TemplatePresetId } from '../presets';

export interface LinkToVersePluginSettings {
  bibleLanguage: 'en' | 'sp';
  defaultVersion: string;
  encodeSpacesToPlus: boolean;
  linkTemplate: string;
  selectedPreset: TemplatePresetId;
  validateBookName: boolean;
}
