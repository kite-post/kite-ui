import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'neutral'
  confirmText?: string
}

interface ConfirmState {
  open: boolean
  options: ConfirmOptions | null
  resolve: ((ok: boolean) => void) | null
  hosts: number
}

/** Спільний стан для useConfirm і KConfirmHost (рендерить KConfigProvider). */
export const confirmState = reactive<ConfirmState>({
  open: false,
  options: null,
  resolve: null,
  hosts: 0,
})

/**
 * Підтвердження з коду: `if (await confirm({ title, confirmLabel })) …`.
 * Потрібен KConfigProvider у корені застосунку.
 */
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  return (options) => {
    if (confirmState.hosts === 0) {
      console.warn('[kite-ui] useConfirm потребує KConfigProvider у корені застосунку')
      return Promise.resolve(false)
    }
    // Попереднє питання без відповіді вважаємо скасованим.
    confirmState.resolve?.(false)
    return new Promise<boolean>((resolve) => {
      confirmState.options = options
      confirmState.resolve = resolve
      confirmState.open = true
    })
  }
}

export function settleConfirm(ok: boolean) {
  const resolve = confirmState.resolve
  confirmState.resolve = null
  confirmState.open = false
  resolve?.(ok)
}
