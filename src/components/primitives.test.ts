import { CircleCheck, Truck } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import KConfigProvider from '../config/KConfigProvider.vue'
import { expectNoA11yViolations } from '../test-utils/a11y'
import KBadge from './badge/KBadge.vue'
import KIcon from './icon/KIcon.vue'
import KKbd from './kbd/KKbd.vue'
import KSeparator from './separator/KSeparator.vue'
import KSpinner from './spinner/KSpinner.vue'

describe('KIcon', () => {
  it('декоративна за замовчуванням, товщина 1,5', () => {
    const w = mount(KIcon, { props: { icon: Truck } })
    const svg = w.get('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('stroke-width')).toBe('1.5')
    expect(svg.attributes('width')).toBe('20')
  })

  it.each([
    ['xs', '12'],
    ['sm', '16'],
    ['lg', '24'],
    ['2xl', '48'],
  ] as const)('розмір %s — %s px', (size, px) => {
    expect(
      mount(KIcon, { props: { icon: Truck, size } })
        .get('svg')
        .attributes('width'),
    ).toBe(px)
  })

  it('з label — змістовна: role="img" і назва', () => {
    const svg = mount(KIcon, { props: { icon: Truck, label: 'У дорозі' } }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('У дорозі')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })
})

describe('KSpinner', () => {
  it('зʼявляється із затримкою і має роль status з текстом', async () => {
    const w = mount(KSpinner, { props: { delay: 20 } })
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('Завантаження…')
    expect(w.find('svg').exists()).toBe(false)
    await new Promise((r) => setTimeout(r, 40))
    expect(w.find('svg').exists()).toBe(true)
  })

  it('decorative — без ролі й тексту', () => {
    const w = mount(KSpinner, { props: { decorative: true, delay: 0 } })
    expect(w.attributes('role')).toBeUndefined()
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.text()).toBe('')
  })

  it('мова з KConfigProvider', () => {
    const w = mount({
      components: { KConfigProvider, KSpinner },
      template: '<KConfigProvider locale="en"><KSpinner :delay="0" /></KConfigProvider>',
    })
    expect(w.text()).toContain('Loading…')
  })
})

describe('KBadge', () => {
  it('тон, варіант і розмір у data-атрибутах; іконка декоративна', () => {
    const w = mount(KBadge, {
      props: { tone: 'success', variant: 'solid', icon: CircleCheck },
      slots: { default: 'Оплачено' },
    })
    expect(w.attributes('data-tone')).toBe('success')
    expect(w.attributes('data-variant')).toBe('solid')
    expect(w.get('svg').attributes('aria-hidden')).toBe('true')
    expect(w.text()).toBe('Оплачено')
  })

  it('лічильник обрізається за max і має прихований контекст', () => {
    const w = mount(KBadge, { props: { count: 120, label: '120 непрочитаних' } })
    expect(w.text()).toContain('99+')
    expect(w.get('.k\\:sr-only').text()).toBe('120 непрочитаних')
  })

  it('крапка замість іконки', () => {
    const w = mount(KBadge, { props: { dot: true }, slots: { default: 'Онлайн' } })
    expect(w.find('span[aria-hidden="true"]').exists()).toBe(true)
    expect(w.find('svg').exists()).toBe(false)
  })
})

describe('KSeparator', () => {
  it('декоративний за замовчуванням', () => {
    const w = mount(KSeparator)
    expect(w.attributes('role')).toBe('none')
  })

  it('семантичний вертикальний', () => {
    const w = mount(KSeparator, { props: { decorative: false, orientation: 'vertical' } })
    expect(w.attributes('role')).toBe('separator')
    expect(w.attributes('aria-orientation')).toBe('vertical')
  })

  it('з підписом', () => {
    expect(mount(KSeparator, { props: { label: 'або' } }).text()).toBe('або')
  })
})

describe('KKbd', () => {
  it('рендерить <kbd> на кожну клавішу', () => {
    const w = mount(KKbd, { props: { keys: ['mod', 'k'] } })
    const keys = w.findAll('kbd')
    expect(keys).toHaveLength(2)
    expect(keys[1]!.text()).toBe('K')
  })

  it('символ ↵ має назву для скрінрідера', () => {
    const w = mount(KKbd, { props: { keys: ['enter'] } })
    expect(w.get('[aria-hidden="true"]').text()).toBe('↵')
    expect(w.get('.k\\:sr-only').text()).toBe('Enter')
  })
})

describe('примітиви без порушень доступності', () => {
  it('axe', async () => {
    const w = mount(
      {
        components: { KBadge, KIcon, KKbd, KSeparator, KSpinner },
        setup: () => ({ Truck }),
        template: `<div>
          <KIcon :icon="Truck" label="У дорозі" />
          <KBadge tone="info" :icon="Truck">Їде до Львова</KBadge>
          <KBadge :count="3" label="3 непрочитані" variant="solid" tone="danger" />
          <KSeparator />
          <KSeparator label="або" />
          <KKbd :keys="['mod', 'k']" />
          <KSpinner :delay="0" />
        </div>`,
      },
      { attachTo: document.body },
    )
    await expectNoA11yViolations(w.element)
  })
})
