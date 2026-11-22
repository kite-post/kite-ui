// Форматери Kite (config-provider.md, «Форматери»; стайлгайд, розділ 14).
// Чисті функції з локаллю останнім аргументом; у компонентах — useFormat() з локаллю провайдера.
import { builtInMessages, format, type Locale, type MessageKey } from './messages'
import { intlLocale } from './intl'

const tr = (locale: Locale, key: MessageKey, params?: Record<string, string | number>) =>
  format(builtInMessages[locale][key], params)

const NBSP = ' '

/** Копійки → «1 250 ₴», «87,50 ₴», «−87,50 ₴». Копійки показуються, лише якщо вони є. */
export function formatMoney(kop: number, locale: Locale = 'uk'): string {
  const value = kop / 100
  const whole = Number.isInteger(value)
  const text = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${value < 0 ? '−' : ''}${text}${NBSP}₴`
}

export type Unit = 'kg' | 'g' | 'cm' | 'pcs'

/** 2.4, { unit: 'kg', precision: 1 } → «2,4 кг». */
export function formatNumber(
  n: number,
  options: { unit?: Unit; precision?: number } = {},
  locale: Locale = 'uk',
): string {
  const text = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: options.precision ?? 0,
    maximumFractionDigits: options.precision ?? 2,
  }).format(n)
  return options.unit ? `${text}${NBSP}${tr(locale, `unit.${options.unit}`)}` : text
}

/** 40, 30, 20 → «40 × 30 × 20 см». */
export function formatDimensions(l: number, w: number, h: number, locale: Locale = 'uk'): string {
  const nf = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 })
  return `${[l, w, h].map((v) => nf.format(v)).join(`${NBSP}×${NBSP}`)}${NBSP}${tr(locale, 'unit.cm')}`
}

function toDate(iso: string | Date): Date {
  if (iso instanceof Date) return iso
  // 'YYYY-MM-DD' — календарна дата, без зсуву часового поясу.
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso)
}

/**
 * «24 листопада» (поточний рік), «24 листопада 2025»; short — «24.11.2026».
 */
export function formatDate(
  iso: string | Date,
  style: 'long' | 'short' = 'long',
  locale: Locale = 'uk',
  now: Date = new Date(),
): string {
  const d = toDate(iso)
  const lang = intlLocale(locale)
  if (style === 'short')
    return new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: 'numeric' })
      .format(d)
      .replace(/\//g, '.')
  const parts = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long' }).formatToParts(d)
  const day = parts.find((p) => p.type === 'day')?.value ?? ''
  const month = parts.find((p) => p.type === 'month')?.value ?? ''
  const base = `${day} ${month}`
  return d.getFullYear() === now.getFullYear() ? base : `${base} ${d.getFullYear()}`
}

/** → «14:05». */
export function formatTime(iso: string | Date, locale: Locale = 'uk'): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(toDate(iso))
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Різниця в календарних днях: 0 — сьогодні, 1 — вчора. */
export function daysAgo(iso: string | Date, now: Date = new Date()): number {
  const ms = startOfDay(now).getTime() - startOfDay(toDate(iso)).getTime()
  return Math.round(ms / 86_400_000)
}

/** «щойно», «5 хв тому», «сьогодні о 14:05», «вчора о 14:05», далі — дата. */
export function formatRelative(
  iso: string | Date,
  locale: Locale = 'uk',
  now: Date = new Date(),
): string {
  const d = toDate(iso)
  const minutes = Math.floor((now.getTime() - d.getTime()) / 60_000)
  if (minutes >= 0 && minutes < 1) return tr(locale, 'time.justNow')
  if (minutes >= 1 && minutes < 60) return tr(locale, 'time.minutesAgo', { n: minutes })
  const days = daysAgo(d, now)
  if (days === 0) return tr(locale, 'time.todayAt', { time: formatTime(d, locale) })
  if (days === 1) return tr(locale, 'time.yesterdayAt', { time: formatTime(d, locale) })
  return formatDate(d, 'long', locale, now)
}

/** Множина: plural(3, { one: 'посилка', few: 'посилки', many: 'посилок' }) → «посилки». */
export function plural(
  n: number,
  forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other?: string },
  locale: Locale = 'uk',
): string {
  const rule = new Intl.PluralRules(intlLocale(locale)).select(n)
  return forms[rule] ?? forms.other ?? forms.many ?? forms.few ?? forms.one ?? ''
}

// ——— Телефон ———

/** Мобільні коди операторів України (оновлюється з релізом кіта). */
export const UA_MOBILE_CODES = [
  '39',
  '50',
  '63',
  '66',
  '67',
  '68',
  '73',
  '91',
  '92',
  '93',
  '94',
  '95',
  '96',
  '97',
  '98',
  '99',
] as const

/** 9 цифр національного номера з будь-якого запису: зрізає +380 / 380 / 0 на початку. */
export function phoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('380')) d = d.slice(3)
  else if (d.startsWith('0')) d = d.slice(1)
  return d.slice(0, 9)
}

/** '0671234567', '+38 (067) 123-45-67' → '+380671234567'; неповний — null. */
export function parsePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const d = phoneDigits(raw)
  return d.length === 9 ? `+380${d}` : null
}

/** '+380671234567' → '+380 67 123 45 67'. */
export function formatPhone(e164: string): string {
  const d = phoneDigits(e164)
  if (d.length !== 9) return e164
  return `+380 ${groupPhone(d)}`
}

/** 9 цифр → «67 123 45 67» (частковий ввід — частково). */
export function groupPhone(digits: string): string {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(' ')
}

export function isValidUaMobile(e164: string | null | undefined): boolean {
  if (!e164) return false
  const m = /^\+380(\d{9})$/.exec(e164)
  return !!m && (UA_MOBILE_CODES as readonly string[]).includes(m[1]!.slice(0, 2))
}

// ——— Номер відправлення S10 (UPU) ———

/** Контрольна цифра S10: ваги 8 6 4 2 3 5 9 7, mod 11; 10 → 0, 11 → 5. */
export function s10CheckDigit(serial: string): number {
  const weights = [8, 6, 4, 2, 3, 5, 9, 7]
  const sum = weights.reduce((acc, w, i) => acc + w * Number(serial[i]), 0)
  const c = 11 - (sum % 11)
  return c === 10 ? 0 : c === 11 ? 5 : c
}

/** 'KT123456785UA' — формат і контрольна цифра. */
export function isValidS10(value: string | null | undefined): boolean {
  if (!value) return false
  const m = /^[A-Z]{2}(\d{8})(\d)[A-Z]{2}$/.exec(value)
  return !!m && s10CheckDigit(m[1]!) === Number(m[2])
}

/** Витягує перший номер з тексту: «Ваша посилка kt 1234-5678-5 ua прямує…» → 'KT123456785UA'. */
export function parseTrackingNumber(raw: string | null | undefined): string | null {
  if (!raw) return null
  const m = /([A-Za-z]{2})[\s-]*((?:\d[\s-]*){9})([A-Za-z]{2})/.exec(raw)
  if (!m) return null
  return `${m[1]}${m[2]!.replace(/\D/g, '')}${m[3]}`.toUpperCase()
}

/** Групи номера: ['KT', '1234', '5678', '5', 'UA'] (частковий — частково). */
export function trackingGroups(value: string): string[] {
  const v = value.replace(/\s/g, '').toUpperCase()
  return [v.slice(0, 2), v.slice(2, 6), v.slice(6, 10), v.slice(10, 11), v.slice(11, 13)].filter(
    Boolean,
  )
}

/** 'KT123456785UA' → 'KT 1234 5678 5 UA'. */
export function formatTrackingNumber(value: string): string {
  return trackingGroups(value).join(' ')
}
