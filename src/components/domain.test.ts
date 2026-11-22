import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import KConfigProvider from '../config/KConfigProvider.vue'
import { expectNoA11yViolations } from '../test-utils/a11y'
import KAppShell from './app-shell/KAppShell.vue'
import KAppShellPageHeader from './app-shell/KAppShellPageHeader.vue'
import KCommandPalette from './command-palette/KCommandPalette.vue'
import type { CommandSource } from './command-palette/types'
import KDataTable from './data-table/KDataTable.vue'
import type { DataTableColumn } from './data-table/types'
import KField from './field/KField.vue'
import KParcelStatus from './parcel-status/KParcelStatus.vue'
import { parcelStatusMeta } from './parcel-status/meta'
import KPhoneInput from './phone-input/KPhoneInput.vue'
import KSidebar from './sidebar/KSidebar.vue'
import KTable from './table/KTable.vue'
import KTableBody from './table/KTableBody.vue'
import KTableCell from './table/KTableCell.vue'
import KTableHead from './table/KTableHead.vue'
import KTableHeader from './table/KTableHeader.vue'
import KTableRow from './table/KTableRow.vue'
import KTimeline from './timeline/KTimeline.vue'
import KTrackingNumberInput from './tracking-number-input/KTrackingNumberInput.vue'
import KTrackingNumber from './tracking-number/KTrackingNumber.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('KPhoneInput', () => {
  it('+380 і 9 цифр групами, E.164 у v-model, неповний — null', async () => {
    const w = mount(
      {
        components: { KField, KPhoneInput },
        setup: () => ({ v: ref<string | null>(null) }),
        template: `<KField label="Телефон"><KPhoneInput v-model="v" /></KField>`,
      },
      { attachTo: document.body },
    )
    const input = w.get('input')
    expect(input.attributes('type')).toBe('tel')
    expect(input.attributes('autocomplete')).toBe('tel-national')
    await input.setValue('+38 (067) 123-45-67')
    expect((input.element as HTMLInputElement).value).toBe('67 123 45 67')
    expect((w.vm as unknown as { v: string }).v).toBe('+380671234567')
    await input.setValue('067 12')
    expect((w.vm as unknown as { v: string | null }).v).toBeNull()
    const described = input.attributes('aria-describedby')!.split(' ')
    expect(described.some((id) => w.find(`#${id}`).text() === 'Номер після +380')).toBe(true)
    await expectNoA11yViolations(w.element)
  })

  it('validity на blur: incomplete, invalid-operator, valid', async () => {
    const w = mount(KPhoneInput)
    const input = w.get('input')
    await input.setValue('67 12')
    await input.trigger('blur')
    expect(w.emitted('validity')?.at(-1)).toEqual(['incomplete'])
    await input.setValue('44 123 45 67')
    expect(w.emitted('validity')?.at(-1)).toEqual(['invalid-operator'])
    await input.setValue('67 123 45 67')
    expect(w.emitted('validity')?.at(-1)).toEqual(['valid'])
  })
})

describe('KTrackingNumberInput', () => {
  it('групує, відкидає неприпустимі символи, перевіряє контрольну цифру', async () => {
    const w = mount(KTrackingNumberInput, { attachTo: document.body })
    const input = w.get('input')
    expect(input.attributes('autocapitalize')).toBe('characters')
    await input.setValue('kt-1234 56785ua')
    expect((input.element as HTMLInputElement).value).toBe('KT 1234 5678 5 UA')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['KT123456785UA'])
    expect(w.emitted('validity')?.at(-1)).toEqual(['valid'])
    expect(w.emitted('complete')?.at(-1)).toEqual(['KT123456785UA'])
    expect(w.find('[aria-label="Номер правильний"]').exists()).toBe(true)
    await input.setValue('KT123456784UA')
    expect(w.emitted('validity')?.at(-1)).toEqual(['bad-check-digit'])
  })

  it('вставка тексту витягує номер; кнопка «Сканувати»', async () => {
    const w = mount(KTrackingNumberInput, { props: { scan: true } })
    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'Ваша посилка KT123456785UA прямує до Львова' },
    })
    w.get('input').element.dispatchEvent(event)
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['KT123456785UA'])
    await w.get('[aria-label="Сканувати"]').trigger('click')
    expect(w.emitted('scan')).toHaveLength(1)
  })
})

