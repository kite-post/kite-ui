import type { ComputedRef, InjectionKey } from 'vue'

export interface AccordionContext {
  variant: ComputedRef<'divided' | 'cards'>
  headingLevel: ComputedRef<2 | 3 | 4>
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol('kite-accordion')
