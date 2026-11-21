<script setup lang="ts">
import { computed, getCurrentInstance, type Component } from 'vue'

import { cn } from '../../lib/cn'
import { cardPadding, useCard } from './context'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Рівень заголовка. h3 — типово (20/28 Unbounded). */
    titleAs?: 'h2' | 'h3' | 'h4'
    /** Зробити заголовок посиланням, що розтягується на всю картку. */
    titleHref?: string
    titleTo?: string | Record<string, unknown>
    class?: string
  }>(),
  {
    titleAs: 'h3',
  },
)

defineSlots<{ default?(): unknown; title?(): unknown; actions?(): unknown }>()

const card = useCard()
const p = computed(() => cardPadding[card.padding.value])
const RouterLink = getCurrentInstance()?.appContext.components.RouterLink as Component | undefined

const titleClass = computed(
  () =>
    ({
      h2: 'k:font-display k:text-h2',
      h3: 'k:font-display k:text-h3',
      h4: 'k:text-h4',
    })[props.titleAs],
)

const link = computed(() => {
  if (props.titleTo && RouterLink) return { is: RouterLink, attrs: { to: props.titleTo } }
  if (props.titleHref) return { is: 'a', attrs: { href: props.titleHref } }
  return null
})
</script>

<template>
  <div
    :class="
      cn('kite-card__header k:flex k:items-start k:gap-3', p.x, p.top, p.headerBottom, props.class)
    "
  >
    <div class="k:min-w-0 k:flex-1">
      <component :is="titleAs" v-if="title || $slots.title" :class="cn('k:m-0', titleClass)">
        <slot name="title">
          <component
            :is="link.is"
            v-if="link"
            v-bind="link.attrs"
            class="kite-card__stretch k:text-inherit k:no-underline k:outline-none k:after:absolute k:after:inset-0 k:after:rounded-[inherit] k:after:content-['']"
          >
            {{ title }}
          </component>
          <template v-else>{{ title }}</template>
        </slot>
      </component>
      <p v-if="description" class="k:mt-0.5 k:mb-0 k:text-body-sm k:text-fg-muted">
        {{ description }}
      </p>
      <slot />
    </div>
    <!-- Дії лежать над посиланням-розтяжкою і клікаються окремо. -->
    <div v-if="$slots.actions" class="k:relative k:z-[1] k:-my-1 k:flex k:shrink-0 k:gap-1">
      <slot name="actions" />
    </div>
  </div>
</template>
