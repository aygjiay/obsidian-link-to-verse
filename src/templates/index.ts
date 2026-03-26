import type { BibleRange, ParsedBibleReference } from '@j316/bible-ref-parser/dist/api';

export interface TemplateConfig {
  name: string;
  tokens: string[];
  format: (params: TemplateParams) => TemplateResult;
}

export interface TemplateParams {
  parsedVerse: ParsedBibleReference;
  range: BibleRange;
  index: number;
  defaultVersion: string;
  linkTemplate: string;
  encodeSpacesToPlus: boolean;
  bookUri: string;
  bookText: string;
}

export interface TemplateResult {
  url: string;
  displayText: string;
}

export const DEFAULT_TEMPLATE: TemplateConfig = {
  name: 'default',
  tokens: ['verse', 'version'],
  format: ({ parsedVerse, range, index, defaultVersion, linkTemplate, encodeSpacesToPlus, bookUri, bookText }) => {
    const spaceChar = encodeSpacesToPlus ? '+' : encodeURIComponent(' ');
    const from = `${range.fromVerse}`;
    const to = `${range.fromVerse === range.toVerse ? '' : `-${range.toVerse}`}`;
    const firstVersion = Array.isArray(parsedVerse.version) ? parsedVerse.version[0] : parsedVerse.version;
    const versionText = index === parsedVerse.ranges.length - 1 && firstVersion !== defaultVersion ? ` ${firstVersion}` : '';
    
    const verseRangeUri = linkTemplate
      .replace('{{verse}}', `${bookUri}${spaceChar}${range.chapter}.${from}${to}`)
      .replace('{{version}}', firstVersion);

    const rangeText = `${range.chapter}:${from}${to}`;
    
    return {
      url: verseRangeUri,
      displayText: `[${bookText} ${rangeText}${versionText}](${verseRangeUri})`
    };
  }
};

export const OLIVE_TREE_TEMPLATE: TemplateConfig = {
  name: 'olive-tree',
  tokens: ['book', 'chapter', 'verse', 'version'],
  format: ({ parsedVerse, range, index, defaultVersion, linkTemplate, bookUri, bookText }) => {
    const verse = `${range.fromVerse}`;
    const firstVersion = Array.isArray(parsedVerse.version) ? parsedVerse.version[0] : parsedVerse.version;
    const versionText = index === parsedVerse.ranges.length - 1 && firstVersion !== defaultVersion ? ` ${firstVersion}` : '';
    
    const verseRangeUri = linkTemplate
      .replace('{{book}}', bookUri)
      .replace('{{chapter}}', `${range.chapter}`)
      .replace('{{verse}}', verse)
      .replace('{{version}}', firstVersion);

    const rangeText = `${range.chapter}:${verse}`;
    
    return {
      url: verseRangeUri,
      displayText: `[${bookText} ${rangeText}${versionText}](${verseRangeUri})`
    };
  }
};

export const BIBLESERVER_TEMPLATE: TemplateConfig = {
  name: 'bible-server',
  tokens: ['bookchapter', 'version'],
  format: ({ parsedVerse, range, index, defaultVersion, linkTemplate, bookUri, bookText }) => {
    const bookChapter = `${bookUri}${range.chapter}`;
    const firstVersion = Array.isArray(parsedVerse.version) ? parsedVerse.version[0] : parsedVerse.version;
    const versionText = index === parsedVerse.ranges.length - 1 && firstVersion !== defaultVersion ? ` ${firstVersion}` : '';
    
    const verseRangeUri = linkTemplate
      .replace('{{bookchapter}}', bookChapter)
      .replace('{{version}}', firstVersion);

    const rangeText = `${range.chapter}:${range.fromVerse}${range.fromVerse === range.toVerse ? '' : `-${range.toVerse}`}`;
    
    return {
      url: verseRangeUri,
      displayText: `[${bookText} ${rangeText}${versionText}](${verseRangeUri})`
    };
  }
};

export const BIBLESERVER_VERSE_TEMPLATE: TemplateConfig = {
  name: 'bible-server-verse',
  tokens: ['bookchapterverse', 'version'],
  format: ({ parsedVerse, range, index, defaultVersion, linkTemplate, bookUri, bookText }) => {
    const bookChapterVerse = range.fromVerse === range.toVerse 
      ? `${bookUri}${range.chapter}%2C${range.fromVerse}`
      : `${bookUri}${range.chapter}%2C${range.fromVerse}-${range.toVerse}`;
    
    const firstVersion = Array.isArray(parsedVerse.version) ? parsedVerse.version[0] : parsedVerse.version;
    const versionText = index === parsedVerse.ranges.length - 1 && firstVersion !== defaultVersion ? ` ${firstVersion}` : '';
    
    const verseRangeUri = linkTemplate
      .replace('{{bookchapterverse}}', bookChapterVerse)
      .replace('{{version}}', firstVersion);

    const rangeText = `${range.chapter}:${range.fromVerse}${range.fromVerse === range.toVerse ? '' : `-${range.toVerse}`}`;
    
    return {
      url: verseRangeUri,
      displayText: `[${bookText} ${rangeText}${versionText}](${verseRangeUri})`
    };
  }
};

export const TEMPLATES: TemplateConfig[] = [
  DEFAULT_TEMPLATE,
  OLIVE_TREE_TEMPLATE,
  BIBLESERVER_TEMPLATE,
  BIBLESERVER_VERSE_TEMPLATE
];

export function detectTemplate(linkTemplate: string): TemplateConfig {
  return TEMPLATES.find(template => 
    template.tokens.every(token => linkTemplate.includes(`{{${token}}}`))
  ) || DEFAULT_TEMPLATE;
}
