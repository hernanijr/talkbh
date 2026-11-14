import type { Language } from './site.ts';

export function normalizeSupportedLanguage(value: string): Language | undefined {
  const normalized = value.toLowerCase();
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('pt')) return 'pt-BR';
  return undefined;
}

export function detectBrowserLanguage(languages: readonly string[]): Language | undefined {
  return languages.map(normalizeSupportedLanguage).find((language) => language !== undefined);
}

export function shouldSuggestLanguage(
  current: Language,
  browser: Language | undefined,
  savedChoice: string | null,
  dismissed: boolean,
): boolean {
  return !savedChoice && !dismissed && browser !== undefined && browser !== current;
}
