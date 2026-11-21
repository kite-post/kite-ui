import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KCard from './card/KCard.vue'
import KCardContent from './card/KCardContent.vue'
import KCardFooter from './card/KCardFooter.vue'
import KCardHeader from './card/KCardHeader.vue'
import KLink from './link/KLink.vue'

describe('KLink', () => {
  it('inline — підкреслене посилання', () => {
    const w = mount(KLink, { props: { href: '/tariffs' }, slots: { default: 'тарифи' } })
    const a = w.get('a')
    expect(a.attributes('href')).toBe('/tariffs')
    expect(a.classes()).toContain('k:underline')
    expect(a.attributes('target')).toBeUndefined()
  })

  it('зовнішнє: нова вкладка, rel, іконка й текст для скрінрідера', () => {
    const w = mount(KLink, {
      props: { href: 'https://docs.example.com/api', variant: 'standalone' },
      slots: { default: 'Документація API' },
    })
    const a = w.get('a')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    expect(w.find('svg').exists()).toBe(true)
    expect(w.text()).toContain('(відкривається в новій вкладці)')
  })

  it('external=false вимикає автовизначення', () => {
    const w = mount(KLink, { props: { href: 'https://kite.ua', external: false } })
    expect(w.get('a').attributes('target')).toBeUndefined()
  })

  it('без роутера to стає href', () => {
    const w = mount(KLink, { props: { to: '/shipments' }, slots: { default: 'Відправлення' } })
    expect(w.get('a').attributes('href')).toBe('/shipments')
  })
})

describe('KCard', () => {
  const card = {
    components: { KCard, KCardHeader, KCardContent, KCardFooter },
    template: `<KCard variant="elevated" interactive>
      <KCardHeader title="KT 1234 5678 5 UA" description="Київ → Львів" title-href="/p/1">
        <template #actions><button aria-label="Ще дії">…</button></template>
      </KCardHeader>
      <KCardContent>Можна забирати</KCardContent>
      <KCardFooter><button>Деталі</button></KCardFooter>
    </KCard>`,
  }

  it('заголовок — h3 з посиланням-розтяжкою; дії над ним', () => {
    const w = mount(card)
    const h = w.get('h3')
    expect(h.get('a').attributes('href')).toBe('/p/1')
    expect(h.get('a').classes()).toContain('kite-card__stretch')
    expect(w.get('[data-interactive]').attributes('data-variant')).toBe('elevated')
  })

  it('titleAs змінює рівень заголовка', () => {
    const w = mount(KCardHeader, { props: { title: 'Отримувач', titleAs: 'h4' } })
    expect(w.find('h4').exists()).toBe(true)
  })

  it('padding sm доходить до частин через контекст', () => {
    const w = mount({
      components: { KCard, KCardContent },
      template: '<KCard padding="sm"><KCardContent>x</KCardContent></KCard>',
    })
    expect(w.get('.kite-card__content').classes()).toContain('k:px-4')
  })

  it('без порушень доступності', async () => {
    const w = mount(card, { attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})
