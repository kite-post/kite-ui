import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KCombobox from './combobox/KCombobox.vue'
import KDatePicker from './date-picker/KDatePicker.vue'
import KDateRangePicker from './date-range-picker/KDateRangePicker.vue'
import KField from './field/KField.vue'
import KFileUpload from './file-upload/KFileUpload.vue'
import type { UploadItem } from './file-upload/types'
import KNumberField from './number-field/KNumberField.vue'
import KPinInput from './pin-input/KPinInput.vue'
import KTagsInput from './tags-input/KTagsInput.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))

function paste(el: Element, text: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: () => text, files: [] },
  })
  el.dispatchEvent(event)
  return event
}

describe('KNumberField', () => {
  it('spinbutton з межами, одиницями в aria-valuetext і кнопками поза Tab', async () => {
    const w = mount(
      {
        components: { KField, KNumberField },
        setup: () => ({ v: ref<number | null>(2.4) }),
        template: `<KField label="Вага"><KNumberField v-model="v" :precision="1" unit="кг" :min="0.1" :max="30" :step="0.1" /></KField>`,
      },
      { attachTo: document.body },
    )
    await flush()
    const input = w.get('input')
    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('aria-valuemax')).toBe('30')
    expect(input.attributes('aria-valuetext')).toBe('2,4 кг')
    expect(input.attributes('inputmode')).toBe('decimal')
    const inc = w.get('[aria-label="Збільшити"]')
    expect(inc.attributes('tabindex')).toBe('-1')
    await expectNoA11yViolations(w.element)
  })

  it('стрілки ± step, Shift+стрілка — великий крок, межі тримаються', async () => {
    const w = mount(KNumberField, { props: { modelValue: 5, min: 0, max: 30 } })
    const input = w.get('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([6])
    await input.trigger('keydown', { key: 'ArrowUp', shiftKey: true })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([16])
    await w.setProps({ modelValue: 25 })
    await input.trigger('keydown', { key: 'PageUp' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([30])
  })

  it('money: v-model у копійках, показ у гривнях; порожнє — null', async () => {
    const w = mount(KNumberField, {
      props: { modelValue: 125000, format: 'money', stepper: false },
    })
    await flush()
    const input = w.get('input')
    expect((input.element as HTMLInputElement).value.replace(/\s/g, ' ')).toBe('1 250,00')
    expect(w.text()).toContain('₴')
    expect(w.find('[aria-label="Збільшити"]').exists()).toBe(false)
    await input.setValue('')
    await input.trigger('blur')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })
})

describe('KPinInput', () => {
  it('комірки з назвами «Символ i з n», група з назвою з KField', async () => {
    const w = mount(
      {
        components: { KField, KPinInput },
        setup: () => ({ v: ref('') }),
        template: `<KField label="Код отримання"><KPinInput v-model="v" :length="4" /></KField>`,
      },
      { attachTo: document.body },
    )
    const cells = w.findAll('.kite-pin-cell')
    expect(cells).toHaveLength(4)
    expect(cells[1]!.attributes('aria-label')).toBe('Символ 2 з 4')
    expect(cells[0]!.attributes('inputmode')).toBe('numeric')
    expect(w.get('label').attributes('for')).toBe(cells[0]!.attributes('id'))
    expect(w.get('[role="group"]').attributes('aria-labelledby')).toBe(
      w.get('label').attributes('id'),
    )
    await expectNoA11yViolations(w.element)
  })

  it('вставка в будь-яку комірку заповнює всі й відкидає дефіси; complete', async () => {
    const w = mount(KPinInput, { props: { length: 6, groups: [3, 3] }, attachTo: document.body })
    const cells = w.findAll('.kite-pin-cell')
    paste(cells[3]!.element, ' 482-913 ')
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['482913'])
    expect(w.emitted('complete')?.[0]).toEqual(['482913'])
  })

  it('otp — autocomplete="one-time-code"', () => {
    const w = mount(KPinInput, { props: { otp: true, length: 4 } })
    expect(w.find('input[autocomplete="one-time-code"]').exists()).toBe(true)
  })
})

describe('KTagsInput', () => {
  const mountTags = (props: Record<string, unknown> = {}) =>
    mount(
      {
        components: { KField, KTagsInput },
        setup: () => ({ v: ref<string[]>(['KT1']), props }),
        template: `<KField label="Номери накладних"><KTagsInput v-model="v" v-bind="props" /></KField>`,
      },
      { attachTo: document.body },
    )
  const value = (w: ReturnType<typeof mountTags>) => (w.vm as unknown as { v: string[] }).v

  it('розділювач створює чип, Backspace виділяє і видаляє останній', async () => {
    const w = mountTags()
    const input = w.get('input')
    await input.setValue('kt2')
    await input.trigger('keydown', { key: 'Enter' })
    expect(value(w)).toEqual(['KT1', 'kt2'])
    await input.trigger('keydown', { key: 'Backspace' })
    expect(w.findAll('li')[1]!.attributes('data-active')).toBe('')
    await input.trigger('keydown', { key: 'Backspace' })
    expect(value(w)).toEqual(['KT1'])
    await expectNoA11yViolations(w.element)
  })

  it('вставка стовпця: нормалізація, повтори відкидаються, невалідні позначені', async () => {
    const w = mountTags({
      normalize: (s: string) => s.replace(/\s+/g, '').toUpperCase(),
      validate: (s: string) => (s.startsWith('KT') ? true : 'Неправильний номер'),
    })
    paste(w.get('input').element, 'kt2\nKT1\nxx9\n')
    await nextTick()
    expect(value(w)).toEqual(['KT1', 'KT2', 'XX9'])
    expect(w.text()).toContain('Пропущено повторів: 1')
    const bad = w.findAll('li')[2]!
    expect(bad.attributes('data-invalid')).toBe('')
    expect(w.get(`#${bad.attributes('aria-describedby')}`).text()).toBe('Неправильний номер')
    expect(w.find('[aria-label="Прибрати KT2"]').exists()).toBe(true)
  })

  it('«Очистити все» і межа max', async () => {
    const w = mountTags({ max: 2 })
    const input = w.get('input')
    paste(input.element, 'a,b,c')
    await nextTick()
    expect(value(w)).toEqual(['KT1', 'A'.toLowerCase()])
    expect(w.text()).toContain('Не більше 2 значень')
    await w
      .findAll('button')
      .find((b) => b.text() === 'Очистити все')!
      .trigger('click')
    expect(value(w)).toEqual([])
  })
})

describe('KCombobox', () => {
  const options = ['Київ', 'Львів', 'Кам’янець-Подільський', 'Ірпінь'].map((c) => ({
    value: c,
    label: c,
  }))
  const typeInto = async (input: HTMLInputElement, text: string) => {
    input.value = text
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
  }
  const items = () =>
    [...document.querySelectorAll('[role="option"]')].map((o) => o.textContent?.trim())

  it('APG combobox: фільтр без регістру й апострофа, підсвітка збігу, вибір', async () => {
    const w = mount(
      {
        components: { KField, KCombobox },
        setup: () => ({ v: ref<string | null>(null), options }),
        template: `<KField label="Місто"><KCombobox v-model="v" :options="options" /></KField>`,
      },
      { attachTo: document.body },
    )
    const input = w.get('input').element as HTMLInputElement
    expect(input.getAttribute('role')).toBe('combobox')
    await typeInto(input, "кам'ян")
    expect(input.getAttribute('aria-expanded')).toBe('true')
    expect(items()).toEqual(['Кам’янець-Подільський'])
    expect(document.querySelector('[role="option"] mark')?.textContent).toBe('Кам’ян')
    await typeInto(input, 'irp')
    expect(items()).toEqual([])
    await typeInto(input, 'Ірп')
    ;(document.querySelector('[role="option"]') as HTMLElement).click()
    await flush()
    expect((w.vm as unknown as { v: string }).v).toBe('Ірпінь')
    expect(input.value).toBe('Ірпінь')
    await expectNoA11yViolations(w.element)
  })

  it('порожній результат, minSearchLength і «Додати»', async () => {
    const onCreate = vi.fn()
    const w = mount(KCombobox, {
      props: { options, minSearchLength: 2, allowCustom: true, onCreate },
      attachTo: document.body,
    })
    const input = w.get('input').element as HTMLInputElement
    await typeInto(input, 'Б')
    expect(document.body.textContent).toContain('Введіть щонайменше 2 символи')
    await typeInto(input, 'Бровари')
    expect(items()).toEqual(['Додати «Бровари»'])
    ;(document.querySelector('[role="option"]') as HTMLElement).click()
    await flush()
    expect(onCreate).toHaveBeenCalledWith('Бровари')
  })

  it('multiple: чипи з кнопкою прибрати, «+n» понад maxVisibleChips', async () => {
    const w = mount(KCombobox, {
      props: {
        options,
        multiple: true,
        maxVisibleChips: 2,
        modelValue: ['Київ', 'Львів', 'Ірпінь'],
      },
    })
    expect(w.findAll('.kite-combobox-chip')).toHaveLength(2)
    expect(w.text()).toContain('+1')
    await w.get('[aria-label="Прибрати «Київ»"]').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['Львів', 'Ірпінь']])
  })

  it('filter=false: update:search з затримкою', async () => {
    vi.useFakeTimers()
    const w = mount(KCombobox, { props: { filter: false, debounce: 250 } })
    const input = w.get('input')
    await input.setValue('Льв')
    expect(w.emitted('update:search')).toBeUndefined()
    vi.advanceTimersByTime(260)
    expect(w.emitted('update:search')?.at(-1)).toEqual(['Льв'])
    vi.useRealTimers()
  })
})

