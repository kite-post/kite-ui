import { cn } from '../../lib/cn'

/** Панель меню: як список KSelect (стайлгайд 8, рівень 3). */
export const menuContentClass =
  'kite-menu kite-pop k:z-[1000] k:min-w-[11.25rem] k:max-w-[min(20rem,calc(100vw-2rem))] k:overflow-hidden k:rounded-md k:border k:border-raised-border k:bg-surface-raised k:p-1 k:text-fg k:shadow-lg k:outline-none'

/** Пункт меню: 40 px (md) або 32 px (sm), підсвітка клавіатурою й мишею однакова. */
export function menuItemClass(size: 'sm' | 'md'): string {
  return cn(
    'kite-menu-item k:relative k:flex k:cursor-pointer k:items-center k:gap-2.5 k:rounded-sm k:px-3 k:text-body-sm k:no-underline k:outline-none k:select-none',
    'k:text-inherit k:data-highlighted:bg-surface-hover',
    'k:data-disabled:cursor-not-allowed k:data-disabled:text-fg-disabled',
    'k:data-[state=open]:bg-surface-hover',
    size === 'sm' ? 'k:min-h-8 k:py-1.5' : 'k:min-h-10 k:py-2',
  )
}
