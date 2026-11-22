import { Printer } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KTooltip from './KTooltip.vue'

const meta = {
  title: 'Оверлеї/KTooltip',
  component: KTooltip,
  args: { content: 'Друкувати етикетку', side: 'top', shortcut: ['mod', 'p'] },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] } },
  render: (args) => ({
    components: { KTooltip, KButton },
    setup: () => ({ args, Printer }),
    template: `<div class="k:p-12"><KTooltip v-bind="args"><KButton :leading-icon="Printer">Наведіть або сфокусуйте</KButton></KTooltip></div>`,
  }),
} satisfies Meta<typeof KTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
