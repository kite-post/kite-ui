import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KAvatar from './KAvatar.vue'

const meta = {
  title: 'Основи/KAvatar',
  component: KAvatar,
  args: { name: 'Ольга Ковальчук', size: 'md', shape: 'circle', decorative: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof KAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KAvatar },
    template: `<div class="k:flex k:flex-wrap k:items-center k:gap-3">
      <KAvatar name="Ольга Ковальчук" size="sm" /><KAvatar name="Андрій Мельник" /><KAvatar name="Ірина Петренко" size="lg" />
      <KAvatar name="ТОВ Квітка" shape="square" size="lg" /><KAvatar /><KAvatar name="Тарас Бондар" size="lg" />
    </div>`,
  }),
}
