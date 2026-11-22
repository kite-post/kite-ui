import { Mail } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KField from './field/KField.vue'
import KInput from './input/KInput.vue'
import KLabel from './label/KLabel.vue'
import KSkeleton from './skeleton/KSkeleton.vue'
import KTextarea from './textarea/KTextarea.vue'

describe('KField + KInput', () => {
  const tpl = (extra = '') => ({
    components: { KField, KInput },
    setup: () => ({ value: ref(''), Mail }),
    template: `<KField label="Телефон отримувача" hint="На нього прийде код" ${extra}>
      <KInput v-model="value" autocomplete="tel" />
    </KField>`,
  })

  it('підпис звʼязаний з полем, підказка — через aria-describedby', () => {
    const w = mount(tpl())
    const input = w.get('input')
    const label = w.get('label')
    expect(label.attributes('for')).toBe(input.attributes('id'))
    const hintId = input.attributes('aria-describedby')!
    expect(w.get(`#${hintId}`).text()).toBe('На нього прийде код')
    expect(input.attributes('autocomplete')).toBe('tel')
  })

  it('помилка: aria-invalid, текст помилки замість підказки', () => {
    const w = mount(tpl('error="Вкажіть 9 цифр після +380"'))
    const input = w.get('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    const errId = input.attributes('aria-describedby')!
    expect(w.get(`#${errId}`).text()).toBe('Вкажіть 9 цифр після +380')
    expect(w.text()).not.toContain('На нього прийде код')
    expect(w.find('[data-invalid]').exists()).toBe(true)
  })

  it('optional показує «(необовʼязково)», required і disabled доходять до поля', () => {
    const w = mount(tpl('optional required disabled'))
    expect(w.get('label').text()).toContain('(необов’язково)')
    const input = w.get('input')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('власні пропси поля мають пріоритет над KField', () => {
    const w = mount({
      components: { KField, KInput },
      template: '<KField label="x"><KInput id="own" invalid /></KField>',
    })
    expect(w.get('input').attributes('id')).toBe('own')
    expect(w.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('v-model, очищення кнопкою й Esc, фокус повертається', async () => {
    const value = ref('olha@example.com')
    const w = mount(
      {
        components: { KInput },
        setup: () => ({ value }),
        template: '<KInput v-model="value" clearable aria-label="Email" />',
      },
      { attachTo: document.body },
    )
    await w.get('button').trigger('click')
    expect(value.value).toBe('')
    expect(document.activeElement).toBe(w.get('input').element)

    value.value = 'x'
    await nextTick()
    await w.get('input').trigger('keydown', { key: 'Escape' })
    expect(value.value).toBe('')
  })

  it('пароль: кнопка показати/сховати, поза порядком Tab', async () => {
    const w = mount(KInput, { props: { type: 'password' }, attrs: { 'aria-label': 'Пароль' } })
    expect(w.get('input').attributes('type')).toBe('password')
    const toggle = w.get('button')
    expect(toggle.attributes('tabindex')).toBe('-1')
    await toggle.trigger('click')
    expect(w.get('input').attributes('type')).toBe('text')
  })

  it('лічильник символів у рядку KField', async () => {
    const w = mount({
      components: { KField, KInput },
      setup: () => ({ v: ref('Мед') }),
      template: '<KField label="Опис"><KInput v-model="v" :maxlength="20" show-count /></KField>',
    })
    await nextTick()
    expect(w.text()).toContain('3 з 20')
  })

  it('клас — на поверхню, атрибути — на <input>', () => {
    const w = mount(KInput, {
      props: { leadingIcon: Mail, suffix: 'кг' },
      attrs: { class: 'k:max-w-40', name: 'weight', inputmode: 'decimal', 'aria-label': 'Вага' },
    })
    expect(w.classes()).toContain('k:max-w-40')
    expect(w.get('input').attributes('name')).toBe('weight')
    expect(w.get('input').attributes('inputmode')).toBe('decimal')
    expect(w.text()).toContain('кг')
  })

  it('без порушень доступності', async () => {
    const w = mount(
      {
        components: { KField, KInput },
        template: `<form>
          <KField label="Імʼя"><KInput autocomplete="name" /></KField>
          <KField label="Вага" error="До 30 кг"><KInput suffix="кг" /></KField>
          <KField label="Email" optional hint="Для чеків"><KInput type="email" clearable model-value="a@b.c" /></KField>
        </form>`,
      },
      { attachTo: document.body },
    )
    await expectNoA11yViolations(w.element)
  })
})

describe('KTextarea', () => {
  it('v-model і повʼязаний підпис', async () => {
    const value = ref('')
    const w = mount({
      components: { KField, KTextarea },
      setup: () => ({ value }),
      template: '<KField label="Коментар"><KTextarea v-model="value" /></KField>',
    })
    await w.get('textarea').setValue('Крихке')
    expect(value.value).toBe('Крихке')
    expect(w.get('label').attributes('for')).toBe(w.get('textarea').attributes('id'))
  })

  it('Ctrl+Enter відправляє форму, якщо дозволено', async () => {
    const submit = vi.fn((e: Event) => e.preventDefault())
    const w = mount(
      {
        components: { KTextarea },
        setup: () => ({ submit }),
        template: '<form @submit="submit"><KTextarea submit-on-mod-enter aria-label="x" /></form>',
      },
      { attachTo: document.body },
    )
    HTMLFormElement.prototype.requestSubmit ??= function (this: HTMLFormElement) {
      this.dispatchEvent(new Event('submit', { cancelable: true }))
    }
    await w.get('textarea').trigger('keydown', { key: 'Enter', ctrlKey: true })
    expect(submit).toHaveBeenCalledOnce()
  })
})

describe('KLabel і KSkeleton', () => {
  it('KLabel рендерить <label for>', () => {
    const w = mount(KLabel, { props: { for: 'x' }, slots: { default: 'Підпис' } })
    expect(w.get('label').attributes('for')).toBe('x')
  })

  it('KSkeleton: рядки тексту, останній коротший; прихований від скрінрідера', () => {
    const w = mount(KSkeleton, { props: { lines: 3 } })
    expect(w.attributes('aria-hidden')).toBe('true')
    const lines = w.findAll('.kite-skeleton')
    expect(lines).toHaveLength(3)
    expect(lines[2]!.attributes('style')).toContain('60%')
  })

  it('KSkeleton circle — квадратний за шириною', () => {
    const w = mount(KSkeleton, { props: { shape: 'circle', width: '40px' } })
    expect(w.attributes('style')).toContain('height: 40px')
    expect(w.classes()).toContain('k:rounded-full')
  })
})
