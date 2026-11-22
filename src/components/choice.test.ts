import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KCheckbox from './checkbox/KCheckbox.vue'
import KCheckboxGroup from './checkbox/KCheckboxGroup.vue'
import KRadio from './radio-group/KRadio.vue'
import KRadioGroup from './radio-group/KRadioGroup.vue'
import KSelect from './select/KSelect.vue'
import KSwitch from './switch/KSwitch.vue'

const flush = async () => {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

describe('KCheckbox', () => {
  it('role="checkbox", перемикається кліком по підпису', async () => {
    const value = ref<boolean | 'indeterminate'>(false)
    const w = mount(
      {
        components: { KCheckbox },
        setup: () => ({ value }),
        template: '<KCheckbox v-model="value" label="Застрахувати посилку" description="0,5 %" />',
      },
      { attachTo: document.body },
    )
    const box = w.get('[role="checkbox"]')
    expect(box.attributes('aria-checked')).toBe('false')
    await w.get('label').trigger('click')
    expect(value.value).toBe(true)
    expect(box.attributes('aria-describedby')).toBeTruthy()
  })

  it('стан «частково» — aria-checked="mixed"', () => {
    const w = mount(KCheckbox, { props: { modelValue: 'indeterminate', label: 'Усі' } })
    expect(w.get('[role="checkbox"]').attributes('aria-checked')).toBe('mixed')
  })

  it('invalid і disabled', () => {
    const w = mount(KCheckbox, { props: { invalid: true, disabled: true, label: 'Умови' } })
    const box = w.get('[role="checkbox"]')
    expect(box.attributes('aria-invalid')).toBe('true')
    expect(box.attributes('disabled')).toBeDefined()
  })
})

describe('KCheckboxGroup', () => {
  it('fieldset + legend, масив значень', async () => {
    const value = ref<string[]>(['push'])
    const w = mount(
      {
        components: { KCheckboxGroup },
        setup: () => ({
          value,
          options: [
            { value: 'push', label: 'Push' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
          ],
        }),
        template:
          '<KCheckboxGroup v-model="value" label="Куди надсилати" :options="options" hint="Хоча б один" />',
      },
      { attachTo: document.body },
    )
    expect(w.get('legend').text()).toBe('Куди надсилати')
    const boxes = w.findAll('[role="checkbox"]')
    expect(boxes[0]!.attributes('aria-checked')).toBe('true')
    await boxes[2]!.trigger('click')
    expect(value.value).toEqual(['push', 'sms'])
    await boxes[0]!.trigger('click')
    expect(value.value).toEqual(['sms'])
    await expectNoA11yViolations(w.element)
  })
})

describe('KRadioGroup', () => {
  const tpl = (variant = 'default') => ({
    components: { KRadioGroup, KRadio },
    setup: () => ({ value: ref<string | null>('sender') }),
    template: `<KRadioGroup v-model="value" label="Хто платить" variant="${variant}" error="">
      <KRadio value="sender" label="Відправник" />
      <KRadio value="recipient" label="Отримувач" description="Оплата при отриманні" />
      <KRadio value="business" label="Бізнес-рахунок" disabled />
    </KRadioGroup>`,
  })

  it('radiogroup з назвою з легенди; клік обирає', async () => {
    const w = mount(tpl(), { attachTo: document.body })
    const group = w.get('[role="radiogroup"]')
    const legendId = group.attributes('aria-labelledby')!
    expect(w.get(`#${legendId}`).text()).toBe('Хто платить')
    const radios = w.findAll('[role="radio"]')
    expect(radios[0]!.attributes('aria-checked')).toBe('true')
    await radios[1]!.trigger('click')
    expect((w.vm as unknown as { value: string }).value).toBe('recipient')
    expect(radios[2]!.attributes('disabled')).toBeDefined()
  })

  it('варіант card позначає обрану картку', async () => {
    const w = mount(tpl('card'))
    expect(w.findAll('.kite-radio')[0]!.attributes('data-state')).toBe('checked')
    expect(w.get('[role="radiogroup"]').attributes('data-variant')).toBe('card')
  })

  it('без порушень доступності', async () => {
    const w = mount(tpl('card'), { attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})

describe('KSwitch', () => {
  it('role="switch", перемикання, loading — aria-busy', async () => {
    const value = ref(false)
    const w = mount(
      {
        components: { KSwitch },
        setup: () => ({ value }),
        template:
          '<KSwitch v-model="value" label="Сповіщення email" description="Статуси посилок" loading />',
      },
      { attachTo: document.body },
    )
    const sw = w.get('[role="switch"]')
    expect(sw.attributes('aria-checked')).toBe('false')
    expect(sw.attributes('aria-busy')).toBe('true')
    await sw.trigger('click')
    expect(value.value).toBe(true)
    await expectNoA11yViolations(w.element)
  })
})

describe('KSelect', () => {
  const options = [
    { value: 'changed-mind', label: 'Передумав' },
    { value: 'size', label: 'Не підійшов розмір' },
    { value: 'damaged', label: 'Товар пошкоджений', description: 'Додайте фото' },
    { value: 'expired', label: 'Прострочено', disabled: true },
  ]

  it('тригер — combobox з плейсхолдером і назвою з KField', async () => {
    const { default: KField } = await import('./field/KField.vue')
    const w = mount(
      {
        components: { KSelect, KField },
        setup: () => ({ value: ref<string | null>(null), options }),
        template:
          '<KField label="Причина повернення" error="Оберіть причину"><KSelect v-model="value" :options="options" /></KField>',
      },
      { attachTo: document.body },
    )
    const trigger = w.get('[role="combobox"]')
    expect(trigger.text()).toContain('Оберіть')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(w.get('label').attributes('for')).toBe(trigger.attributes('id'))
    await expectNoA11yViolations(w.element)
  })

  it('відкривається з клавіатури, показує варіанти, обирає', async () => {
    const value = ref<string | null>(null)
    const w = mount(
      {
        components: { KSelect },
        setup: () => ({ value, options }),
        template: '<KSelect v-model="value" :options="options" aria-label="Причина" />',
      },
      { attachTo: document.body },
    )
    await w.get('[role="combobox"]').trigger('keydown', { key: 'Enter' })
    await flush()
    const items = [...document.querySelectorAll('[role="option"]')]
    expect(items.map((i) => i.textContent?.trim().split('\n')[0])).toContain('Передумав')
    expect(items).toHaveLength(4)
    ;(items[1] as HTMLElement).dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    ;(items[1] as HTMLElement).click()
    await flush()
    expect(value.value).toBe('size')
  })

  it('clearable скидає значення на null', async () => {
    const value = ref<string | null>('size')
    const w = mount({
      components: { KSelect },
      setup: () => ({ value, options }),
      template: '<KSelect v-model="value" :options="options" clearable aria-label="x" />',
    })
    expect(w.get('[role="combobox"]').text()).toContain('Не підійшов розмір')
    await w.get('button[aria-label="Очистити вибір"]').trigger('click')
    expect(value.value).toBeNull()
  })

  it('readonly — не відкривається', async () => {
    const w = mount(KSelect, {
      props: { options, modelValue: 'size', readonly: true },
      attrs: { 'aria-label': 'x' },
      attachTo: document.body,
    })
    await w.get('[role="combobox"]').trigger('keydown', { key: 'Enter' })
    await flush()
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })
})
