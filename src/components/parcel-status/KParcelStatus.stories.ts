import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KParcelStatus from './KParcelStatus.vue'
import { PARCEL_STATUSES } from './meta'

const meta = {
  title: 'Домен/KParcelStatus',
  component: KParcelStatus,
  args: {
    status: 'IN_TRANSIT',
    params: { city: 'Львова', date: '2026-11-28' },
    partial: false,
    variant: 'badge',
    audience: 'client',
    size: 'md',
  },
  argTypes: {
    status: { control: 'select', options: PARCEL_STATUSES },
    variant: { control: 'inline-radio', options: ['badge', 'detailed'] },
    audience: { control: 'inline-radio', options: ['client', 'staff'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof KParcelStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const UsiStany: Story = {
  name: 'Усі стани',
  render: () => ({
    components: { KParcelStatus },
    setup: () => ({ statuses: PARCEL_STATUSES }),
    template: `<div class="k:grid k:gap-4">
      <div class="k:flex k:flex-wrap k:gap-2"><KParcelStatus v-for="s in statuses" :key="s" :status="s" :params="{ city: 'Львова', date: '2026-11-28' }" /></div>
      <div class="k:flex k:flex-wrap k:gap-2"><KParcelStatus v-for="s in statuses" :key="s" :status="s" audience="staff" size="sm" :params="{ city: 'Львів', date: '2026-11-28' }" /></div>
    </div>`,
  }),
}
export const Detalnyi: Story = {
  name: 'Детальний',
  args: {
    variant: 'detailed',
    status: 'READY_FOR_PICKUP',
    detail: 'Відділення №12, Львів · до 28 листопада',
  },
}
