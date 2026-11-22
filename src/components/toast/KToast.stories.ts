import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted } from 'vue'

import KButton from '../button/KButton.vue'
import { useToast } from './store'

// Тости показує KConfigProvider (його дає декоратор Storybook), викликає — useToast().
const meta = {
  title: 'Зворотний звʼязок/useToast',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tosty: Story = {
  name: 'Тости',
  render: () => ({
    components: { KButton },
    setup() {
      const toast = useToast()
      onMounted(() => {
        toast.dismiss('demo-1')
        toast({ id: 'demo-1', title: 'Адресу збережено', tone: 'success', duration: Infinity })
        toast({
          id: 'demo-2',
          title: 'Чернетку видалено',
          description: 'KT 1234 5678 5 UA',
          action: { label: 'Скасувати', onClick: () => {} },
          duration: Infinity,
        })
        toast({ id: 'demo-3', title: 'Не вдалося зберегти', tone: 'danger' })
      })
      return { toast }
    },
    template: `<div class="k:min-h-96 k:p-4 k:flex k:gap-2">
      <KButton size="sm" @click="toast.success('Адресу збережено')">success</KButton>
      <KButton size="sm" @click="toast.warning('Імпортовано 998 з 1 000', { description: '2 рядки пропущено' })">warning</KButton>
      <KButton size="sm" @click="toast.danger('Не вдалося оплатити')">danger</KButton>
    </div>`,
  }),
}
