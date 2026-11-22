import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KBadge from '../badge/KBadge.vue'
import KButton from '../button/KButton.vue'
import KCard from './KCard.vue'
import KCardContent from './KCardContent.vue'
import KCardFooter from './KCardFooter.vue'
import KCardHeader from './KCardHeader.vue'

const meta = {
  title: 'Основи/KCard',
  component: KCard,
  subcomponents: { KCardHeader, KCardContent, KCardFooter },
  args: { variant: 'outline', padding: 'md', divided: false, interactive: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated', 'subtle'] },
    padding: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => ({
    components: { KCard, KCardHeader, KCardContent, KCardFooter, KBadge, KButton },
    setup: () => ({ args }),
    template: `<KCard v-bind="args" class="k:max-w-md">
      <KCardHeader title="KT 1234 5678 5 UA" description="Київ → Львів · 2,4 кг" />
      <KCardContent><KBadge tone="success">Можна забирати</KBadge></KCardContent>
      <KCardFooter><KButton size="sm">Деталі</KButton><KButton size="sm" variant="primary">Переадресувати</KButton></KCardFooter>
    </KCard>`,
  }),
} satisfies Meta<typeof KCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
