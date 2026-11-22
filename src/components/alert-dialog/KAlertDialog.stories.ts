import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KAlertDialog from './KAlertDialog.vue'
import { useConfirm } from './confirm'

const meta = {
  title: 'Оверлеї/KAlertDialog',
  component: KAlertDialog,
  args: {
    open: true,
    title: 'Скасувати накладну KT 1234 5678 5 UA?',
    description: 'Кошти — 140 ₴ — повернуться на картку за 3 дні.',
    tone: 'danger',
    confirmLabel: 'Скасувати накладну',
    cancelLabel: 'Залишити',
  },
  argTypes: { tone: { control: 'inline-radio', options: ['danger', 'neutral'] } },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { KAlertDialog },
    setup: () => ({ args }),
    template: `<div class="k:min-h-[28rem]"><KAlertDialog v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof KAlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkrytyi: Story = { name: 'Відкритий' }
export const ZVvedenniam: Story = {
  name: 'З введенням',
  args: { confirmText: 'ВИДАЛИТИ', title: 'Видалити організацію?' },
}
export const UseConfirm: Story = {
  name: 'useConfirm()',
  parameters: { layout: 'padded' },
  render: () => ({
    components: { KButton },
    setup() {
      const confirm = useConfirm()
      const ask = () =>
        confirm({
          title: 'Вийти без збереження?',
          description: 'Зміни в накладній не збережуться.',
          confirmLabel: 'Вийти',
          tone: 'neutral',
        })
      return { ask }
    },
    template: `<KButton @click="ask">Відкрити підтвердження</KButton>`,
  }),
}
