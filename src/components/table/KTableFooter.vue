<script setup lang="ts">
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <tfoot
    class="kite-table-footer k:font-semibold k:[&>tr>*]:border-t k:[&>tr>*]:border-b-0 k:[&>tr>*]:border-line k:[&>tr>*]:bg-surface-sunken"
  >
    <slot />
  </tfoot>
</template>