describe('KFileUpload', () => {
  const file = (name: string, type: string, size = 10) =>
    new File(['x'.repeat(size)], name, { type })
  const choose = async (w: ReturnType<typeof mount>, files: File[]) => {
    const input = w.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: files, configurable: true })
    await input.trigger('change')
    await flush()
  }

  it('зона — label з нативним input; підказка з accept і maxSize', async () => {
    const w = mount(
      {
        components: { KField, KFileUpload },
        setup: () => ({ v: ref<UploadItem[]>([]) }),
        template: `<KField label="Імпорт"><KFileUpload v-model="v" accept=".csv,text/csv" :max-size="10485760" /></KField>`,
      },
      { attachTo: document.body },
    )
    const input = w.get('input[type="file"]')
    expect(input.element.closest('label')).not.toBeNull()
    expect(w.text()).toContain('CSV, до 10 МБ')
    expect(w.text()).toContain('оберіть на пристрої')
    await expectNoA11yViolations(w.element)
  })

  it('відхиляє тип і розмір з поясненням, приймає решту', async () => {
    const w = mount(KFileUpload, {
      props: { accept: '.csv', maxSize: 100, multiple: true },
      attachTo: document.body,
    })
    await choose(w, [
      file('a.csv', 'text/csv'),
      file('b.png', 'image/png'),
      file('c.csv', 'text/csv', 500),
    ])
    const rejected = w.emitted('rejected')!
    expect(rejected.map((r) => r[1])).toEqual(['type', 'size'])
    expect(w.text()).toContain('Цей тип файлу не підходить. Потрібен CSV')
    expect(w.text()).toContain('Файл більший за 100 Б')
    const model = w.emitted('update:modelValue')!.at(-1)![0] as UploadItem[]
    expect(model.map((i) => i.file.name)).toEqual(['a.csv'])
  })

  it('upload: прогрес, done і помилка з «Спробувати ще»', async () => {
    let fail = true
    const upload = vi.fn(async (_f: File, { onProgress }: { onProgress: (p: number) => void }) => {
      onProgress(50)
      if (fail) throw new Error('Сервер не прийняв файл')
      return { id: 1 }
    })
    const w = mount(KFileUpload, { props: { upload }, attachTo: document.body })
    await choose(w, [file('vidpravky.csv', 'text/csv')])
    await flush()
    expect(w.text()).toContain('Сервер не прийняв файл')
    fail = false
    await w.get('[aria-label="Спробувати ще"]').trigger('click')
    await flush()
    await flush()
    const last = w.emitted('update:modelValue')!.at(-1)![0] as UploadItem[]
    expect(last[0]!.status).toBe('done')
    expect(last[0]!.result).toEqual({ id: 1 })
    expect(upload).toHaveBeenCalledTimes(2)
  })
})

