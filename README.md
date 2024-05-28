# 📖 Link to Verse Plugin for Obsidian

[![Release](https://img.shields.io/github/release/aygjiay/obsidian-link-to-verse.svg)](https://github.com/aygjiay/obsidian-link-to-verse/releases)
[![Issues](https://img.shields.io/github/issues/aygjiay/obsidian-link-to-verse.svg)](https://github.com/aygjiay/obsidian-link-to-verse/issues)
[![License](https://img.shields.io/github/license/aygjiay/obsidian-link-to-verse.svg)](https://github.com/aygjiay/obsidian-link-to-verse/blob/main/LICENSE)

Easily create links to Bible passages in your Obsidian notes using any online Bible tool references.

![Demo](demo.gif)

## ✨ Features

- 🔗 **Quick Links**: Instantly generate links to Bible passages.
- 📖 **Easy Reference**: Input Bible references in a natural format (e.g., John 3:16).

## 🛠 Installation

### From Obsidian Plugin Marketplace

1. Open Obsidian.
2. Navigate to `Settings` > `Community plugins`.
3. Click on `Browse` and search for `Link to Verse`.
4. Click `Install` and then `Enable`.

### Manual Installation

1. Download the latest release from the [Releases](https://github.com/aygjiay/obsidian-link-to-verse/releases) page.
2. Extract the contents of the zip file to your Obsidian plugins folder: `<vault>/.obsidian/plugins/obsidian-link-to-verse`.
3. Enable the plugin in Obsidian via `Settings` > `Community plugins`.

## 🚀 Usage

1. Open any note in Obsidian.
2. Press `Ctrl+P` (or `Cmd+P` on Mac) to open the command palette.
3. Type `Create link to bible` and select the command.
4. Enter a Bible reference (e.g., `John 3:16`) when prompted.
5. A link to the passage will be inserted into your note.

## ⚙️ Configuration

You can configure the plugin settings to fit your preferences:

### Default Version

Specify your preferred default Bible version.

- **Example**: `NLT` (New Living Translation)

### Link Template

Define the template for the URL linking to the Bible passage. The template should include a `{{verse}}` placeholder and optionally a `{{version}}` placeholder.

- **Example**: `https://www.biblegateway.com/passage/?search={{verse}}&version={{version}}`

### Setting Configuration

1. Go to `Settings` > `Community plugins` > `Link to Verse` > `Options`.
2. Enter your preferred default Bible version (e.g., `NLT`).
3. Set the link template to your desired format (e.g., `https://www.biblegateway.com/passage/?search={{verse}}&version={{version}}`).

## 📚 Example

Input: `John 3:16`

With the `NLT` version and the link template `https://www.biblegateway.com/passage/?search={{verse}}&version={{version}}`:

Output: `[John 3:16](https://www.biblegateway.com/passage/?search=John+3:16&version=NLT)`

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/aygjiay/obsidian-link-to-verse/issues) if you want to contribute.

## 🙏 Acknowledgements

- [Obsidian](https://obsidian.md) for the awesome markdown-based knowledge management tool.
- [BibleGateway](https://www.biblegateway.com) for providing such great and free online Bible tool.

## 📬 Contact

Feel free to reach out if you have any questions or suggestions:

- **Email**: aygjiay@gmail.com

---

> "Your word is a lamp to my feet and a light to my path." - Psalm 119:105
