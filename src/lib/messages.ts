// Службові тексти компонентів (загальні правила, розділ 9). Ключі — з розділів
// «Тексти» специфікацій. Нова хвиля компонентів додає сюди свої ключі.

export const uk = {
  'button.loading': 'Виконується…',
  'spinner.label': 'Завантаження…',
  'link.newTab': '(відкривається в новій вкладці)',
  'badge.overflow': '{max}+',
  'kbd.mod': 'Ctrl',
  'kbd.shift': 'Shift',
  'kbd.alt': 'Alt',
  'kbd.enter': 'Enter',
  'kbd.command': 'Command',
  'kbd.option': 'Option',
} as const

export type MessageKey = keyof typeof uk
export type Messages = Record<MessageKey, string>

export const en: Messages = {
  'button.loading': 'Working…',
  'spinner.label': 'Loading…',
  'link.newTab': '(opens in a new tab)',
  'badge.overflow': '{max}+',
  'kbd.mod': 'Ctrl',
  'kbd.shift': 'Shift',
  'kbd.alt': 'Alt',
  'kbd.enter': 'Enter',
  'kbd.command': 'Command',
  'kbd.option': 'Option',
}

export const builtInMessages = { uk: uk as Messages, en } as const
export type Locale = keyof typeof builtInMessages

/** Підставляє {param} у текст. */
export function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in params ? String(params[key]) : m,
  )
}
