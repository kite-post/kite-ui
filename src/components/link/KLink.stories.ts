import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KLink from './KLink.vue'

const meta = {
  title: 'Дії/KLink',
  component: KLink,
  args: { href: '#', variant: 'inline', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inline', 'standalone', 'subtle'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => ({
    components: { KLink },
    setup: () => ({ args }),
    template: `<KLink v-bind="args">Умови доставки</KLink>`,
  }),
} satisfies Meta<typeof KLink>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const UTeksti: Story = {
  name: 'У тексті',
  render: () => ({
    components: { KLink },
    template: `<p class="k:m-0 k:max-w-prose">Посилка чекає 5 днів. <KLink href="#">Детальніше про зберігання</KLink> і повернення.
      <KLink href="https://docs.example.com">Документація API</KLink> відкривається в новій вкладці.</p>
      <p class="k:flex k:gap-4"><KLink href="#" variant="standalone">Усі відправлення</KLink><KLink href="#" variant="subtle">Умови використання</KLink></p>`,
  }),
}
