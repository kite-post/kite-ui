<script setup lang="ts">
import { DialogClose } from 'reka-ui'

// Обгортка для кнопки, що закриває діалог або панель: <KDialogClose><KButton>Скасувати</KButton></KDialogClose>.
defineSlots<{ default(): unknown }>()
</script>

<template>
  <DialogClose as-child>
    <slot />
  </DialogClose>
</template>
