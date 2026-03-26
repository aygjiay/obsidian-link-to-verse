const { parseBibleReference } = require('@j316/bible-ref-parser');

// Test deutsche Bibelreferenz
console.log('=== DEUTSCER TEST ===');
const germanVerse = parseBibleReference('de', 'Sacharja 1:1', 'SLT', false);
console.log('German parsed:', germanVerse);

// Test Bibleserver Template (manuelle Implementierung)
const bibleserverTemplate = 'https://www.bibleserver.com/{{version}}/{{bookchapter}}';

// Simulieren der BIBLESERVER_TEMPLATE Logik
const spaceChar = '+';
const bookUri = germanVerse.bookName.replace(/\s+/g, spaceChar);
const bookChapter = `${bookUri}${germanVerse.ranges[0].chapter}`;
const firstVersion = Array.isArray(germanVerse.version) ? germanVerse.version[0] : germanVerse.version;

const verseRangeUri = bibleserverTemplate
  .replace('{{bookchapter}}', bookChapter)
  .replace('{{version}}', firstVersion);

const rangeText = `${germanVerse.ranges[0].chapter}:${germanVerse.ranges[0].fromVerse}${germanVerse.ranges[0].fromVerse === germanVerse.ranges[0].toVerse ? '' : `-${germanVerse.ranges[0].toVerse}`}`;
const displayText = `[${germanVerse.bookName} ${rangeText}](${verseRangeUri})`;

console.log('Generated URL:', verseRangeUri);
console.log('Display text:', displayText);

// Test englische Referenz
console.log('\n=== ENGLISCHER TEST ===');
const englishVerse = parseBibleReference('en', 'Zechariah 1:1', 'NIV', false);
console.log('English parsed:', englishVerse);

const englishBookUri = englishVerse.bookName.replace(/\s+/g, spaceChar);
const englishBookChapter = `${englishBookUri}${englishVerse.ranges[0].chapter}`;

const englishVerseRangeUri = bibleserverTemplate
  .replace('{{bookchapter}}', englishBookChapter)
  .replace('{{version}}', 'NIV');

const englishRangeText = `${englishVerse.ranges[0].chapter}:${englishVerse.ranges[0].fromVerse}${englishVerse.ranges[0].fromVerse === englishVerse.ranges[0].toVerse ? '' : `-${englishVerse.ranges[0].toVerse}`}`;
const englishDisplayText = `[${englishVerse.bookName} ${englishRangeText}](${englishVerseRangeUri})`;

console.log('English URL:', englishVerseRangeUri);
console.log('English Display:', englishDisplayText);

// Test verschiedene deutsche Formate
console.log('\n=== DEUTSCHE FORMATE TEST ===');
const testFormats = [
  '1. Mose 1:1',
  'Genesis 1:1', 
  'Gen 1:1',
  '1Mo 1:1',
  'Matthäus 5:3',
  'Mat 5:3',
  'Johannes 3:16',
  'Joh 3:16',
  'Offenbarung 1:1',
  'Off 1:1'
];

testFormats.forEach(format => {
  const parsed = parseBibleReference('de', format, '', false);
  console.log(`${format} -> ${parsed.book} ${parsed.ranges[0].chapter}:${parsed.ranges[0].fromVerse}`);
});
