import { cva, type VariantProps } from 'class-variance-authority'

// Ховер і натискання не діють на вимкнену кнопку: not-data-disabled.
// Коралова світлішає на ховер, бо на ній темний текст (стайлгайд 3.2).
export const buttonVariants = cva(
  [
    'kite-button k:relative k:inline-flex k:items-center k:justify-center k:whitespace-nowrap',
    'k:cursor-pointer k:rounded-full k:border k:font-sans k:no-underline k:select-none',
    'k:transition-[background-color,border-color,color,transform] k:duration-100 k:ease-out',
    'k:not-data-disabled:active:scale-[0.98] k:motion-reduce:not-data-disabled:active:scale-100',
    // Рамка у вимкненому стані тримає форму кнопки в темній темі, де bg-subtle = поверхня.
    'k:data-disabled:cursor-not-allowed k:data-disabled:border-line',
    'k:data-disabled:bg-bg-subtle k:data-disabled:text-fg-disabled',
  ],
  {
    variants: {
      variant: {
        primary: [
          'k:border-transparent k:bg-primary k:text-on-primary',
          'k:not-data-disabled:hover:bg-primary-hover k:not-data-disabled:active:bg-primary-active',
        ],
        secondary: [
          'k:border-line-strong k:bg-surface k:text-fg',
          'k:not-data-disabled:hover:bg-surface-hover k:not-data-disabled:active:bg-surface-active',
        ],
        ghost: [
          'k:border-transparent k:bg-transparent k:text-fg',
          'k:data-disabled:border-transparent k:data-disabled:bg-transparent',
          'k:not-data-disabled:hover:bg-surface-hover k:not-data-disabled:active:bg-surface-active',
        ],
        danger: [
          'k:border-transparent k:bg-danger-solid k:text-danger-on-solid',
          'k:not-data-disabled:hover:bg-danger-hover k:not-data-disabled:active:bg-danger-active',
        ],
        link: [
          'k:h-auto! k:border-0 k:bg-transparent k:px-0! k:text-fg-link',
          'k:underline k:decoration-1 k:underline-offset-[0.2em]',
          'k:data-disabled:border-transparent k:data-disabled:bg-transparent',
          'k:not-data-disabled:hover:text-fg-link-hover k:not-data-disabled:active:scale-100',
        ],
      },
      size: {
        sm: [
          'k:h-8 k:gap-1.5 k:px-3 k:text-label k:font-semibold',
          // Ціль натискання ≥ 40 px (стайлгайд 5.2): невидима зона над і під кнопкою.
          "k:before:absolute k:before:inset-x-0 k:before:-inset-y-1 k:before:content-['']",
        ],
        md: 'k:h-10 k:gap-2 k:px-4 k:text-body-strong',
        lg: 'k:h-12 k:gap-2 k:px-6 k:text-body-strong',
      },
      block: { true: 'k:w-full', false: '' },
    },
    defaultVariants: { variant: 'secondary', size: 'md', block: false },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>
export type ButtonSize = NonNullable<ButtonVariantProps['size']>

/** Квадратні розміри для KIconButton. */
export const iconButtonSize: Record<ButtonSize, string> = {
  sm: 'k:w-8 k:px-0',
  md: 'k:w-10 k:px-0',
  lg: 'k:w-12 k:px-0',
}
