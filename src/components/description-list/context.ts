import type { ComputedRef, InjectionKey } from 'vue'

export interface DescriptionListContext {
  layout: ComputedRef<'stacked' | 'inline'>
  size: ComputedRef<'sm' | 'md'>
  divided: ComputedRef<boolean>
  loading: ComputedRef<boolean>
}

export const descriptionListKey: InjectionKey<DescriptionListContext> =
  Symbol('kite-description-list')
