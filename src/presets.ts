export const TEMPLATE_PRESETS = {
  custom: {
    label: 'Custom',
    linkTemplate: '',
  },
  bibleGateway: {
    label: 'Bible Gateway',
    linkTemplate: 'https://www.biblegateway.com/passage/?search={{verse}}&version={{version}}',
  },
  oliveTree: {
    label: 'Olive Tree',
    linkTemplate: 'olivetree://bible/{{book}}.{{chapter}}.{{verse}}',
  },
  routeBible: {
    label: 'route.bible',
    linkTemplate: 'https://route.bible/?q={{verse}}&utm_source=obsidian_link_to_verse&utm_medium=link',
  },
} as const;

export type TemplatePresetId = keyof typeof TEMPLATE_PRESETS;

export function getPresetTemplate(presetId: TemplatePresetId): string {
  return TEMPLATE_PRESETS[presetId].linkTemplate;
}

export function detectPresetFromTemplate(linkTemplate: string): TemplatePresetId {
  const normalizedTemplate = String(linkTemplate || '').trim();

  const presetId = (Object.keys(TEMPLATE_PRESETS) as TemplatePresetId[]).find((candidate) => {
    if (candidate === 'custom') {
      return false;
    }

    return TEMPLATE_PRESETS[candidate].linkTemplate === normalizedTemplate;
  });

  return presetId || 'custom';
}
