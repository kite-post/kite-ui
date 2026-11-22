import type { Component } from 'vue'

interface BaseItem {
  label: string
  disabled?: boolean
}

/** Пункти меню для декларативного KDropdownMenu (специфікація dropdown-menu.md). */
export type MenuItem =
  | (BaseItem & {
      type?: 'item'
      icon?: Component
      shortcut?: string[]
      /** Небезпечна дія: червоний текст; ставте останньою, після роздільника. */
      danger?: boolean
      onSelect?: (event: Event) => void
      href?: string
    })
  | (BaseItem & {
      type: 'checkbox'
      checked: boolean
      onUpdate: (checked: boolean) => void
    })
  | {
      type: 'radio'
      value: string
      onUpdate: (value: string) => void
      options: { value: string; label: string; disabled?: boolean }[]
    }
  | (BaseItem & { type: 'sub'; icon?: Component; items: MenuItem[] })
  | { type: 'label'; label: string }
  | { type: 'separator' }
