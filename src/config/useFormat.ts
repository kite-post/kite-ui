import * as f from '../lib/format'
import { useKiteConfig } from './context'

/** Форматери з локаллю KConfigProvider: const { money, date } = useFormat(). */
export function useFormat() {
  const { locale } = useKiteConfig()
  return {
    money: (kop: number) => f.formatMoney(kop, locale.value),
    number: (n: number, o?: Parameters<typeof f.formatNumber>[1]) =>
      f.formatNumber(n, o, locale.value),
    dimensions: (l: number, w: number, h: number) => f.formatDimensions(l, w, h, locale.value),
    date: (iso: string | Date, style?: 'long' | 'short') => f.formatDate(iso, style, locale.value),
    time: (iso: string | Date) => f.formatTime(iso, locale.value),
    relative: (iso: string | Date) => f.formatRelative(iso, locale.value),
    plural: (n: number, forms: Parameters<typeof f.plural>[1]) => f.plural(n, forms, locale.value),
  }
}
