import { LayoutGrid, Rows3 } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KToggleGroup from './KToggleGroup.vue'
import KToggleGroupItem from './KToggleGroupItem.vue'

const meta = {
  title: 'Дії/KToggleGroup',
  component: KToggleGroup,
  subcomponents: { KToggleGroupItem },
  args: {
    type: 'single',
    defaultValue: 'parcel',
    size: 'md',
    block: false,
    required: false,
    label: 'Тип відправлення',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { KToggleGroup, KToggleGroupItem },
    setup: () => ({ args }),
    template: `<KToggleGroup v-bind="args">
      <KToggleGroupItem value="docs">Документи</KToggleGroupItem>
      <KToggleGroupItem value="parcel">Посилка</KToggleGroupItem>
      <KToggleGroupItem value="cargo">Вантаж</KToggleGroupItem>
    </KToggleGroup>`,
  }),
} satisfies Meta<typeof KToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const NaVsiuShyrynu: Story = { name: 'На всю ширину', args: { block: true } }
export const Ikonky: Story = {
  name: 'Іконки',
  render: () => ({
    components: { KToggleGroup, KToggleGroupItem },
    setup: () => ({ Rows3, LayoutGrid }),
    template: `<KToggleGroup default-value="table" label="Вид" size="sm">
      <KToggleGroupItem value="table" :icon="Rows3" label="Таблиця" />
      <KToggleGroupItem value="cards" :icon="LayoutGrid" label="Картки" />
    </KToggleGroup>`,
  }),
}
