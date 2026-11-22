import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KTextarea from './KTextarea.vue'

const meta = {
  title: 'Форми/KTextarea',
  component: KTextarea,
  args: { placeholder: 'Зателефонуйте за 30 хвилин', maxlength: 200, showCount: true },
  render: (args) => ({
    components: { KField, KTextarea },
    setup: () => ({ args }),
    template: `<KField label="Коментар для відділення" optional class="k:max-w-md"><KTextarea v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
