import { ChevronDown } from '@lucide/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KField from '../field/KField.vue'
import KInput from '../input/KInput.vue'
import KCollapsible from './KCollapsible.vue'
import KCollapsibleContent from './KCollapsibleContent.vue'
import KCollapsibleTrigger from './KCollapsibleTrigger.vue'

const meta = {
  title: 'Навігація/KCollapsible',
  component: KCollapsible,
  subcomponents: { KCollapsibleTrigger, KCollapsibleContent },
  args: { defaultOpen: true, disabled: false },
  render: (args) => ({
    components: { KCollapsible, KCollapsibleTrigger, KCollapsibleContent, KButton, KField, KInput },
    setup: () => ({ args, ChevronDown }),
    template: `<KCollapsible v-bind="args" v-slot="{ open }" class="k:max-w-[28rem]">
      <KCollapsibleTrigger as-child><KButton variant="link" :trailing-icon="ChevronDown">{{ open ? 'Сховати додаткові параметри' : 'Додаткові параметри' }}</KButton></KCollapsibleTrigger>
      <KCollapsibleContent><div class="k:grid k:gap-3 k:pt-3"><KField label="Код ЄДРПОУ"><KInput /></KField></div></KCollapsibleContent>
    </KCollapsible>`,
  }),
} satisfies Meta<typeof KCollapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