describe('KDatePicker', () => {
  it('ISO на вході й виході, сегменти дд.мм.рррр, вставка 24.11.2026', async () => {
    const w = mount(
      {
        components: { KField, KDatePicker },
        setup: () => ({ v: ref<string | null>('2026-11-24') }),
        template: `<KField label="Тримати до"><KDatePicker v-model="v" /></KField>`,
      },
      { attachTo: document.body },
    )
    await flush()
    const field = w.get('.kite-date-field')
    expect(field.text().replace(/\s/g, '')).toContain('24.11.2026')
    paste(field.element, '01/12/2026')
    await flush()
    expect((w.vm as unknown as { v: string }).v).toBe('2026-12-01')
    paste(field.element, '31.02.2026')
    await flush()
    expect((w.vm as unknown as { v: string }).v).toBe('2026-12-01')
    expect(w.find('[aria-label="Відкрити календар"]').exists()).toBe(true)
    await expectNoA11yViolations(w.element)
  })

  it('календар: діалог з назвою, сітка, вибір дня, недоступні дні', async () => {
    const w = mount(KDatePicker, {
      props: {
        modelValue: '2026-11-10',
        isDateUnavailable: (d: string) => d === '2026-11-15',
      },
      attachTo: document.body,
    })
    await w.get('[aria-label="Відкрити календар"]').trigger('click')
    await flush()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-label')).toBe('Оберіть дату')
    expect(dialog.querySelector('table')).not.toBeNull()
    expect(dialog.innerHTML).toContain('Оберіть дату, листопад 2026')
    const day = (iso: string) => dialog.querySelector(`[data-value="${iso}"]`) as HTMLElement
    expect(day('2026-11-15').hasAttribute('data-unavailable')).toBe(true)
    day('2026-11-20').click()
    await flush()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['2026-11-20'])
  })

  it('calendar=false — лише сегменти без кнопки календаря', () => {
    const w = mount(KDatePicker, { props: { calendar: false } })
    expect(w.find('[aria-label="Відкрити календар"]').exists()).toBe(false)
    expect(w.findAll('[data-reka-date-field-segment]').length).toBeGreaterThan(0)
  })
})

