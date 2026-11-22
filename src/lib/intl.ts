import type { Locale } from './messages'

/** Локаль Intl для мови кіта: числа, дати, назви місяців. */
export function intlLocale(locale: Locale): string {
  return locale === 'en' ? 'en-GB' : 'uk-UA'
}

/**
 * Нормалізація для пошуку: регістр, апострофи (' ’ ʼ `), латинська i → українська і.
 * Довжина рядка не змінюється, тож індекси збігу підходять і для оригіналу.
 */
export function normalizeSearch(text: string): string {
  return text
    .toLocaleLowerCase('uk-UA')
    .replace(/[’ʼ`‘]/g, "'")
    .replace(/i/g, 'і')
}
