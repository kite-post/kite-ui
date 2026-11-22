<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import { confirmState, settleConfirm } from './confirm'
import KAlertDialog from './KAlertDialog.vue'

// Один на застосунок: показує діалоги, викликані через useConfirm().
onMounted(() => confirmState.hosts++)
onBeforeUnmount(() => confirmState.hosts--)

function onOpen(v: boolean) {
  if (!v && confirmState.open) settleConfirm(false)
}
</script>

<template>
  <KAlertDialog
    v-if="confirmState.options"
    :open="confirmState.open"
    :title="confirmState.options.title"
    :description="confirmState.options.description"
    :confirm-label="confirmState.options.confirmLabel"
    :cancel-label="confirmState.options.cancelLabel"
    :tone="confirmState.options.tone ?? 'danger'"
    :confirm-text="confirmState.options.confirmText"
    @update:open="onOpen"
    @confirm="settleConfirm(true)"
  />
</template>
