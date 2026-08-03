<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <img
    src="/logo.png"
    alt="Magical Wardrobe"
    :class="{
      'h-8 w-8': size === 'sm' || !size,
      'h-14 w-14': size === 'md',
      'h-24 w-24': size === 'lg',
    }"
    class="rounded-xl object-cover shadow-sm"
  >
</template>
