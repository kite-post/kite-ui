// Курсор у полях з маскою (телефон, номер відправлення): після переформатування він
// має стояти після того самого «значущого» символу, а не стрибати в кінець.

export function countMeaningful(text: string, end: number, meaningful: RegExp): number {
  let n = 0
  for (let i = 0; i < Math.min(end, text.length); i++) if (meaningful.test(text[i]!)) n++
  return n
}

export function caretAfter(text: string, count: number, meaningful: RegExp): number {
  if (count <= 0) return 0
  let n = 0
  for (let i = 0; i < text.length; i++) {
    if (meaningful.test(text[i]!)) n++
    if (n === count) return i + 1
  }
  return text.length
}

/** Backspace одразу після пробілу-роздільника видаляє символ перед ним, а не пробіл. */
export function skipSeparatorOnBackspace(event: KeyboardEvent, separator = ' ') {
  const el = event.target as HTMLInputElement
  if (event.key !== 'Backspace' || el.selectionStart !== el.selectionEnd) return
  const pos = el.selectionStart ?? 0
  if (pos > 0 && el.value[pos - 1] === separator) el.setSelectionRange(pos - 1, pos - 1)
}
