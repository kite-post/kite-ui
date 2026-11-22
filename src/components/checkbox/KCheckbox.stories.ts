import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KCheckbox from './KCheckbox.vue'
import KCheckboxGroup from './KCheckboxGroup.vue'

const meta = {
  title: 'Форми/KCheckbox',
  component: KCheckbox,
  subcomponents: { KCheckboxGroup },
  args: {
    label: 'Застрахувати посилку',
    description: '0,5 % від оголошеної вартості — 7 ₴',
    modelValue: true,
    size: 'md',
    disabled: false,
    invalid: false,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof KCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Hrupa: Story = {
  name: 'Група',
  render: () => ({
    components: { KCheckboxGroup, KCheckbox },
    template: `<div class="k:grid k:gap-6">
      <KCheckboxGroup label="Куди надсилати сповіщення" :model-value="['push']" hint="Хоча б один канал"
        :options="[{ value: 'push', label: 'Push у застосунку' }, { value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS', disabled: true }]" />
      <div class="k:grid k:gap-2"><KCheckbox model-value="indeterminate" label="Обрати всі на сторінці" /><KCheckbox label="Вимкнено" disabled /><KCheckbox label="Помилка" invalid /></div>
    </div>`,
  }),
}
