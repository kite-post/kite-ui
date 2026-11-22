import { describe, expect, it } from 'vitest'

import { useTheme } from '../config/useTheme'
import { raw, tokens } from '../tokens'
import { cn } from './cn'
import { builtInMessages, format } from './messages'

describe('cn', () => {
  it('прибирає конфлікти з префіксом k:', () => {
    expect(cn('k:px-4 k:py-2', 'k:px-6')).toBe('k:py-2 k:px-6')
  })

  it('розмір тексту з теми не конфліктує з кольором тексту', () => {
    expect(cn('k:text-h1 k:text-fg-muted')).toBe('k:text-h1 k:text-fg-muted')
    expect(cn('k:text-fg k:text-fg-muted')).toBe('k:text-fg-muted')
  })
})

describe('messages', () => {
  it('у en є всі ключі uk', () => {
    expect(Object.keys(builtInMessages.en).sort()).toEqual(Object.keys(builtInMessages.uk).sort())
  })

  it('підставляє параметри', () => {
    expect(format('{max}+', { max: 99 })).toBe('99+')
  })
})

describe('tokens', () => {
  it('брендові HEX закріплені на своїх кроках (1.3)', () => {
    expect(raw.palette.coral['500']).toBe('#FF5A36')
    expect(raw.palette.slate['950']).toBe('#0E1A2B')
    expect(raw.color.light.primary).toBe('#FF5A36')
    expect(raw.color.light['danger-solid']).toBe('#C01242')
  })

  it('CSS-змінні мають префікс kite', () => {
    expect(tokens.color.primary).toBe('var(--kite-color-primary)')
  })
})

describe('useTheme', () => {
  it('ставить і знімає data-theme та зберігає вибір', () => {
    const { setTheme, resolved } = useTheme()
    setTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(resolved.value).toBe('dark')
    expect(localStorage.getItem('kite-theme')).toBe('dark')
    setTheme('system')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    expect(localStorage.getItem('kite-theme')).toBeNull()
  })
})

describe('хвиля 4: утиліти', async () => {
  const { normalizeSearch, intlLocale } = await import('./intl')
  const { parseLooseDate } = await import('../components/date-picker/date')
  const { acceptLabel, matchesAccept, middleTruncate } =
    await import('../components/file-upload/utils')

  it('normalizeSearch: регістр, апострофи, латинська i', () => {
    expect(normalizeSearch('Кам’янець')).toBe(normalizeSearch("кам'янець"))
    expect(normalizeSearch('Irpin')).toBe('іrpіn')
    expect(normalizeSearch('Кам’янець').length).toBe('Кам’янець'.length)
    expect(intlLocale('uk')).toBe('uk-UA')
  })

  it('parseLooseDate: три формати і відмова від неіснуючих дат', () => {
    expect(parseLooseDate('24.11.2026')).toBe('2026-11-24')
    expect(parseLooseDate('24/11/2026')).toBe('2026-11-24')
    expect(parseLooseDate('2026-11-24')).toBe('2026-11-24')
    expect(parseLooseDate('31.02.2026')).toBeNull()
    expect(parseLooseDate('завтра')).toBeNull()
  })

  it('accept: збіг за розширенням, mime і маскою; підпис типів', () => {
    const f = (name: string, type: string) => new File([''], name, { type })
    expect(matchesAccept(f('a.CSV', ''), '.csv')).toBe(true)
    expect(matchesAccept(f('a.png', 'image/png'), 'image/*,.pdf')).toBe(true)
    expect(matchesAccept(f('a.exe', 'application/x-msdownload'), 'image/*,.pdf')).toBe(false)
    expect(acceptLabel('.csv,text/csv')).toBe('CSV')
    expect(acceptLabel('image/*,.pdf', (k) => (k === 'image' ? 'Зображення' : undefined))).toBe(
      'Зображення, PDF',
    )
    expect(middleTruncate('vidpravky-lystopad-2026-final-version.csv', 30)).toMatch(
      /^vidpravky.*…n\.csv$|…/,
    )
    expect(middleTruncate('short.csv')).toBe('short.csv')
  })
})
