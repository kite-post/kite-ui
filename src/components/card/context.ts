import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export interface CardContext {
  padding: ComputedRef<'sm' | 'md'>
  divided: ComputedRef<boolean>
}

export const cardKey: InjectionKey<CardContext> = Symbol('kite-card')

export function useCard(): CardContext {
  return inject(cardKey, {
    padding: computed(() => 'md' as const),
    divided: computed(() => false),
  })
}

/** Відступи частин картки: md — 24/16, sm — 16/12 (стайлгайд 5.1). */
export const cardPadding = {
  md: {
    x: 'k:px-6',
    top: 'k:pt-6',
    headerBottom: 'k:pb-4 k:last:pb-6',
    contentFirst: 'k:first:pt-6',
    contentGap: 'k:pt-4',
    contentBottom: 'k:last:pb-6',
    contentBottomDivided: 'k:pb-4 k:last:pb-6',
    footerY: 'k:py-4',
  },
  sm: {
    x: 'k:px-4',
    top: 'k:pt-4',
    headerBottom: 'k:pb-3 k:last:pb-4',
    contentFirst: 'k:first:pt-4',
    contentGap: 'k:pt-3',
    contentBottom: 'k:last:pb-4',
    contentBottomDivided: 'k:pb-3 k:last:pb-4',
    footerY: 'k:py-3',
  },
} as const
