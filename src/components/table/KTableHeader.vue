<script setup lang="ts">
defineSlots<{ default?(): unknown }>()
</script>

<template>
  <thead class="kite-table-header">
    <slot />
  </thead>
</template>
