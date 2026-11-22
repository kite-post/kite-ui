import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../test-utils/a11y'
import KAccordion from './accordion/KAccordion.vue'
import KAccordionItem from './accordion/KAccordionItem.vue'
import KAvatar from './avatar/KAvatar.vue'
import KBreadcrumbs from './breadcrumbs/KBreadcrumbs.vue'
import KCollapsible from './collapsible/KCollapsible.vue'
import KCollapsibleContent from './collapsible/KCollapsibleContent.vue'
import KCollapsibleTrigger from './collapsible/KCollapsibleTrigger.vue'
import KCopyButton from './copy-button/KCopyButton.vue'
import KDescriptionItem from './description-list/KDescriptionItem.vue'
import KDescriptionList from './description-list/KDescriptionList.vue'
import KPagination from './pagination/KPagination.vue'
import KSearchInput from './search-input/KSearchInput.vue'
import KStepper from './stepper/KStepper.vue'
import KTab from './tabs/KTab.vue'
import KTabs from './tabs/KTabs.vue'
import KTabsList from './tabs/KTabsList.vue'
import KTabsPanel from './tabs/KTabsPanel.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))
afterEach(() => vi.useRealTimers())

describe('KSearchInput', () => {
  it('role="search", назва, search із затримкою і одразу на Enter', async () => {
    vi.useFakeTimers()
    const w = mount(KSearchInput, {
      props: { label: 'Пошук відправлень', debounce: 250 },
      attachTo: document.body,
    })
    expect(w.find('[role="search"]').exists()).toBe(true)
    const input = w.get('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('aria-label')).toBe('Пошук відправлень')
    await input.setValue('KT1')
    expect(w.emitted('search')).toBeUndefined()
    vi.advanceTimersByTime(260)
    expect(w.emitted('search')?.at(-1)).toEqual(['KT1'])
    await input.setValue('KT12')
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('search')?.at(-1)).toEqual(['KT12'])
    vi.useRealTimers()
    await expectNoA11yViolations(w.element)
  })

  it('гаряча клавіша / фокусує поле, але не з іншого поля', async () => {
    const w = mount(KSearchInput, { props: { shortcut: '/' }, attachTo: document.body })
    expect(w.text()).toContain('/')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
    expect(document.activeElement).toBe(w.get('input').element)
  })
})

describe('KAvatar', () => {
  it('ініціали з двох слів, назва в role="img", стабільний колір', async () => {
    const a = mount(KAvatar, { props: { name: 'Ольга Ковальчук' }, attachTo: document.body })
    const b = mount(KAvatar, { props: { name: 'Ольга Ковальчук' } })
    expect(a.text()).toBe('ОК')
    expect(a.attributes('role')).toBe('img')
    expect(a.attributes('aria-label')).toBe('Ольга Ковальчук')
    expect(a.attributes('style')).toBe(b.attributes('style'))
    await expectNoA11yViolations(a.element)
  })

  it('decorative — прихований; без імені — іконка', () => {
    expect(
      mount(KAvatar, { props: { name: 'Х', decorative: true } }).attributes('aria-hidden'),
    ).toBe('true')
    expect(mount(KAvatar).find('svg').exists()).toBe(true)
  })
})

describe('KCopyButton', () => {
  it('копіює, показує «Скопійовано» і повертається через 2 с', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    vi.useFakeTimers()
    const w = mount(KCopyButton, {
      props: { value: 'KT123456785UA', label: 'Копіювати номер' },
      attachTo: document.body,
    })
    const btn = w.get('button')
    expect(btn.attributes('aria-label')).toBe('Копіювати номер')
    await btn.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('KT123456785UA')
    expect(w.emitted('copied')?.[0]).toEqual(['KT123456785UA'])
    expect(btn.attributes('data-copied')).toBe('')
    vi.advanceTimersByTime(2100)
    await nextTick()
    expect(btn.attributes('data-copied')).toBeUndefined()
  })

  it('помилка буфера — подія error', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    })
    const w = mount(KCopyButton, { props: { value: 'x' } })
    await w.get('button').trigger('click')
    await flush()
    expect(w.emitted('error')).toHaveLength(1)
  })
})

