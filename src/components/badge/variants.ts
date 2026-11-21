import { cva, type VariantProps } from 'class-variance-authority'

// Тон задає локальні змінні --kb-*, а варіант бере з них кольори.
// Так 5 тонів × 3 варіанти — це 8 рядків, а не 15 комбінацій.
export const badgeVariants = cva(
  'kite-badge k:inline-flex k:shrink-0 k:items-center k:justify-center k:rounded-full k:border k:font-sans k:whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral:
          'k:[--kb-border:var(--kite-color-neutral-border)] k:[--kb-on:var(--kite-color-neutral-on-solid)] k:[--kb-solid:var(--kite-color-neutral-solid)] k:[--kb-subtle:var(--kite-color-neutral-subtle)] k:[--kb-text:var(--kite-color-neutral-text)]',
        info: 'k:[--kb-border:var(--kite-color-info-border)] k:[--kb-on:var(--kite-color-info-on-solid)] k:[--kb-solid:var(--kite-color-info-solid)] k:[--kb-subtle:var(--kite-color-info-subtle)] k:[--kb-text:var(--kite-color-info-text)]',
        success:
          'k:[--kb-border:var(--kite-color-success-border)] k:[--kb-on:var(--kite-color-success-on-solid)] k:[--kb-solid:var(--kite-color-success-solid)] k:[--kb-subtle:var(--kite-color-success-subtle)] k:[--kb-text:var(--kite-color-success-text)]',
        warning:
          'k:[--kb-border:var(--kite-color-warning-border)] k:[--kb-on:var(--kite-color-warning-on-solid)] k:[--kb-solid:var(--kite-color-warning-solid)] k:[--kb-subtle:var(--kite-color-warning-subtle)] k:[--kb-text:var(--kite-color-warning-text)]',
        danger:
          'k:[--kb-border:var(--kite-color-danger-border)] k:[--kb-on:var(--kite-color-danger-on-solid)] k:[--kb-solid:var(--kite-color-danger-solid)] k:[--kb-subtle:var(--kite-color-danger-subtle)] k:[--kb-text:var(--kite-color-danger-text)]',
      },
      variant: {
        subtle: 'k:border-(--kb-border) k:bg-(--kb-subtle) k:text-(--kb-text)',
        solid: 'k:border-transparent k:bg-(--kb-solid) k:text-(--kb-on)',
        outline: 'k:border-(--kb-border) k:bg-transparent k:text-(--kb-text)',
      },
      size: {
        sm: 'k:h-5 k:gap-1 k:px-1.5 k:text-caption k:font-medium',
        md: 'k:h-6 k:gap-1 k:px-2 k:text-caption k:font-semibold',
        lg: 'k:h-7 k:gap-1 k:px-2.5 k:text-label k:font-semibold',
      },
      count: { true: 'kite-num k:px-1', false: '' },
    },
    compoundVariants: [
      { count: true, size: 'sm', class: 'k:min-w-5' },
      { count: true, size: 'md', class: 'k:min-w-6' },
      { count: true, size: 'lg', class: 'k:min-w-7' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'subtle', size: 'md', count: false },
  },
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
export type BadgeTone = NonNullable<BadgeVariantProps['tone']>
export type BadgeVariant = NonNullable<BadgeVariantProps['variant']>
export type BadgeSize = NonNullable<BadgeVariantProps['size']>
