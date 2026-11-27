const presentations = {
  'DJ Set': { category: 'DJ Set', cta: 'Sobre o DJ Set' },
  Show: { category: 'Show', cta: 'Sobre o show' },
  'Piano Bar': { category: 'Piano Bar', cta: 'Sobre o Piano Bar' },
} as const;

export type PresentationType = keyof typeof presentations;

export function isPresentationType(value: unknown): value is PresentationType {
  return typeof value === 'string' && Object.hasOwn(presentations, value);
}

const categories = new Map<string, PresentationType>([
  ['dj', 'DJ Set'], ['dj set', 'DJ Set'], ['show', 'Show'],
  ['jazz', 'Show'], ['bossa nova', 'Show'], ['música instrumental', 'Show'],
  ['piano bar', 'Piano Bar'],
]);

function inferType(text: string): PresentationType | undefined {
  if (/\bpiano\s+bar\b/i.test(text)) return 'Piano Bar';
  if (/\b(?:djs?|discotec(?:a|agem)|deejay)\b/i.test(text)) return 'DJ Set';
  if (/\b(?:show|jazz|bossa nova|big band|música instrumental)\b/i.test(text)) return 'Show';
}

export function presentationCopy(eventType?: PresentationType, category?: string, ...evidence: string[]) {
  if (isPresentationType(eventType)) return presentations[eventType];

  const explicit = category?.trim();
  if (explicit) {
    const type = categories.get(explicit.toLowerCase());
    return type ? presentations[type] : { category: explicit, cta: 'Sobre o evento' };
  }

  if (/^lançamento/i.test(evidence[0] ?? '')) return { category: 'Livro', cta: 'Sobre o evento' };
  for (const text of evidence) {
    const type = inferType(text);
    if (type) return presentations[type];
  }
  return { category: 'Música', cta: 'Sobre o evento' };
}
