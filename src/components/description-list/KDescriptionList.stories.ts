import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KBadge from '../badge/KBadge.vue'
import KDescriptionItem from './KDescriptionItem.vue'
import KDescriptionList from './KDescriptionList.vue'

const meta = {
  title: 'Дані/KDescriptionList',
  component: KDescriptionList,
  subcomponents: { KDescriptionItem },
  args: {
    layout: 'stacked',
    columns: 3,
    size: 'md',
    divided: false,
    loading: false,
    items: [
      { label: 'Відправник', value: 'Ольга Ковальчук' },
      { label: 'Отримувач', value: 'Андрій Мельник' },
      { label: 'Телефон', value: '+380 50 765 43 21' },
      { label: 'Вага', value: '2,4 кг' },
      { label: 'Оголошена вартість', value: null },
      { label: 'Коментар', value: 'Крихке, не кантувати' },
    ],
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
    columns: { control: 'inline-radio', options: [1, 2, 3] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof KDescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Riadkamy: Story = {
  name: 'Рядками',
  render: () => ({
    components: { KDescriptionList, KDescriptionItem, KBadge },
    template: `<KDescriptionList layout="inline" divided size="sm" class="k:max-w-xl">
      <KDescriptionItem label="Номер" value="KT 1234 5678 5 UA" />
      <KDescriptionItem label="Статус"><KBadge tone="info">У дорозі</KBadge></KDescriptionItem>
      <KDescriptionItem label="Відділення" value="Львів, №14, вул. Соборна, 14" />
      <KDescriptionItem label="Післяплата" />
    </KDescriptionList>`,
  }),
}
export const Zavantazhennia: Story = { name: 'Завантаження', args: { loading: true } }
