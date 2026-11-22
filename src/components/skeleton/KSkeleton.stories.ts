import type { Meta, StoryObj } from '@storybook/vue3-vite'

import KSkeleton from './KSkeleton.vue'

const meta = {
  title: 'Основи/KSkeleton',
  component: KSkeleton,
  render: () => ({
    components: { KSkeleton },
    template: `<div class="k:grid k:max-w-sm k:gap-3">
      <div class="k:flex k:items-center k:gap-3"><KSkeleton class="k:size-10 k:rounded-full" /><div class="k:grid k:flex-1 k:gap-2"><KSkeleton class="k:h-4 k:w-2/3" /><KSkeleton class="k:h-3 k:w-1/2" /></div></div>
      <KSkeleton class="k:h-24" />
    </div>`,
  }),
} satisfies Meta<typeof KSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
