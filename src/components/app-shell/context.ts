import type { InjectionKey, Ref } from 'vue'

export interface AppShellContext {
  /** Назва застосунку для document.title: «{title} · {appName}». */
  appName: Ref<string | undefined>
  announce: (text: string) => void
}

export const appShellKey: InjectionKey<AppShellContext> = Symbol('kite-app-shell')
