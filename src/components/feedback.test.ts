import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import KConfigProvider from '../config/KConfigProvider.vue'
import { expectNoA11yViolations } from '../test-utils/a11y'
import KAlert from './alert/KAlert.vue'
import KEmptyState from './empty-state/KEmptyState.vue'
import KProgress from './progress/KProgress.vue'
import { toastState, useToast } from './toast/store'

afterEach(() => {
  toastState.items.splice(0)
  vi.useRealTimers()
})

describe('KAlert', () => {
  it('тон текстом для скрінрідера, заголовок, дії, закриття', async () => {
    const w = mount(KAlert, {
      props: { tone: 'warning', title: 'Посилка затримується', dismissible: true },
      slots: { default: 'Нова дата — 26 листопада.', actions: '<button>Переадресувати</button>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Попередження:')
    expect(w.text()).toContain('Посилка затримується')
    expect(w.attributes('role')).toBeUndefined()
    await w.get('button[aria-label="Закрити"]').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    await expectNoA11yViolations(w.element)
  })

  it('live="assertive" — role="alert"; icon=false — без іконки', () => {
    const w = mount(KAlert, {
      props: { tone: 'danger', live: 'assertive', icon: false },
      slots: { default: 'x' },
    })
    expect(w.attributes('role')).toBe('alert')
    expect(w.find('svg').exists()).toBe(false)
  })
})

describe('KProgress', () => {
  it('progressbar з назвою і текстовим значенням', async () => {
    const w = mount(KProgress, {
      props: {
        value: 240,
        max: 1000,
        label: 'Імпорт',
        showValue: true,
        formatValue: (v: number, m: number) => `${v} з ${m}`,
      },
      attachTo: document.body,
    })
    const bar = w.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('240')
    expect(bar.attributes('aria-valuetext')).toBe('240 з 1000')
    expect(w.text()).toContain('240 з 1000')
    await expectNoA11yViolations(w.element)
  })

  it('невизначений — без aria-valuenow', () => {
    const w = mount(KProgress, { props: { value: null, label: 'Формуємо' } })
    expect(w.get('[role="progressbar"]').attributes('aria-valuenow')).toBeUndefined()
  })
})

describe('KEmptyState', () => {
  it('no-results: типові тексти і кнопка лише коли слухають reset', async () => {
    const onReset = vi.fn()
    const w = mount(KEmptyState, { props: { kind: 'no-results', onReset } })
    expect(w.text()).toContain('Нічого не знайшли')
    await w.get('button').trigger('click')
    expect(onReset).toHaveBeenCalledOnce()
    expect(
      mount(KEmptyState, { props: { kind: 'no-results' } })
        .find('button')
        .exists(),
    ).toBe(false)
  })

  it('error з retrying показує loading', () => {
    const w = mount(KEmptyState, { props: { kind: 'error', retrying: true, onRetry: () => {} } })
    expect(w.get('button').attributes('aria-busy')).toBe('true')
    expect(w.find('h3').text()).toBe('Не вдалося завантажити')
  })
})

describe('useToast і KToaster', () => {
  const mountHost = () =>
    mount(
      { components: { KConfigProvider }, template: '<KConfigProvider><div /></KConfigProvider>' },
      { attachTo: document.body },
    )

  it('показує тост з роллю status, дію і закриття', async () => {
    mountHost()
    const toast = useToast()
    const undo = vi.fn()
    toast({
      title: 'Чернетку видалено',
      description: 'KT 1234 5678 5 UA',
      action: { label: 'Скасувати', onClick: undo },
    })
    await nextTick()
    const el = document.querySelector('.kite-toast')!
    expect(el.getAttribute('role')).toBe('status')
    expect(el.textContent).toContain('Чернетку видалено')
    ;[...el.querySelectorAll('button')].find((b) => b.textContent?.includes('Скасувати'))!.click()
    await nextTick()
    expect(undo).toHaveBeenCalledOnce()
    expect(document.querySelector('.kite-toast')).toBeNull()
  })

  it('зникає сам; danger — ні і має role="alert"; не більше трьох видимих', async () => {
    vi.useFakeTimers()
    mountHost()
    const toast = useToast()
    toast.success('Адресу збережено')
    await nextTick()
    vi.advanceTimersByTime(5100)
    await nextTick()
    expect(document.querySelector('.kite-toast')).toBeNull()

    toast.danger('Не вдалося зберегти')
    await nextTick()
    vi.advanceTimersByTime(60_000)
    await nextTick()
    expect(document.querySelector('.kite-toast[role="alert"]')).toBeTruthy()

    toast.info('2')
    toast.info('3')
    toast.info('4')
    await nextTick()
    expect(document.querySelectorAll('.kite-toast')).toHaveLength(3)
  })

  it('той самий id оновлює тост, а не додає новий', async () => {
    mountHost()
    const toast = useToast()
    toast({ id: 'copy', title: 'Скопійовано' })
    toast({ id: 'copy', title: 'Скопійовано знову' })
    await nextTick()
    expect(document.querySelectorAll('.kite-toast')).toHaveLength(1)
    expect(document.querySelector('.kite-toast')?.textContent).toContain('знову')
  })
})
