import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KDialogBody from '../dialog/KDialogBody.vue'
import KDialogFooter from '../dialog/KDialogFooter.vue'
import KSheet from './KSheet.vue'

const meta = {
  title: 'Оверлеї/KSheet',
  component: KSheet,
  args: {
    open: true,
    title: 'Фільтри',
    description: 'Знайдено 1 240 відправлень',
    side: 'right',
    size: 'md',
    modal: true,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { KSheet, KDialogBody, KDialogFooter, KButton },
    setup: () => ({ args }),
    template: `<div class="k:min-h-[36rem]"><KSheet v-bind="args">
      <KDialogBody><p class="k:m-0 k:text-body-sm k:text-fg-muted">Вміст панелі: фільтри, деталі запису, форма.</p></KDialogBody>
      <KDialogFooter><KButton>Скинути</KButton><KButton variant="primary">Показати</KButton></KDialogFooter>
    </KSheet></div>`,
  }),
} satisfies Meta<typeof KSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Pravoruch: Story = { name: 'Праворуч' }
export const Znyzu: Story = { name: 'Знизу', args: { side: 'bottom' } }
