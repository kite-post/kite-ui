import type { Component } from 'vue'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: Component
  shortcut?: string[]
  keywords?: string[]
  /** Повертає { next } — вкладена команда: поле шукає вже параметр. Інше значення ігнорується. */
  onSelect: () => unknown
}

export interface CommandSource {
  id: string
  /** Назва групи. */
  label: string
  search: (query: string, signal: AbortSignal) => Promise<CommandItem[]> | CommandItem[]
  minQueryLength?: number
}