describe('KTrackingNumber', () => {
  it('групи візуально, посимвольно для скрінрідера, копіювання без пробілів', async () => {
    const w = mount(KTrackingNumber, { props: { value: 'KT123456785UA' }, attachTo: document.body })
    expect(w.get('[aria-hidden="true"]').text().replace(/\s/g, '')).toBe('KT123456785UA')
    expect(w.get('.k\\:sr-only').text()).toBe('K T, 1 2 3 4, 5 6 7 8, 5, U A')
    expect(w.find('[aria-label="Копіювати номер"]').exists()).toBe(true)
    await expectNoA11yViolations(w.element)
  })

  it('посилання з назвою «Відправлення …»', () => {
    const w = mount(KTrackingNumber, {
      props: { value: 'KT123456785UA', href: '/p/1', copyable: false },
    })
    expect(w.get('a').attributes('aria-label')).toBe('Відправлення KT 1234 5678 5 UA')
  })
})

describe('KParcelStatus', () => {
  it('клієнтський текст з підстановкою або коротка форма', async () => {
    const a = mount(KParcelStatus, {
      props: { status: 'IN_TRANSIT', params: { city: 'Львова' } },
      attachTo: document.body,
    })
    expect(a.text()).toBe('Їде до Львова')
    expect(a.attributes('data-tone')).toBe('info')
    expect(mount(KParcelStatus, { props: { status: 'IN_TRANSIT' } }).text()).toBe('У дорозі')
    expect(
      mount(KParcelStatus, { props: { status: 'READY_FOR_PICKUP', partial: true } }).text(),
    ).toBe('Можна забирати · частково')
    expect(mount(KParcelStatus, { props: { status: 'SORTED', audience: 'staff' } }).text()).toBe(
      'Відсортовано',
    )
    await expectNoA11yViolations(a.element)
  })

  it('невідомий стан — neutral з кодом і попередженням', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(KParcelStatus, { props: { status: 'TELEPORTED' } })
    expect(w.text()).toBe('TELEPORTED')
    expect(warn).toHaveBeenCalled()
    expect(parcelStatusMeta('LOST').tone).toBe('danger')
    warn.mockRestore()
  })
})

describe('KTimeline', () => {
  const now = Date.now()
  const items = [
    { id: '1', title: 'Прийнято', time: new Date(now - 3_600_000 * 30).toISOString() },
    {
      id: '2',
      title: 'Можна забирати',
      time: new Date(now - 60_000).toISOString(),
      state: 'current' as const,
      tone: 'success' as const,
    },
    {
      id: '3',
      title: 'Отримання',
      time: new Date(now + 86_400_000).toISOString(),
      state: 'future' as const,
    },
  ]

  it('<ol> з <time>, поточна — aria-current="step", майбутня — «Очікується:»', async () => {
    const w = mount(KTimeline, { props: { items }, attachTo: document.body })
    expect(w.findAll('ol > li')).toHaveLength(3)
    expect(w.findAll('time')).toHaveLength(3)
    expect(w.get('[aria-current="step"]').text()).toContain('Можна забирати')
    expect(w.get('li[data-state="future"]').text()).toContain('Очікується:')
    expect(w.text()).toContain('Сьогодні')
    await expectNoA11yViolations(w.element)
  })

  it('collapsible: «Показати всі (n)»; порожній і loading', async () => {
    const w = mount(KTimeline, { props: { items, collapsible: 1, groupByDay: false } })
    expect(w.findAll('li[data-event]')).toHaveLength(1)
    await w.get('button').trigger('click')
    expect(w.findAll('li[data-event]')).toHaveLength(3)
    expect(mount(KTimeline, { props: { items: [] } }).text()).toBe('Подій ще немає')
    expect(
      mount(KTimeline, { props: { items: [], loading: true } })
        .find('[aria-busy="true"]')
        .exists(),
    ).toBe(true)
  })
})

