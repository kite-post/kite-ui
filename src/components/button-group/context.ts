import { inject, type ComputedRef, type InjectionKey } from 'vue'

import type { ButtonSize, ButtonVariant } from '../button/variants'

/** KButtonGroup передає дітям variant і size; власні пропси кнопки мають пріоритет. */
export interface ButtonGroupContext {
  variant: ComputedRef<ButtonVariant>
  size: ComputedRef<ButtonSize>
}

export const buttonGroupKey: InjectionKey<ButtonGroupContext> = Symbol('kite-button-group')

export function useButtonGroup(): ButtonGroupContext | null {
  return inject(buttonGroupKey, null)
}
