import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KAccordion from './KAccordion.vue'
import KAccordionItem from './KAccordionItem.vue'

const meta = {
  title: 'Навігація/KAccordion',
  component: KAccordion,
  subcomponents: { KAccordionItem },
  args: {
    type: 'single',
    defaultValue: 'when',
    variant: 'divided',
    collapsible: true,
    headingLevel: 3,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['divided', 'cards'] },
  },
  render: (args) => ({
    components: { KAccordion, KAccordionItem },
    setup: () => ({ args }),
    template: `<KAccordion v-bind="args" class="k:max-w-xl">
      <KAccordionItem value="when" title="Коли прийде посилка?">Зазвичай за 1–2 дні між обласними центрами.</KAccordionItem>
      <KAccordionItem value="where" title="Як змінити відділення?">Відкрийте відправлення і натисніть «Переадресувати».</KAccordionItem>
      <KAccordionItem value="pay" title="Як оплатити післяплату?" disabled>Карткою у відділенні або в застосунку.</KAccordionItem>
    </KAccordion>`,
  }),
} satisfies Meta<typeof KAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Kartky: Story = {
  name: 'Картки',
  args: { variant: 'cards', type: 'multiple', defaultValue: ['when', 'where'] },
}
