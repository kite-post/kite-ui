import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// jsdom не має ResizeObserver, а Reka міряє ним поповери й тултіпи.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

// Reka Select користується pointer capture і прокручує активний пункт.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}

// Кожен тест прибирає за собою змонтовані компоненти й порталі.
enableAutoUnmount(afterEach)
