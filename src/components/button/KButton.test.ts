import { Plus } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../test-utils/a11y'
import KButton from './KButton.vue'

describe('KButton', () => {
  it('рендериться як <button type="button"> з варіантом і розміром за замовчуванням', () => {
    const w = mount(KButton, { slots: { default: 'Зберегти' } })
    const el = w.get('button')
    expect(el.attributes('type')).toBe('button')
    expect(el.attributes('data-variant')).toBe('secondary')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.text()).toBe('Зберегти')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger', 'link'] as const)(
    'варіант %s ставить data-variant і свої класи',
    (variant) => {
      const w = mount(KButton, { props: { variant }, slots: { default: 'Дія' } })
      expect(w.get('button').attributes('data-variant')).toBe(variant)
    },
  )

  it('primary має темний текст на кораловій (не білий)', () => {
    const w = mount(KButton, { props: { variant: 'primary' }, slots: { default: 'Оплатити' } })
    const cls = w.get('button').classes()
    expect(cls).toContain('k:bg-primary')
    expect(cls).toContain('k:text-on-primary')
  })

  it('передає клік і зливає класи застосунку', async () => {
    const onClick = vi.fn()
    const w = mount(KButton, {
      attrs: { onClick, class: 'k:px-10' },
      slots: { default: 'Дія' },
    })
    await w.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
    // Клас застосунку перемагає відступ варіанта.
    expect(w.get('button').classes()).toContain('k:px-10')
    expect(w.get('button').classes()).not.toContain('k:px-4')
  })

  it('disabled: нативний атрибут, клік не проходить', async () => {
    const onClick = vi.fn()
    const w = mount(KButton, { props: { disabled: true }, attrs: { onClick } })
    const el = w.get('button')
    expect(el.attributes('disabled')).toBeDefined()
    expect(el.attributes('data-disabled')).toBe('')
    await el.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('loading: aria-busy, спінер замість іконки, клік ігнорується, фокус лишається', async () => {
    const onClick = vi.fn()
    const w = mount(KButton, {
      props: { loading: true, leadingIcon: Plus },
      attrs: { onClick },
      slots: { default: 'Оплатити' },
    })
    const el = w.get('button')
    expect(el.attributes('aria-busy')).toBe('true')
    expect(el.attributes('disabled')).toBeUndefined()
    expect(w.find('.kite-spinner').exists()).toBe(true)
    expect(w.find('.lucide-plus').exists()).toBe(false)
    await el.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('як посилання: as="a" з href, disabled — aria-disabled і tabindex -1', () => {
    const w = mount(KButton, {
      props: { as: 'a', disabled: true },
      attrs: { href: '/new' },
      slots: { default: 'Створити накладну' },
    })
    const el = w.get('a')
    expect(el.attributes('href')).toBe('/new')
    expect(el.attributes('type')).toBeUndefined()
    expect(el.attributes('aria-disabled')).toBe('true')
    expect(el.attributes('tabindex')).toBe('-1')
  })

  it('submit-кнопка відправляє форму', async () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault())
    const w = mount(
      {
        components: { KButton },
        template: '<form @submit="onSubmit"><KButton type="submit">Надіслати</KButton></form>',
        methods: { onSubmit },
      },
      { attachTo: document.body },
    )
    w.get('button').element.click()
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('без порушень доступності', async () => {
    const w = mount(
      {
        components: { KButton },
        setup: () => ({ Plus }),
        template: `<div>
          <KButton variant="primary" :leading-icon="Plus">Створити накладну</KButton>
          <KButton disabled>Зберегти</KButton>
          <KButton loading>Оплатити</KButton>
          <KButton as="a" href="/x">Перейти</KButton>
        </div>`,
      },
      { attachTo: document.body },
    )
    await expectNoA11yViolations(w.element)
  })
})
