import {
  endOfMonth,
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  today,
  type DateValue,
} from '@internationalized/date'

/** 'YYYY-MM-DD' → CalendarDate; невалідний рядок → undefined. */
export function toDate(iso: string | null | undefined): DateValue | undefined {
  if (!iso) return undefined
  try {
    return parseDate(iso)
  } catch {
    return undefined
  }
}

/** CalendarDate → 'YYYY-MM-DD'. */
export function toIso(date: DateValue | null | undefined): string | null {
  return date ? date.toString().slice(0, 10) : null
}

/** Вставка в поле: 24.11.2026, 24/11/2026, 24-11-2026, 2026-11-24. */
export function parseLooseDate(text: string): string | null {
  const s = text.trim()
  let y: number, m: number, d: number
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
  const dmy = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s)
  if (iso) [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])]
  else if (dmy) [d, m, y] = [Number(dmy[1]), Number(dmy[2]), Number(dmy[3])]
  else return null
  const candidate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const parsed = toDate(candidate)
  // parseDate приймає 31.02 як 03.03 — перевіряємо, що дата не «переїхала».
  return parsed && toIso(parsed) === candidate ? candidate : null
}

export interface IsoRange {
  start: string
  end: string
}

export function todayIso(): string {
  return toIso(today(getLocalTimeZone()))!
}

/** Типові пресети періоду (специфікація date-range-picker.md). */
export function defaultRangePresets(
  t: (
    key:
      | 'range.preset.today'
      | 'range.preset.yesterday'
      | 'range.preset.7d'
      | 'range.preset.30d'
      | 'range.preset.month'
      | 'range.preset.prevMonth',
  ) => string,
): { label: string; value: IsoRange }[] {
  const now = today(getLocalTimeZone())
  const iso = (d: DateValue) => toIso(d)!
  const prev = now.subtract({ months: 1 })
  return [
    { label: t('range.preset.today'), value: { start: iso(now), end: iso(now) } },
    {
      label: t('range.preset.yesterday'),
      value: { start: iso(now.subtract({ days: 1 })), end: iso(now.subtract({ days: 1 })) },
    },
    {
      label: t('range.preset.7d'),
      value: { start: iso(now.subtract({ days: 6 })), end: iso(now) },
    },
    {
      label: t('range.preset.30d'),
      value: { start: iso(now.subtract({ days: 29 })), end: iso(now) },
    },
    { label: t('range.preset.month'), value: { start: iso(startOfMonth(now)), end: iso(now) } },
    {
      label: t('range.preset.prevMonth'),
      value: { start: iso(startOfMonth(prev)), end: iso(endOfMonth(prev)) },
    },
  ]
}

/** «24 листопада 2026» для оголошень. */
export function formatLong(iso: string, locale: string): string {
  const d = toDate(iso)
  if (!d) return iso
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    d.toDate(getLocalTimeZone()),
  )
}
