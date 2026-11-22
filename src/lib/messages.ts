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
  'field.optional': '(необов’язково)',
  'input.clear': 'Очистити',
  'input.showPassword': 'Показати пароль',
  'input.hidePassword': 'Сховати пароль',
  'input.count': '{n} з {max}',
  'textarea.remain': 'Залишилось символів: {n}',
  'select.placeholder': 'Оберіть',
  'select.clear': 'Очистити вибір',
  'skeleton.loading': 'Завантаження…',
  'dialog.close': 'Закрити',
  'alert.cancel': 'Залишити',
  'alert.confirmPrompt': 'Введіть «{text}», щоб підтвердити',
  'alert.tone.info': 'Інформація:',
  'alert.tone.success': 'Успіх:',
  'alert.tone.warning': 'Попередження:',
  'alert.tone.danger': 'Помилка:',
  'alert.tone.neutral': 'Примітка:',
  'alert.dismiss': 'Закрити',
  'toast.region': 'Сповіщення',
  'toast.close': 'Закрити',
  'toast.undo': 'Скасувати',
  'menu.moreActions': 'Ще дії',
  'drawer.expand': 'Розгорнути',
  'drawer.collapse': 'Згорнути',
  'progress.value': '{percent} %',
  'empty.noResults.title': 'Нічого не знайшли',
  'empty.noResults.text': 'Спробуйте змінити запит або скинути фільтри',
  'empty.noResults.action': 'Скинути фільтри',
  'empty.error.title': 'Не вдалося завантажити',
  'empty.error.text': 'Перевірте з’єднання і спробуйте ще',
  'empty.error.action': 'Спробувати ще',
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
  'field.optional': '(optional)',
  'input.clear': 'Clear',
  'input.showPassword': 'Show password',
  'input.hidePassword': 'Hide password',
  'input.count': '{n} of {max}',
  'textarea.remain': '{n} characters remaining',
  'select.placeholder': 'Select',
  'select.clear': 'Clear selection',
  'skeleton.loading': 'Loading…',
  'dialog.close': 'Close',
  'alert.cancel': 'Keep',
  'alert.confirmPrompt': 'Type “{text}” to confirm',
  'alert.tone.info': 'Info:',
  'alert.tone.success': 'Success:',
  'alert.tone.warning': 'Warning:',
  'alert.tone.danger': 'Error:',
  'alert.tone.neutral': 'Note:',
  'alert.dismiss': 'Dismiss',
  'toast.region': 'Notifications',
  'toast.close': 'Close',
  'toast.undo': 'Undo',
  'menu.moreActions': 'More actions',
  'drawer.expand': 'Expand',
  'drawer.collapse': 'Collapse',
  'progress.value': '{percent}%',
  'empty.noResults.title': 'No results',
  'empty.noResults.text': 'Try a different search or reset filters',
  'empty.noResults.action': 'Reset filters',
  'empty.error.title': 'Couldn’t load',
  'empty.error.text': 'Check your connection and try again',
  'empty.error.action': 'Try again',
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
