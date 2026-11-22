import { ChevronDown, Printer } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KDropdownMenu from '../dropdown-menu/KDropdownMenu.vue'
import KIconButton from '../icon-button/KIconButton.vue'
import KButtonGroup from './KButtonGroup.vue'

const meta = {
  title: 'Дії/KButtonGroup',
  component: KButtonGroup,
  args: { variant: 'secondary', size: 'md', orientation: 'horizontal', label: 'Друк етикетки' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => ({
    components: { KButtonGroup, KButton, KIconButton, KDropdownMenu },
    setup: () => ({ args, ChevronDown, Printer }),
    template: `<KButtonGroup v-bind="args">
      <KButton :leading-icon="Printer">Друкувати етикетку</KButton>
      <KDropdownMenu :items="[{ label: 'A6' }, { label: 'A4' }, { label: 'ZPL' }]">
        <template #trigger><KIconButton :icon="ChevronDown" label="Інші варіанти" :tooltip="false" /></template>
      </KDropdownMenu>
    </KButtonGroup>`,
  }),
} satisfies Meta<typeof KButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const SplitKnopka: Story = { name: 'Split-кнопка' }
export const Osnovna: Story = { name: 'Основна', args: { variant: 'primary' } }
export const Tulbar: Story = {
  name: 'Тулбар',
  render: () => ({
    components: { KButtonGroup, KButton },
    template: `<KButtonGroup size="sm" label="Тулбар"><KButton>Друк</KButton><KButton>Експорт</KButton><KButton disabled>Архів</KButton></KButtonGroup>`,
  }),
}
