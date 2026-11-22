import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface CheckboxGroupContext {
  isChecked: (value: string) => boolean
  toggle: (value: string, checked: boolean) => void
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  size: ComputedRef<'sm' | 'md'>
  name: ComputedRef<string | undefined>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('kite-checkbox-group')

export const useCheckboxGroup = () => inject(checkboxGroupKey, null)

/** Спільні класи квадрата/кола контролу вибору (стайлгайд 10). */
export const choiceBoxClasses = (size: 'sm' | 'md') =>
  [
    'k:relative k:grid k:shrink-0 k:place-items-center k:border-[1.5px] k:border-line-input k:bg-surface k:text-fg-inverse',
    'k:transition-colors k:duration-150 k:outline-none',
    'k:group-hover/choice:border-line-input-hover',
    'k:focus-visible:outline-2 k:focus-visible:outline-offset-2 k:focus-visible:outline-focus-ring',
    'k:data-[state=checked]:border-fg k:data-[state=checked]:bg-fg',
    'k:data-[state=indeterminate]:border-fg k:data-[state=indeterminate]:bg-fg',
    'k:data-disabled:cursor-not-allowed k:data-disabled:border-line k:data-disabled:bg-bg-subtle',
    'k:data-disabled:data-[state=checked]:border-fg-disabled k:data-disabled:data-[state=checked]:bg-fg-disabled',
    // Ціль натискання ≥ 40 px: невидима зона довкола контролу.
    "k:after:absolute k:after:-inset-2.5 k:after:content-['']",
    size === 'sm' ? 'k:mt-0.5 k:size-4' : 'k:mt-0.5 k:size-5',
  ].join(' ')
