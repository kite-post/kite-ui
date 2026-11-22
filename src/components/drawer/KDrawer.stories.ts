import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KDrawer from './KDrawer.vue'

const meta = {
  title: 'Оверлеї/KDrawer',
  component: KDrawer,
  args: {
    open: true,
    title: 'Відділення №12',
    description: 'Львів, вул. Городоцька, 10 · 8:00–20:00',
  },
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  render: (args) => ({
    components: { KDrawer, KButton },
    setup: () => ({ args }),
    template: `<div class="k:min-h-[36rem]"><KDrawer v-bind="args">
      <div class="k:grid k:gap-3 k:p-4"><p class="k:m-0 k:text-body-sm k:text-fg-muted">Можна забрати посилку до 28 листопада.</p><KButton variant="primary" block>Прокласти маршрут</KButton></div>
    </KDrawer></div>`,
  }),
} satisfies Meta<typeof KDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkrytyi: Story = { name: 'Відкритий' }
