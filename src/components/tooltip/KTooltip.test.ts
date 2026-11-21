import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import KConfigProvider from '../../config/KConfigProvider.vue'
import KTooltip from './KTooltip.vue'

const flush = async () => {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

describe('KTooltip', () => {
  it('показується на фокус одразу, з роллю tooltip, і ховається на Escape', async () => {
    const w = mount(
      {
        components: { KTooltip },
        template: '<KTooltip content="Копіювати номер"><button>copy</button></KTooltip>',
      },
      { attachTo: document.body },
    )
    const trigger = w.get('button')
    await trigger.trigger('focus')
    await flush()
    const tip = document.querySelector('[role="tooltip"]')
    expect(tip?.textContent).toContain('Копіювати номер')
    expect(trigger.attributes('aria-describedby')).toBeTruthy()

    await trigger.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(trigger.attributes('data-state')).toBe('closed')
  })

  it('показує гарячу клавішу', async () => {
    const w = mount(
      {
        components: { KTooltip },
        template: `<KTooltip content="Пошук" :shortcut="['mod', 'k']"><button>s</button></KTooltip>`,
      },
      { attachTo: document.body },
    )
    await w.get('button').trigger('focus')
    await flush()
    expect(document.querySelectorAll('.kite-tooltip kbd').length).toBe(2)
  })

  it('працює і всередині KConfigProvider (спільний TooltipProvider)', async () => {
    const w = mount(
      {
        components: { KTooltip, KConfigProvider },
        template:
          '<KConfigProvider><KTooltip content="Назва"><button>x</button></KTooltip></KConfigProvider>',
      },
      { attachTo: document.body },
    )
    await w.get('button').trigger('focus')
    await flush()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Назва')
  })

  it('disabled — не відкривається', async () => {
    const w = mount(
      {
        components: { KTooltip },
        template: '<KTooltip content="Назва" disabled><button>x</button></KTooltip>',
      },
      { attachTo: document.body },
    )
    await w.get('button').trigger('focus')
    await flush()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })
})
