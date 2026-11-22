import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KSeparator from './KSeparator.vue'

const meta = {
  title: 'Основи/KSeparator',
  component: KSeparator,
  render: (args) => ({
    components: { KSeparator },
    setup: () => ({ args }),
    template: `<div class="k:grid k:gap-3 k:max-w-md"><span>Адреса</span><KSeparator v-bind="args" /><span>Отримувач</span>
      <div class="k:flex k:h-6 k:items-center k:gap-3"><span>Київ</span><KSeparator orientation="vertical" /><span>Львів</span></div></div>`,
  }),
} satisfies Meta<typeof KSeparator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
