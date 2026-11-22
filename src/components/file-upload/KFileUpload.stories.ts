import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KField from '../field/KField.vue'
import KFileUpload from './KFileUpload.vue'
import type { UploadItem } from './types'

const file = (name: string, size: number, type: string) =>
  new File(['x'.repeat(Math.min(size, 10))], name, { type })
const items: UploadItem[] = [
  {
    id: '1',
    file: file('vidpravky-lystopad-2026-final-version.csv', 18_400, 'text/csv'),
    status: 'done',
    progress: 100,
  },
  {
    id: '2',
    file: file('foto-poshkodzhennia.jpg', 2_400_000, 'image/jpeg'),
    status: 'uploading',
    progress: 45,
  },
  {
    id: '3',
    file: file('akt.pdf', 120_000, 'application/pdf'),
    status: 'error',
    progress: 0,
    error: 'Сервер не прийняв файл',
  },
]
const meta = {
  title: 'Складні поля/KFileUpload',
  component: KFileUpload,
  args: {
    accept: '.csv,text/csv',
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    variant: 'dropzone',
    disabled: false,
    invalid: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['dropzone', 'button'] },
    upload: { control: false },
  },
  render: (args) => ({
    components: { KField, KFileUpload },
    setup: () => ({ args }),
    template: `<KField label="Імпорт відправлень" class="k:max-w-lg"><KFileUpload v-bind="args" /></KField>`,
  }),
} satisfies Meta<typeof KFileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const StanyFailiv: Story = {
  name: 'Стани файлів',
  args: {
    modelValue: items,
    multiple: true,
    accept: 'image/*,.pdf,.csv',
    upload: async () => ({}),
  },
}
export const Knopka: Story = { name: 'Кнопка', args: { variant: 'button', accept: 'image/*,.pdf' } }