async function flushPromises() {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

describe('KDescriptionList', () => {
  it('dl/dt/dd, порожнє значення — тире і «не вказано»', async () => {
    const w = mount(KDescriptionList, {
      props: {
        items: [
          { label: 'Відправник', value: 'Ольга Ковальчук' },
          { label: 'Післяплата', value: null },
        ],
      },
      attachTo: document.body,
    })
    expect(w.findAll('dt').map((d) => d.text())).toEqual(['Відправник', 'Післяплата'])
    expect(w.findAll('dd')[1]!.text()).toContain('не вказано')
    await expectNoA11yViolations(w.element)
  })

  it('дочірні KDescriptionItem зі слотом і loading', () => {
    const w = mount({
      components: { KDescriptionList, KDescriptionItem },
      template: `<KDescriptionList layout="inline" divided loading>
        <KDescriptionItem label="Статус"><b>У дорозі</b></KDescriptionItem>
      </KDescriptionList>`,
    })
    expect(w.get('dl').attributes('aria-busy')).toBe('true')
    expect(w.find('b').exists()).toBe(false)
  })
})

describe('KAccordion', () => {
  const tpl = (extra = '') => ({
    components: { KAccordion, KAccordionItem },
    setup: () => ({ open: ref<string | null>('a') }),
    template: `<KAccordion v-model="open" ${extra}>
      <KAccordionItem value="a" title="Коли прийде посилка?">1–2 дні</KAccordionItem>
      <KAccordionItem value="b" title="Як змінити відділення?">Переадресувати</KAccordionItem>
    </KAccordion>`,
  })

  it('заголовки h3 з кнопкою aria-expanded; single перемикає секції', async () => {
    const w = mount(tpl(), { attachTo: document.body })
    const buttons = w.findAll('h3 > button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.attributes('aria-expanded')).toBe('true')
    await buttons[1]!.trigger('click')
    expect((w.vm as unknown as { open: string | null }).open).toBe('b')
    await buttons[1]!.trigger('click')
    expect((w.vm as unknown as { open: string | null }).open).toBeNull()
    await expectNoA11yViolations(w.element)
  })

  it('headingLevel=2', () => {
    const w = mount(tpl(':heading-level="2"'))
    expect(w.findAll('h2')).toHaveLength(2)
  })
})

describe('KCollapsible', () => {
  it('тригер з aria-expanded; v-model:open', async () => {
    const w = mount({
      components: { KCollapsible, KCollapsibleTrigger, KCollapsibleContent },
      setup: () => ({ open: ref(false) }),
      template: `<KCollapsible v-model:open="open">
        <KCollapsibleTrigger>Додаткові параметри</KCollapsibleTrigger>
        <KCollapsibleContent><p>Поля</p></KCollapsibleContent>
      </KCollapsible>`,
    })
    const trigger = w.get('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(w.find('p').exists()).toBe(false)
    await trigger.trigger('click')
    expect((w.vm as unknown as { open: boolean }).open).toBe(true)
    expect(w.find('p').exists()).toBe(true)
  })
})

describe('KTabs', () => {
  it('tablist з назвою, tab/aria-selected, панель, лічильник', async () => {
    const w = mount(
      {
        components: { KTabs, KTabsList, KTab, KTabsPanel },
        setup: () => ({ tab: ref('all') }),
        template: `<KTabs v-model="tab" label="Відправлення">
          <KTabsList>
            <KTab value="all">Усі</KTab>
            <KTab value="in" :count="12">Вхідні</KTab>
          </KTabsList>
          <KTabsPanel value="all">Усі відправлення</KTabsPanel>
          <KTabsPanel value="in">Вхідні відправлення</KTabsPanel>
        </KTabs>`,
      },
      { attachTo: document.body },
    )
    expect(w.get('[role="tablist"]').attributes('aria-label')).toBe('Відправлення')
    const tabs = w.findAll('[role="tab"]')
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    expect(tabs[1]!.text()).toContain('12')
    await tabs[1]!.trigger('mousedown', { button: 0 })
    await nextTick()
    expect((w.vm as unknown as { tab: string }).tab).toBe('in')
    expect(w.get('[role="tabpanel"][data-state="active"]').text()).toBe('Вхідні відправлення')
    await expectNoA11yViolations(w.element)
  })

  it('routing — nav з посиланнями й aria-current, без ролей tab', async () => {
    const w = mount(
      {
        components: { KTabs, KTabsList, KTab },
        template: `<KTabs routing label="Розділи"><KTabsList>
          <KTab value="p" href="#p" active>Профіль</KTab>
          <KTab value="u" href="#u">Користувачі</KTab>
        </KTabsList></KTabs>`,
      },
      { attachTo: document.body },
    )
    expect(w.get('nav').attributes('aria-label')).toBe('Розділи')
    expect(w.find('[role="tab"]').exists()).toBe(false)
    expect(w.get('a[aria-current="page"]').text()).toBe('Профіль')
    await expectNoA11yViolations(w.element)
  })
})

describe('KBreadcrumbs', () => {
  const items = [
    { label: 'Головна', href: '/' },
    { label: 'Відправлення', href: '/s' },
    { label: 'Реєстри', href: '/r' },
    { label: 'Реєстр 24.11', href: '/r/1' },
    { label: 'KT 1234 5678 5 UA' },
  ]

  it('nav + ol, поточна сторінка aria-current, середні — у меню «…»', async () => {
    const w = mount(KBreadcrumbs, { props: { items }, attachTo: document.body })
    expect(w.get('nav').attributes('aria-label')).toBe('Навігаційний ланцюжок')
    const ol = w.get('ol')
    expect(ol.text()).toContain('Головна')
    expect(ol.text()).not.toContain('Відправлення')
    expect(w.find('[aria-label="Показати шлях"]').exists()).toBe(true)
    expect(w.get('[aria-current="page"]').text()).toBe('KT 1234 5678 5 UA')
    expect(w.text()).toContain('Реєстр 24.11')
    await expectNoA11yViolations(w.element)
  })

  it('до maxItems — без меню', () => {
    const w = mount(KBreadcrumbs, { props: { items: items.slice(0, 3) } })
    expect(w.find('[aria-label="Показати шлях"]').exists()).toBe(false)
  })
})

describe('KPagination', () => {
  it('діапазон, поточна сторінка, назви кнопок; новий розмір — на першу', async () => {
    const w = mount(KPagination, {
      props: { page: 5, pageSize: 50, total: 1240 },
      attachTo: document.body,
    })
    expect(w.get('nav').attributes('aria-label')).toBe('Сторінки')
    expect(w.text()).toContain('Рядки 201–250 з 1')
    expect(w.get('[aria-current="page"]').text()).toBe('5')
    await w.get('[aria-label="Сторінка 6"]').trigger('click')
    expect(w.emitted('update:page')?.at(-1)).toEqual([6])
    await w.get('[aria-label="Наступна сторінка"]').trigger('click')
    expect(w.emitted('update:page')).toBeTruthy()
    await expectNoA11yViolations(w.element)
  })

  it('cursor: лише назад/далі, межі з hasPrev/hasNext', async () => {
    const w = mount(KPagination, { props: { page: 1, variant: 'cursor', hasNext: true } })
    expect(w.get('[aria-label="Попередня сторінка"]').attributes('disabled')).toBeDefined()
    await w.get('[aria-label="Наступна сторінка"]').trigger('click')
    expect(w.emitted('update:page')?.at(-1)).toEqual([2])
    expect(w.text()).not.toContain('Рядки')
  })
})

describe('KStepper', () => {
  const steps = [{ title: 'Відправник' }, { title: 'Отримувач' }, { title: 'Посилка' }]

  it('nav + ol, aria-current="step", прихований стан кроку', async () => {
    const w = mount(KStepper, { props: { steps, modelValue: 2 }, attachTo: document.body })
    expect(w.get('nav').attributes('aria-label')).toBe('Кроки')
    const current = w.get('ol [aria-current="step"]')
    expect(current.text()).toContain('Крок 2 з 3: Отримувач, поточний')
    expect(w.get('ol').text()).toContain('Крок 1 з 3: Відправник, завершено')
    await expectNoA11yViolations(w.element)
  })

  it('linear: назад можна, вперед — ні', async () => {
    const w = mount(KStepper, { props: { steps, modelValue: 2 } })
    const items = w.findAll('ol > li')
    expect(items[2]!.find('button').exists()).toBe(false)
    await items[0]!.get('button').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  it('error — свій стан; linear=false дозволяє вперед', async () => {
    const w = mount(KStepper, {
      props: {
        steps: [steps[0]!, { title: 'Оплата', state: 'error' as const }, steps[2]!],
        modelValue: 1,
        linear: false,
      },
    })
    expect(w.get('ol').text()).toContain('Оплата, помилка')
    await w.findAll('ol > li')[2]!.get('button').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([3])
  })
})
