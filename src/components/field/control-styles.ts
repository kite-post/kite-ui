import { cn } from '../../lib/cn'

export type ControlSize = 'sm' | 'md' | 'lg'

interface ControlState {
  size?: ControlSize
  invalid?: boolean
  disabled?: boolean
  readonly?: boolean
  /** Висота за вмістом (textarea, мультивибір). */
  autoHeight?: boolean
}

// Поверхня поля: KInput, KTextarea, тригер KSelect (стайлгайд 3.2, 9, 10).
// Рамка — slate-500 (≥ 3:1), фокус — рамка + тінь 1 px, разом 2 px.
export function controlClasses({
  size = 'md',
  invalid,
  disabled,
  readonly,
  autoHeight,
}: ControlState): string {
  return cn(
    'kite-control k:flex k:w-full k:min-w-0 k:items-center k:gap-2 k:rounded-sm k:border k:bg-surface k:text-fg',
    'k:transition-[border-color,box-shadow] k:duration-100 k:ease-out',
    'k:border-line-input k:hover:border-line-input-hover',
    'k:focus-within:border-line-focus k:focus-within:shadow-[0_0_0_1px_var(--kite-color-border-focus)]',
    !autoHeight && { sm: 'k:h-8', md: 'k:h-10', lg: 'k:h-12' }[size],
    size === 'lg' ? 'k:px-4' : 'k:px-3',
    invalid &&
      'k:border-danger-text k:focus-within:border-danger-text k:focus-within:shadow-[0_0_0_1px_var(--kite-color-danger-text)] k:hover:border-danger-text',
    readonly &&
      'k:border-transparent k:bg-surface-sunken k:focus-within:border-line-focus k:hover:border-transparent',
    disabled &&
      'k:cursor-not-allowed k:border-line k:bg-bg-subtle k:text-fg-disabled k:hover:border-line',
  )
}

/** Нативне поле всередині поверхні. На мобільних не менше 16 px, інакше iOS масштабує сторінку. */
export function nativeInputClasses(size: ControlSize = 'md'): string {
  return cn(
    'k:h-full k:w-full k:min-w-0 k:flex-1 k:border-0 k:bg-transparent k:p-0 k:text-inherit',
    'k:outline-none k:placeholder:text-fg-muted k:focus-visible:outline-none',
    'k:read-only:cursor-default k:disabled:cursor-not-allowed',
    // Перебиваємо жовтий фон автозаповнення браузера.
    'k:autofill:shadow-[inset_0_0_0_1000px_var(--kite-color-surface)] k:autofill:[-webkit-text-fill-color:var(--kite-color-text)]',
    size === 'sm' ? 'k:text-body k:sm:text-body-sm' : 'k:text-body',
  )
}
