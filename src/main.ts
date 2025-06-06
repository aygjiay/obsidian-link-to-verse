import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { parseBibleReference } from '@j316/bible-ref-parser';
import type { BibleRange, ParsedBibleReference } from '@j316/bible-ref-parser/dist/api';
import type { LinkToVersePluginSettings } from './api';

const DEFAULT_SETTINGS: LinkToVersePluginSettings = {
  bibleLanguage: 'en',
  defaultVersion: '',
  encodeSpacesToPlus: true,
  linkTemplate: '',
  validateBookName: false,
}

const DEFAULT_TEMPLATE = 'default';
const OLIVE_TREE_TEMPLATE = 'OliveTree';

const formatVerseRange = (parsedVerse: ParsedBibleReference, range: BibleRange, ix: number, defaultVersion: string, linkTemplate: string, encodeSpacesToPlus: boolean) => {
  const bookText = ix === 0 ? parsedVerse.bookName + ' ' : '';
  const spaceChar = encodeSpacesToPlus ? '+' : encodeURIComponent(' ');
  const bookUri = `${parsedVerse.bookName}`.replace(/\s+/g, spaceChar);

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
      const to = `${range.fromVerse === range.toVerse ? '' : `-${range.toVerse}`}`;

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
        const parsedVerse = parseBibleReference(this.settings.bibleLanguage, selection, this.settings.defaultVersion, this.settings.validateBookName);
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
      .setDesc(`Use as separator a '+' between book name and chapter instead of URL encoding '%20'. Also if book name contains an space is replace by a '+'`)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.encodeSpacesToPlus)
        .onChange(async (value) => {
          this.plugin.settings.encodeSpacesToPlus = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(`Validate book name`)
      .setDesc(`If disabled what ever text comes before the chapter-verse section is considered a book name and is passed as it is to the url`)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.validateBookName)
        .onChange(async (value) => {
          this.plugin.settings.validateBookName = value;
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
