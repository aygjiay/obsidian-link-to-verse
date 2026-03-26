import type { ParsedBibleReference } from '@j316/bible-ref-parser/dist/api';

declare module '@j316/bible-ref-parser' {
  export function parseBibleReference(
    language: 'sp' | 'en' | 'de',
    bibleReferenceString: string,
    defaultVersion: string,
    validateBookName?: boolean
  ): ParsedBibleReference;
}
