import { Bold, ChevronDown } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KButton from './button/KButton.vue'
import KButtonGroup from './button-group/KButtonGroup.vue'
import KField from './field/KField.vue'
import KIconButton from './icon-button/KIconButton.vue'
import KToggle from './toggle/KToggle.vue'
import KToggleGroup from './toggle-group/KToggleGroup.vue'
import KToggleGroupItem from './toggle-group/KToggleGroupItem.vue'

describe('KToggle', () => {
  it('aria-pressed змінюється, підпис — ні', async () => {
    const w = mount(KToggle, { props: { modelValue: false }, slots: { default: 'Лише мої' } })
    const btn = w.get('button')
    expect(btn.attributes('aria-pressed')).toBe('false')
    await btn.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    await w.setProps({ modelValue: true })
    expect(btn.attributes('aria-pressed')).toBe('true')
    expect(btn.attributes('data-state')).toBe('on')
    expect(btn.text()).toBe('Лише мої')
  })

  it('некерований з defaultValue; лише іконка — з aria-label', async () => {
    const w = mount(KToggle, {
      props: { icon: Bold, label: 'Жирний', defaultValue: true },
      attachTo: document.body,
    })
    const btn = w.get('button')
    expect(btn.attributes('aria-label')).toBe('Жирний')
    expect(btn.attributes('aria-pressed')).toBe('true')
    await btn.trigger('click')
    expect(btn.attributes('aria-pressed')).toBe('false')
    await expectNoA11yViolations(w.element)
  })
})

describe('KToggleGroup', () => {
  const group = (extra = '', model: string | null = 'parcel') => ({
    components: { KToggleGroup, KToggleGroupItem },
    setup: () => ({ value: ref<string | null>(model) }),
    template: `<KToggleGroup v-model="value" label="Тип відправлення" ${extra}>
      <KToggleGroupItem value="docs">Документи</KToggleGroupItem>
      <KToggleGroupItem value="parcel">Посилка</KToggleGroupItem>
      <KToggleGroupItem value="cargo" disabled>Вантаж</KToggleGroupItem>
    </KToggleGroup>`,
  })

  it('group з назвою, сегменти з aria-pressed, вибір і зняття', async () => {
    const w = mount(group(), { attachTo: document.body })
    const root = w.get('[role="group"]')
    expect(root.attributes('aria-label')).toBe('Тип відправлення')
    const [docs, parcel] = w.findAll('button')
    expect(parcel!.attributes('aria-pressed')).toBe('true')
    await docs!.trigger('click')
    expect((w.vm as unknown as { value: string | null }).value).toBe('docs')
    await w.findAll('button')[0]!.trigger('click')
    expect((w.vm as unknown as { value: string | null }).value).toBeNull()
    await expectNoA11yViolations(w.element)
  })

  it('required не дає зняти вибір', async () => {
    const w = mount(group('required'))
    await w.findAll('button')[1]!.trigger('click')
    await nextTick()
    expect((w.vm as unknown as { value: string | null }).value).toBe('parcel')
  })

  it('multiple працює з масивом; назва з KField', async () => {
    const w = mount({
      components: { KToggleGroup, KToggleGroupItem, KField },
      setup: () => ({ value: ref<string[]>(['a']) }),
      template: `<KField label="Формат"><KToggleGroup v-model="value" type="multiple">
        <KToggleGroupItem value="a">A</KToggleGroupItem>
        <KToggleGroupItem value="b">B</KToggleGroupItem>
      </KToggleGroup></KField>`,
    })
    await w.findAll('button')[1]!.trigger('click')
    expect((w.vm as unknown as { value: string[] }).value).toEqual(['a', 'b'])
    const labelId = w.get('label').attributes('id')
    expect(w.get('[role="group"]').attributes('aria-labelledby')).toBe(labelId)
  })
})

describe('KButtonGroup', () => {
  it('передає variant і size дітям; власні пропси мають пріоритет', async () => {
    const w = mount(
      {
        components: { KButtonGroup, KButton, KIconButton },
        setup: () => ({ ChevronDown }),
        template: `<KButtonGroup variant="primary" size="sm" label="Друк етикетки">
          <KButton>Друкувати</KButton>
          <KIconButton :icon="ChevronDown" label="Інші варіанти" :tooltip="false" />
          <KButton variant="ghost">Окремо</KButton>
        </KButtonGroup>`,
      },
      { attachTo: document.body },
    )
    const group = w.get('[role="group"]')
    expect(group.attributes('aria-label')).toBe('Друк етикетки')
    const buttons = w.findAll('button')
    expect(buttons.map((b) => b.attributes('data-variant'))).toEqual([
      'primary',
      'primary',
      'ghost',
    ])
    expect(buttons.map((b) => b.attributes('data-size'))).toEqual(['sm', 'sm', 'sm'])
    await expectNoA11yViolations(w.element)
  })

  it('без групи кнопки мають свої типові значення', () => {
    const w = mount(KIconButton, { props: { icon: ChevronDown, label: 'x', tooltip: false } })
    expect(w.get('button').attributes('data-variant')).toBe('ghost')
    expect(mount(KButton).get('button').attributes('data-variant')).toBe('secondary')
  })
})
