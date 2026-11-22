import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KPopover from './KPopover.vue'

const meta = {
  title: 'Оверлеї/KPopover',
  component: KPopover,
  args: { title: 'Розрахунок ціни', side: 'bottom', align: 'start', open: true },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => ({
    components: { KPopover, KButton },
    setup: () => ({ args }),
    template: `<div class="k:min-h-72"><KPopover v-bind="args">
      <template #trigger><KButton variant="link">Як рахується ціна?</KButton></template>
      <div class="kite-num k:grid k:gap-1.5 k:text-body-sm">
        <div class="k:flex k:justify-between k:gap-6"><span>Тариф «Стандарт»</span><span>80 ₴</span></div>
        <div class="k:flex k:justify-between k:gap-6"><span>Страхування 0,5 %</span><span>7 ₴</span></div>
        <div class="k:flex k:justify-between k:border-t k:border-line k:pt-2 k:font-bold"><span>Разом</span><span>87 ₴</span></div>
      </div>
    </KPopover></div>`,
  }),
} satisfies Meta<typeof KPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkrytyi: Story = { name: 'Відкритий' }