describe('KSidebar', () => {
  it('nav з назвою, групи, aria-current, лічильник з контекстом, згортання', async () => {
    localStorage.removeItem('kite-sidebar')
    const w = mount(
      {
        components: { KConfigProvider, KSidebar },
        setup: () => ({
          collapsed: ref(false),
          items: [
            {
              label: 'Операції',
              items: [
                {
                  label: 'Прийом',
                  href: '#a',
                  active: true,
                  count: 12,
                  countLabel: 'очікують прийому',
                },
                { label: 'Рейси', href: '#b' },
              ],
            },
          ],
        }),
        template: `<KConfigProvider><KSidebar v-model:collapsed="collapsed" :items="items" /></KConfigProvider>`,
      },
      { attachTo: document.body },
    )
    expect(w.get('nav').attributes('aria-label')).toBe('Основна навігація')
    expect(w.get('a[aria-current="page"]').text()).toContain('Прийом')
    expect(w.text()).toContain('12 очікують прийому')
    const toggle = w.get('button[aria-expanded]:not([id])')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    await expectNoA11yViolations(w.element)
    await toggle.trigger('click')
    expect((w.vm as unknown as { collapsed: boolean }).collapsed).toBe(true)
    expect(localStorage.getItem('kite-sidebar')).toBe('collapsed')
  })
})

describe('KAppShell', () => {
  it('skip-link, banner, main#main, заголовок сторінки й document.title', async () => {
    const w = mount(
      {
        components: { KConfigProvider, KAppShell, KAppShellPageHeader },
        template: `<KConfigProvider><KAppShell app-name="Kite Ops">
          <template #header-start>Хаб Київ</template>
          <KAppShellPageHeader title="Прийом" description="Посилки на прийом" />
        </KAppShell></KConfigProvider>`,
      },
      { attachTo: document.body },
    )
    expect(w.get('a[href="#main"]').text()).toBe('Перейти до вмісту')
    expect(w.find('header').exists()).toBe(true)
    expect(w.get('main').attributes('id')).toBe('main')
    expect(w.get('h1').text()).toBe('Прийом')
    expect(document.title).toBe('Прийом · Kite Ops')
    await expectNoA11yViolations(w.element)
  })
})

describe('KCommandPalette', () => {
  const pages: CommandSource = {
    id: 'pages',
    label: 'Розділи',
    search: (q) =>
      ['Прийом', 'Рейси']
        .filter((p) => p.includes(q))
        .map((p) => ({ id: p, label: p, onSelect: vi.fn() })),
  }

  it('діалог з назвою, combobox, групи; номер накладної → «Відкрити …»', async () => {
    const openShipment = vi.fn()
    const w = mount(KCommandPalette, {
      props: { open: true, sources: [pages], debounce: 0, openShipment },
      attachTo: document.body,
    })
    await flush()
    await flush()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog.textContent).toContain('Командна палітра')
    const input = dialog.querySelector('input')!
    expect(input.getAttribute('role')).toBe('combobox')
    expect(dialog.textContent).toContain('Розділи')
    input.value = 'kt 1234 5678 5 ua'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    await flush()
    const first = dialog.querySelector('[role="option"]') as HTMLElement
    expect(first.textContent).toContain('Відкрити KT 1234 5678 5 UA')
    first.click()
    await flush()
    expect(openShipment).toHaveBeenCalledWith('KT123456785UA')
    w.unmount()
  })
})

