import { Copy, Ellipsis } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../test-utils/a11y'
import KIconButton from './KIconButton.vue'

describe('KIconButton', () => {
  it('має доступну назву з label і квадратний розмір', () => {
    const w = mount(KIconButton, { props: { icon: Copy, label: 'Копіювати номер' } })
    const el = w.get('button')
    expect(el.attributes('aria-label')).toBe('Копіювати номер')
    expect(el.classes()).toContain('k:w-10')
    expect(el.attributes('data-variant')).toBe('ghost')
  })

  it.each([
    ['sm', 'k:w-8', '16'],
    ['md', 'k:w-10', '20'],
    ['lg', 'k:w-12', '24'],
  ] as const)('розмір %s: кнопка %s, іконка %s px', (size, width, px) => {
    const w = mount(KIconButton, { props: { icon: Ellipsis, label: 'Ще дії', size } })
    expect(w.get('button').classes()).toContain(width)
    expect(w.get('svg').attributes('width')).toBe(px)
  })

  it('клік проходить; вимкнена — ні, і без тултіпа', async () => {
    const onClick = vi.fn()
    const w = mount(KIconButton, { props: { icon: Copy, label: 'Копіювати' }, attrs: { onClick } })
    await w.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()

    const off = mount(KIconButton, {
      props: { icon: Copy, label: 'Копіювати', disabled: true },
      attrs: { onClick },
    })
    await off.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
    expect(off.get('button').attributes('data-state')).toBeUndefined()
  })

  it('тултіп підключено: тригер має стан Reka', () => {
    const w = mount(KIconButton, { props: { icon: Copy, label: 'Копіювати' } })
    expect(w.get('button').attributes('data-state')).toBe('closed')
  })

  it('без порушень доступності', async () => {
    const w = mount(KIconButton, {
      props: { icon: Copy, label: 'Копіювати номер' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(document.body)
    w.unmount()
  })
})
