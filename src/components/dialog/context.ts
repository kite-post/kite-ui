import { inject, provide, type InjectionKey } from 'vue'

/** Де лежать тіло й футер: діалог (без ліній) чи панель (лінії між частинами). */
export type OverlayKind = 'dialog' | 'sheet'

const overlayKey: InjectionKey<OverlayKind> = Symbol('kite-overlay')

export const provideOverlayKind = (kind: OverlayKind) => provide(overlayKey, kind)
export const useOverlayKind = (): OverlayKind => inject(overlayKey, 'dialog')

/** Подія закриття, яку можна скасувати (незбережені зміни → підтвердження). */
export interface CloseRequest {
  readonly defaultPrevented: boolean
  preventDefault(): void
}

export function createCloseRequest(): CloseRequest {
  let prevented = false
  return {
    get defaultPrevented() {
      return prevented
    },
    preventDefault() {
      prevented = true
    },
  }
}