describe('KDateRangePicker', () => {
  it('пресети ставлять період одразу; підсумок для скрінрідера', async () => {
    const w = mount(KDateRangePicker, { props: { modelValue: null }, attachTo: document.body })
    await w.get('[aria-label="Відкрити календар"]').trigger('click')
    await flush()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-label')).toBe('Оберіть період')
    const preset = [...dialog.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Сьогодні'),
    )!
    preset.click()
    await flush()
    const value = w.emitted('update:modelValue')?.at(-1)?.[0] as { start: string; end: string }
    expect(value.start).toBe(value.end)
    await w.setProps({ modelValue: { start: '2026-11-01', end: '2026-11-24' } })
    expect(w.text()).toContain('З 1 листопада 2026')
  })

  it('confirm: зміни лише після «Застосувати»', async () => {
    const w = mount(KDateRangePicker, {
      props: {
        modelValue: null,
        confirm: true,
        presets: [{ label: 'Тест', value: { start: '2026-11-01', end: '2026-11-07' } }],
      },
      attachTo: document.body,
    })
    await w.get('[aria-label="Відкрити календар"]').trigger('click')
    await flush()
    const dialog = document.querySelector('[role="dialog"]')!
    ;[...dialog.querySelectorAll('button')].find((b) => b.textContent?.includes('Тест'))!.click()
    await flush()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    ;[...dialog.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Застосувати'))!
      .click()
    await flush()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([
      { start: '2026-11-01', end: '2026-11-07' },
    ])
  })
})
