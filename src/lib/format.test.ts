import { describe, expect, it } from 'vitest'

import {
  daysAgo,
  formatDate,
  formatDimensions,
  formatMoney,
  formatNumber,
  formatPhone,
  formatRelative,
  formatTime,
  formatTrackingNumber,
  isValidS10,
  isValidUaMobile,
  parsePhone,
  parseTrackingNumber,
  plural,
  s10CheckDigit,
} from './format'

// Нерозривні пробіли з Intl → звичайні, щоб приклади читалися.
const sp = (s: string) => s.replace(/[  ]/g, ' ')

describe('formatMoney', () => {
  it.each([
    [125000, '1 250 ₴'],
    [8750, '87,50 ₴'],
    [0, '0 ₴'],
    [-8750, '−87,50 ₴'],
    [5, '0,05 ₴'],
  ])('%i → %s', (kop, out) => expect(sp(formatMoney(kop))).toBe(out))
})

describe('числа, одиниці, габарити', () => {
  it('formatNumber', () => {
    expect(sp(formatNumber(2.4, { unit: 'kg', precision: 1 }))).toBe('2,4 кг')
    expect(sp(formatNumber(1240))).toBe('1 240')
    expect(sp(formatNumber(3, { unit: 'pcs' }, 'en'))).toBe('3 pcs')
  })
  it('formatDimensions', () => expect(sp(formatDimensions(40, 30, 20))).toBe('40 × 30 × 20 см'))
})

describe('дати', () => {
  const now = new Date(2026, 10, 24, 15, 0)
  it('formatDate: поточний рік без року, інший — з роком, short', () => {
    expect(formatDate('2026-11-24', 'long', 'uk', now)).toBe('24 листопада')
    expect(formatDate('2025-11-24', 'long', 'uk', now)).toBe('24 листопада 2025')
    expect(formatDate('2026-11-24', 'short')).toBe('24.11.2026')
  })
  it('formatTime', () => expect(formatTime(new Date(2026, 10, 24, 14, 5))).toBe('14:05'))
  it('formatRelative', () => {
    expect(formatRelative(new Date(2026, 10, 24, 14, 59, 40), 'uk', now)).toBe('щойно')
    expect(formatRelative(new Date(2026, 10, 24, 14, 55), 'uk', now)).toBe('5 хв тому')
    expect(formatRelative(new Date(2026, 10, 24, 9, 12), 'uk', now)).toBe('сьогодні о 09:12')
    expect(formatRelative(new Date(2026, 10, 23, 14, 5), 'uk', now)).toBe('вчора о 14:05')
    expect(formatRelative(new Date(2026, 10, 20, 14, 5), 'uk', now)).toBe('20 листопада')
  })
  it('31 грудня → 1 січня: «вчора», а не різниця в роках', () => {
    const ny = new Date(2027, 0, 1, 10, 0)
    expect(daysAgo(new Date(2026, 11, 31, 23, 0), ny)).toBe(1)
    expect(formatRelative(new Date(2026, 11, 31, 23, 0), 'uk', ny)).toBe('вчора о 23:00')
    expect(formatRelative(new Date(2026, 11, 29, 23, 0), 'uk', ny)).toBe('29 грудня 2026')
  })
})

describe('plural', () => {
  const forms = { one: 'посилка', few: 'посилки', many: 'посилок' }
  it.each([
    [1, 'посилка'],
    [2, 'посилки'],
    [5, 'посилок'],
    [11, 'посилок'],
    [21, 'посилка'],
    [22, 'посилки'],
  ])('%i → %s', (n, out) => expect(plural(n, forms)).toBe(out))
})

describe('телефон', () => {
  it.each([
    ['0671234567', '+380671234567'],
    ['+38 (067) 123-45-67', '+380671234567'],
    ['380671234567', '+380671234567'],
    ['67 123 45 67', '+380671234567'],
    ['067 123', null],
    ['', null],
  ])('parsePhone(%s) → %s', (raw, out) => expect(parsePhone(raw)).toBe(out))
  it('formatPhone і оператор', () => {
    expect(formatPhone('+380671234567')).toBe('+380 67 123 45 67')
    expect(isValidUaMobile('+380671234567')).toBe(true)
    expect(isValidUaMobile('+380441234567')).toBe(false)
  })
})

describe('S10', () => {
  it('контрольна цифра й правила 10 → 0, 11 → 5', () => {
    expect(s10CheckDigit('12345678')).toBe(5)
    expect(isValidS10('KT123456785UA')).toBe(true)
    expect(isValidS10('KT123456784UA')).toBe(false)
    expect(isValidS10('KT12345678UA')).toBe(false)
    // 6 × 2 = 12, 12 mod 11 = 1 → 11 − 1 = 10 → 0; сума 0 → 11 → 5.
    expect(s10CheckDigit('02000000')).toBe(0)
    expect(s10CheckDigit('00000000')).toBe(5)
  })
  it('parseTrackingNumber з тексту і formatTrackingNumber', () => {
    expect(parseTrackingNumber('Ваша посилка kt 1234-5678-5 ua прямує')).toBe('KT123456785UA')
    expect(parseTrackingNumber('нічого')).toBeNull()
    expect(formatTrackingNumber('KT123456785UA')).toBe('KT 1234 5678 5 UA')
    expect(formatTrackingNumber('KT1234')).toBe('KT 1234')
  })
})
