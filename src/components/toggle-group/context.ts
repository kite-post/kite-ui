import type { ComputedRef, InjectionKey } from 'vue'

export interface ToggleGroupContext {
  size: ComputedRef<'sm' | 'md' | 'lg'>
  block: ComputedRef<boolean>
  /** У single обраний фон малює спільний індикатор, що «їде» між сегментами. */
  sliding: ComputedRef<boolean>
}

export const toggleGroupKey: InjectionKey<ToggleGroupContext> = Symbol('kite-toggle-group')
