import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KKbd from './KKbd.vue'

const meta = {
  title: 'Основи/KKbd',
  component: KKbd,
  args: { keys: ['mod', 'k'], size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof KKbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Kombinatsii: Story = {
  name: 'Комбінації',
  render: () => ({
    components: { KKbd },
    template: `<div class="k:flex k:flex-wrap k:gap-3"><KKbd :keys="['mod','k']" /><KKbd :keys="['shift','enter']" /><KKbd :keys="['/']" /><KKbd :keys="['alt','↓']" size="md" /></div>`,
  }),
}
