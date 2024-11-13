## 1.1.1

### Changed
- **Parsing Library Integration:** Replaced `@aygjiay/bible-ref-parser` with `@j316/bible-ref-parser` due to availability, as `@j316` is a public version of the same package, allowing broader access and use.
- **Settings:** Added a `validateBookName` option in the plugin settings to enable or disable validation of the book name before constructing the URL.
- **Link Generation Logic:** Adjusted the logic to use the `validateBookName` setting, allowing non-standard book names to be passed directly to the URL without validation when this option is disabled.
- **Template System**: Enhanced `formatVerseRange` function for improved URL formatting when handling spaces, replacing whitespace in book names with either `+` or `%20` as specified by the `encodeSpacesToPlus` setting.
  
### UI Improvements
- **Settings Panel:** Added a `validateBookName` toggle in `LinkToVerseSettingTab` for easier customization.

### Fixed
- **URL Formatting Issue:** Corrected URL encoding logic for book names, ensuring spaces are replaced as configured in the `encodeSpacesToPlus` setting.

## 1.1.0

### Added
- **Settings:** Added `bibleLanguage` option to specify Bible book names in different languages (`en` or `sp`).
- **Settings:** Introduced `encodeSpacesToPlus` option, which encodes spaces in URLs as `+`, allowing more flexibility in URL formatting.
- **Parsing Library Integration:** Integrated `@aygjiay/bible-ref-parser` to handle Bible reference parsing.
- **Template Support:** Added support for two template formats, `DEFAULT_TEMPLATE` and `OLIVE_TREE_TEMPLATE`, to accommodate various URL structures.

### Changed
- **Link Generation Logic:** Updated `formatVerseRange` to use the new template system, improving the versatility of link generation.
- **UI Improvements:** Updated `LinkToVerseSettingTab` to include new setting fields for `bibleLanguage` and `encodeSpacesToPlus`.
