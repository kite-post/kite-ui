import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KButton from '../button/KButton.vue'
import KField from '../field/KField.vue'
import KInput from '../input/KInput.vue'
import KDialog from './KDialog.vue'
import KDialogBody from './KDialogBody.vue'
import KDialogClose from './KDialogClose.vue'
import KDialogFooter from './KDialogFooter.vue'

const meta = {
  title: 'Оверлеї/KDialog',
  component: KDialog,
  subcomponents: { KDialogBody, KDialogFooter, KDialogClose },
  args: {
    open: true,
    title: 'Змінити отримувача',
    description: 'KT 1234 5678 5 UA · отримувач дізнається про зміну в SMS',
    size: 'md',
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { KDialog, KDialogBody, KDialogFooter, KDialogClose, KButton, KField, KInput },
    setup: () => ({ args }),
    template: `<div class="k:min-h-[36rem] k:p-4"><KDialog v-bind="args">
      <template #trigger><KButton>Змінити отримувача</KButton></template>
      <KDialogBody>
        <KField label="Ім’я та прізвище"><KInput model-value="Ірина Петренко" /></KField>
        <KField label="Телефон"><KInput prefix="+380" model-value="50 765 43 21" /></KField>
      </KDialogBody>
      <KDialogFooter><KDialogClose><KButton>Скасувати</KButton></KDialogClose><KButton variant="primary">Зберегти</KButton></KDialogFooter>
    </KDialog></div>`,
  }),
} satisfies Meta<typeof KDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Vidkrytyi: Story = { name: 'Відкритий' }