describe('KTable', () => {
  it('нативна таблиця, caption, th scope, region з tabindex', async () => {
    const w = mount(
      {
        components: { KTable, KTableHeader, KTableBody, KTableRow, KTableHead, KTableCell },
        template: `<KTable caption="Тарифи">
          <KTableHeader><tr><KTableHead>Вага</KTableHead><KTableHead numeric>Ціна</KTableHead></tr></KTableHeader>
          <KTableBody><KTableRow><KTableCell row-header>до 2 кг</KTableCell><KTableCell numeric>65 ₴</KTableCell></KTableRow></KTableBody>
        </KTable>`,
      },
      { attachTo: document.body },
    )
    const region = w.get('[role="region"]')
    expect(region.attributes('tabindex')).toBe('0')
    expect(region.attributes('aria-labelledby')).toBe(w.get('caption').attributes('id'))
    expect(w.get('th[scope="col"]').text()).toBe('Вага')
    expect(w.get('th[scope="row"]').text()).toBe('до 2 кг')
    await expectNoA11yViolations(w.element)
  })
})

describe('KDataTable', () => {
  interface Row {
    id: string
    number: string
    city: string
    weight: number
  }
  const rows: Row[] = Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    number: `KT${String(i).padStart(9, '0')}UA`,
    city: i % 3 === 0 ? 'Львів' : 'Київ',
    weight: (i * 7) % 20,
  }))
  const columns: DataTableColumn<Row>[] = [
    { id: 'number', header: 'Номер', sortable: true },
    {
      id: 'city',
      header: 'Місто',
      filter: {
        type: 'select',
        multiple: true,
        options: [
          { value: 'Львів', label: 'Львів' },
          { value: 'Київ', label: 'Київ' },
        ],
      },
    },
    {
      id: 'weight',
      header: 'Вага',
      numeric: true,
      sortable: true,
      hideable: true,
      cell: ({ value }) => h('b', String(value)),
    },
  ]
  const make = (props: Record<string, unknown> = {}) =>
    mount(KDataTable, {
      props: {
        label: 'Відправлення',
        columns,
        rows,
        selection: 'multiple',
        pageSize: 10,
        ...props,
      } as never,
      attachTo: document.body,
    })

  it('таблиця з назвою, сортування ↑ → ↓ з aria-sort, рендер cell', async () => {
    const w = make()
    expect(w.get('[role="region"]').attributes('aria-label')).toBe('Відправлення')
    const th = w.findAll('th').find((t) => t.text().includes('Вага'))!
    expect(th.attributes('aria-sort')).toBe('none')
    await th.get('button').trigger('click')
    expect(w.emitted('update:sorting')?.at(-1)).toEqual([[{ id: 'weight', desc: false }]])
    await w.setProps({ sorting: [{ id: 'weight', desc: false }] } as never)
    expect(th.attributes('aria-sort')).toBe('ascending')
    expect(w.find('tbody b').exists()).toBe(true)
    expect(w.findAll('tbody tr')).toHaveLength(10)
    await expectNoA11yViolations(w.element)
  })

  it('пошук і фільтр client-режиму; порожній результат — «Нічого не знайшли»', async () => {
    const w = make()
    await w.setProps({ filters: { city: ['Львів'] } } as never)
    expect(w.findAll('tbody tr').every((tr) => tr.text().includes('Львів'))).toBe(true)
    expect(w.text()).toContain('Місто: Львів')
    await w.setProps({ search: 'немає такого' } as never)
    expect(w.text()).toContain('Нічого не знайшли')
  })

  it('вибір: чекбокс рядка, «обрати всі на сторінці» mixed, панель масових дій', async () => {
    const w = make({ selected: [] })
    const boxes = w.findAll('tbody [role="checkbox"]')
    await boxes[0]!.trigger('click')
    const sel = w.emitted('update:selected')?.at(-1)?.[0] as string[]
    expect(sel).toEqual(['1'])
    await w.setProps({ selected: sel } as never)
    expect(w.get('thead [role="checkbox"]').attributes('aria-checked')).toBe('mixed')
    expect(w.text()).toContain('Обрано: 1')
    expect(w.find('tbody tr[data-selected]').exists()).toBe(true)
  })

  it('стани: перше завантаження — скелетони, помилка — «Спробувати ще»', async () => {
    const w = make({ rows: [], loading: true })
    expect(w.findAll('.kite-skeleton').length).toBeGreaterThan(0)
    await w.setProps({ loading: false, error: 'Сервер не відповідає' } as never)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Спробувати ще')!
      .trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
  })
})
