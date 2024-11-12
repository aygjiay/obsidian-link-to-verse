import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { parseBibleReference } from '@aygjiay/bible-ref-parser';
import { BibleRange } from '@aygjiay/bible-ref-parser/types/parseBibleReference';

interface LinkToVersePluginSettings {
  encodeSpacesToPlus: boolean;
  bibleLanguage: 'en' | 'sp';
  defaultVersion: string;
  linkTemplate: string;
}

const DEFAULT_SETTINGS: LinkToVersePluginSettings = {
  encodeSpacesToPlus: true,
  bibleLanguage: 'en',
  defaultVersion: '',
  linkTemplate: ''
}

const verseParse = /^((\d+)\s+)?(\w+)\s?((\d+([:\.]\d+)?(-\d+([:\.]\d+)?)?(,\s*)?)+)\s*(\w+)?/i;
const verseRange = /\d+([:\.]\d+)?(-\d+([:\.]\d+)?)?/ig;

const DEFAULT_TEMPLATE = 'default';
const OLIVE_TREE_TEMPLATE = 'OliveTree';

const verseToLink = (selection: string, defaultVersion: string): { book: string, ranges: string[], version: string } => {
  const parsedVerse = verseParse.exec(selection);

  if (!parsedVerse || !parsedVerse.length) {
    return { book: '', ranges: [], version: defaultVersion };
  }

  const book = (parsedVerse[2] ? `${parsedVerse[2]} ` : '') + parsedVerse[3];
  const rawRanges = parsedVerse[4];
  const version = parsedVerse[10] || defaultVersion;

  const ranges = rawRanges.match(verseRange)?.map(range => `${range}`) || [];

  return {
    book,
    ranges,
    version
  };
}

const formatVerseRange = (parsedVerse: { book: string, bookName: string, ranges: BibleRange[], version: string | string[] }, range: BibleRange, ix: number, defaultVersion: string, linkTemplate: string, encodeSpacesToPlus: boolean) => {
  const bookText = ix === 0 ? parsedVerse.bookName + ' ' : '';
  const spaceChar = encodeSpacesToPlus ? '+' : encodeURIComponent(' ');
  const bookUri = `${parsedVerse.bookName}`.replace(' ', spaceChar);

  let templateType = DEFAULT_TEMPLATE;

  if (
    linkTemplate.contains('book') &&
    linkTemplate.contains('chapter') &&
    linkTemplate.contains('verse')
  ) {
    templateType = OLIVE_TREE_TEMPLATE;
  }

  let versionText = '';
  const firstVersion = Array.isArray(parsedVerse.version) ? parsedVerse.version[0] : parsedVerse.version;

  if (ix === parsedVerse.ranges.length - 1) {
    versionText = firstVersion !== defaultVersion ? ` ${firstVersion}` : '';
  }

  let verseRangeUri = '';
  let rangeText = '';

  switch (templateType) {
    case DEFAULT_TEMPLATE:
      const from = `${range.fromVerse}`;
      const to = `${range.fromVerse === range.toVerse}` ? '' : `-${range.toVerse}`;

      verseRangeUri = linkTemplate
        .replace('{{verse}}', `${bookUri}${spaceChar}${range.chapter}.${from}${to}`)
        .replace('{{version}}', firstVersion);

      rangeText = `${range.chapter}:${from}${to}`;
      break;
    case OLIVE_TREE_TEMPLATE:
      const verse = `${range.fromVerse}`;

      verseRangeUri = linkTemplate
        .replace('{{book}}', `${bookUri}`)
        .replace('{{chapter}}', `${range.chapter}`)
        .replace('{{verse}}', `${verse}`)
        .replace('{{version}}', firstVersion);

      rangeText = `${range.chapter}:${verse}`;
      break;
  }

  return `[${bookText} ${rangeText}${versionText}](${verseRangeUri})`;
}


export default class LinkToVersePlugin extends Plugin {
  settings: LinkToVersePluginSettings;

  async onload() {
    await this.loadSettings();

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: 'create-link-to-bible',
      name: 'Create link to Bible',
      editorCallback: (editor: Editor, _view: MarkdownView) => {
        const selection = editor.getSelection();
        const parsedVerse = parseBibleReference(this.settings.bibleLanguage, selection, this.settings.defaultVersion);
        const linkToVerse = parsedVerse.ranges
          .map((range, ix) => formatVerseRange(
            parsedVerse,
            range,
            ix,
            this.settings.defaultVersion,
            this.settings.linkTemplate,
            this.settings.encodeSpacesToPlus,
          ))
          .join(', ');

        editor.replaceSelection(linkToVerse);
      }
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new LinkToVerseSettingTab(this.app, this));
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class LinkToVerseSettingTab extends PluginSettingTab {
  plugin: LinkToVersePlugin;

  constructor(app: App, plugin: LinkToVersePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Bible language')
      .setDesc('Language for the Bible books names (sp|en)')
      .addText(text => text
        .setPlaceholder('Enter your Bible language')
        .setValue(this.plugin.settings.bibleLanguage)
        .onChange(async (value) => {
          this.plugin.settings.bibleLanguage = value === 'sp' ? 'sp' : 'en';
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Default version')
      .setDesc('Which bible version to use when non is given')
      .addText(text => text
        .setPlaceholder('Enter your default version')
        .setValue(this.plugin.settings.defaultVersion)
        .onChange(async (value) => {
          this.plugin.settings.defaultVersion = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(`Encode spaces to '+'`)
      .setDesc(`Use as separator a '+' between book name and chapter. Also if book name contains an space is replace by a '+'`)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.encodeSpacesToPlus)
        .onChange(async (value) => {
          this.plugin.settings.encodeSpacesToPlus = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('Link template')
      .setDesc('A template for the URL to a site see README for more details about supported tokens')
      .addText(text => text
        .setPlaceholder('Enter your URL template')
        .setValue(this.plugin.settings.linkTemplate)
        .onChange(async (value) => {
          this.plugin.settings.linkTemplate = value;
          await this.plugin.saveSettings();
        }));
  }
}
