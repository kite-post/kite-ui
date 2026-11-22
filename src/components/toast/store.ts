import { reactive } from 'vue'

export type ToastTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  action?: { label: string; onClick: () => void }
  /** мс; Infinity — не зникає сам. Типово 5 с, з дією — 8 с, danger — Infinity. */
  duration?: number
  /** Той самий id оновлює наявний тост замість нового. */
  id?: string
}

export interface ToastItem extends Required<Pick<ToastOptions, 'title' | 'tone' | 'duration'>> {
  id: string
  description?: string
  action?: ToastOptions['action']
  createdAt: number
}

/** Видимих одночасно — не більше трьох, решта чекає в черзі (специфікація toast.md). */
export const MAX_VISIBLE = 3

export const toastState = reactive<{ items: ToastItem[]; hosts: number }>({ items: [], hosts: 0 })

let seq = 0

function defaultDuration(o: ToastOptions): number {
  if (o.duration !== undefined) return o.duration
  if (o.tone === 'danger') return Number.POSITIVE_INFINITY
  return o.action ? 8000 : 5000
}

function push(options: ToastOptions): string {
  const id = options.id ?? `kite-toast-${++seq}`
  const item: ToastItem = {
    id,
    title: options.title,
    tone: options.tone ?? 'neutral',
    duration: defaultDuration(options),
    createdAt: Date.now(),
    ...(options.description !== undefined ? { description: options.description } : {}),
    ...(options.action ? { action: options.action } : {}),
  }
  const existing = toastState.items.findIndex((t) => t.id === id)
  if (existing >= 0) toastState.items.splice(existing, 1, item)
  else toastState.items.push(item)
  return id
}

export function dismissToast(id: string) {
  const i = toastState.items.findIndex((t) => t.id === id)
  if (i >= 0) toastState.items.splice(i, 1)
}

type Shortcut = (title: string, options?: Omit<ToastOptions, 'title' | 'tone'>) => string

export interface ToastApi {
  (options: ToastOptions): string
  success: Shortcut
  info: Shortcut
  warning: Shortcut
  danger: Shortcut
  dismiss: (id: string) => void
}

/** Тости з коду: toast.success('Адресу збережено'). Регіон рендерить KConfigProvider. */
export function useToast(): ToastApi {
  const api = ((options: ToastOptions) => {
    if (toastState.hosts === 0)
      console.warn('[kite-ui] useToast потребує KConfigProvider у корені застосунку')
    return push(options)
  }) as ToastApi
  const make =
    (tone: ToastTone): Shortcut =>
    (title, options) =>
      api({ ...options, title, tone })
  api.success = make('success')
  api.info = make('info')
  api.warning = make('warning')
  api.danger = make('danger')
  api.dismiss = dismissToast
  return api
}
