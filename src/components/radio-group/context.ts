import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface RadioGroupContext {
  variant: ComputedRef<'default' | 'card'>
  size: ComputedRef<'sm' | 'md'>
  invalid: ComputedRef<boolean>
  modelValue: ComputedRef<string | null>
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('kite-radio-group')

export function useRadioGroup(): RadioGroupContext {
  const ctx = inject(radioGroupKey, null)
  if (!ctx) throw new Error('KRadio має бути всередині KRadioGroup')
  return ctx
}
