import { computed, inject, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

/** Те, що KField передає контролу всередині (загальні правила, розділ 8). */
export interface FieldContext {
  id: ComputedRef<string>
  /** id підпису: групові контроли (KToggleGroup, KPinInput) беруть назву через aria-labelledby. */
  labelId: ComputedRef<string>
  /** id підказки/помилки/лічильника для aria-describedby. */
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  /** Текст лічильника, який контрол показує в рядку підказки KField. */
  counter: Ref<string | null>
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('kite-field')

export function useField(): FieldContext | null {
  return inject(fieldKey, null)
}

interface ControlProps {
  id?: string | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  readonly?: boolean | undefined
}

/**
 * Стан контрола з урахуванням KField: власні пропси мають пріоритет над контекстом.
 * Повертає готові атрибути для нативного елемента.
 */
export function useFieldControl(props: ControlProps, fallbackId: string) {
  const field = useField()
  const counter = field?.counter ?? ref<string | null>(null)

  const id = computed(() => props.id ?? field?.id.value ?? fallbackId)
  const invalid = computed(() => props.invalid || (field?.invalid.value ?? false))
  const required = computed(() => props.required || (field?.required.value ?? false))
  const disabled = computed(() => props.disabled || (field?.disabled.value ?? false))
  const readonly = computed(() => props.readonly || (field?.readonly.value ?? false))

  const ariaAttrs = computed(() => ({
    id: id.value,
    'aria-describedby': field?.describedBy.value,
    'aria-invalid': invalid.value ? ('true' as const) : undefined,
    'aria-required': required.value ? ('true' as const) : undefined,
  }))

  return { field, id, invalid, required, disabled, readonly, ariaAttrs, counter }
}
