import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KTrackingNumber from './KTrackingNumber.vue'

const meta = {
  title: 'Домен/KTrackingNumber',
  component: KTrackingNumber,
  args: { value: 'KT123456785UA', size: 'md', copyable: true, emphasis: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof KTrackingNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Varianty: Story = {
  name: 'Варіанти',
  render: () => ({
    components: { KTrackingNumber },
    template: `<div class="k:grid k:justify-items-start k:gap-3"><KTrackingNumber value="KT123456785UA" size="sm" /><KTrackingNumber value="KT123456785UA" emphasis /><KTrackingNumber value="KT123456785UA" size="lg" href="#parcel" /></div>`,
  }),
}
