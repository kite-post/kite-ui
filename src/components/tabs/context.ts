import type { ComputedRef, InjectionKey } from 'vue'

export interface TabsContext {
  variant: ComputedRef<'line' | 'pills'>
  size: ComputedRef<'sm' | 'md'>
  /** Вкладки-посилання: <nav> з aria-current замість ролей tab. */
  routing: ComputedRef<boolean>
  label: ComputedRef<string | undefined>
}

export const tabsKey: InjectionKey<TabsContext> = Symbol('kite-tabs')
