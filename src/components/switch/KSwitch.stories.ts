import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KSwitch from './KSwitch.vue'

const meta = {
  title: 'Форми/KSwitch',
  component: KSwitch,
  args: {
    label: 'Режим відпустки',
    description: 'Посилки чекатимуть до 14 днів',
    modelValue: true,
    disabled: false,
  },
} satisfies Meta<typeof KSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Stany: Story = {
  name: 'Стани',
  render: () => ({
    components: { KSwitch },
    template: `<div class="k:grid k:gap-3"><KSwitch label="Сповіщення email" :model-value="true" /><KSwitch label="Вимкнено" /><KSwitch label="Налаштовує адміністратор" disabled :model-value="true" /></div>`,
  }),
}
