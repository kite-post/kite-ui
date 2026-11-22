import type { Component } from 'vue'

export type RouteTarget = string | Record<string, unknown>

export interface SidebarLink {
  label: string
  /** Маршрут Vue Router (RouterLink, якщо роутер підключено). */
  to?: RouteTarget
  href?: string
  /** Без роутера: позначити поточний пункт. */
  active?: boolean
}

export interface SidebarItem extends SidebarLink {
  icon?: Component
  count?: number
  /** Прихований контекст лічильника: «очікують прийому» → «12 очікують прийому». */
  countLabel?: string
  children?: SidebarLink[]
  disabled?: boolean
}

export interface SidebarGroup {
  label?: string
  collapsible?: boolean
  items: SidebarItem[]
}
