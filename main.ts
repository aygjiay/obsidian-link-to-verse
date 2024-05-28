import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface LinkToVersePluginSettings {
	defaultVersion: string;
	linkTemplate: string;
}

const DEFAULT_SETTINGS: LinkToVersePluginSettings = {
	defaultVersion: 'default',
	linkTemplate: ''
}

const verseParse = /^((\d+)\s+)?(\w+)\s?((\d+([:\.]\d+)?(-\d+([:\.]\d+)?)?(,\s*)?)+)\s*(\w+)?/i;
const verseRange = /\d+([:\.]\d+)?(-\d+([:\.]\d+)?)?/ig;

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

const formatVerseRange = (parsedVerse: { book: string, ranges: string[], version: string }, range: string, ix: number, defaultVersion: string, linkTemplate: string) => {
	const bookText = ix === 0 ? parsedVerse.book + ' ' : '';
	const bookUri = `${parsedVerse.book}+`.replace(' ', '+');
	const rangeUri = range.replace(':', '.');

	let versionText = '';
	if (ix === parsedVerse.ranges.length - 1) {
		versionText = (parsedVerse.version !== defaultVersion ? ` ${parsedVerse.version}` : '')
	}

	const verseRangeUri = linkTemplate
		.replace('{{verse}}', `${bookUri}${rangeUri}`)
		.replace('{{version}}', parsedVerse.version);

	return `[${bookText}${range}${versionText}](${verseRangeUri})`;
}


export default class LinkToVersePlugin extends Plugin {
	settings: LinkToVersePluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'create-link-to-bible',
			name: 'Create link to bible',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const selection = editor.getSelection();
				const parsedVerse = verseToLink(selection, this.settings.defaultVersion);
				const linkToVerse = parsedVerse.ranges.map((range, ix) => formatVerseRange(
					parsedVerse,
					range,
					ix,
					this.settings.defaultVersion,
					this.settings.linkTemplate)).join(', ');

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
			.setName('Link template')
			.setDesc('A template for the URL to a site should have a {{verse}} placeholder and optional a {{version}} placeholder')
			.addText(text => text
				.setPlaceholder('Enter your URL template')
				.setValue(this.plugin.settings.linkTemplate)
				.onChange(async (value) => {
					this.plugin.settings.linkTemplate = value;
					await this.plugin.saveSettings();
				}));
	}
}
