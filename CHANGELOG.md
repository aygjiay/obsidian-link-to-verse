## 1.1.0

### Added
- **Settings:** Added `bibleLanguage` option to specify Bible book names in different languages (`en` or `sp`).
- **Settings:** Introduced `encodeSpacesToPlus` option, which encodes spaces in URLs as `+`, allowing more flexibility in URL formatting.
- **Parsing Library Integration:** Integrated `@aygjiay/bible-ref-parser` to handle Bible reference parsing.
- **Template Support:** Added support for two template formats, `DEFAULT_TEMPLATE` and `OLIVE_TREE_TEMPLATE`, to accommodate various URL structures.

### Changed
- **Link Generation Logic:** Updated `formatVerseRange` to use the new template system, improving the versatility of link generation.
- **UI Improvements:** Updated `LinkToVerseSettingTab` to include new setting fields for `bibleLanguage` and `encodeSpacesToPlus`.
