import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// jsdom не має ResizeObserver, а Reka міряє ним поповери й тултіпи.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

// Кожен тест прибирає за собою змонтовані компоненти й порталі.
enableAutoUnmount(afterEach)
